/**
 * ============================================================================
 * MIDNIGHT PREVIEW DUST REGISTRATION CLI HELPER
 * ============================================================================
 * Official CLI helper to register unshielded tNight UTXOs for Dust Generation
 * on Midnight Preview testnet using `@midnight-ntwrk/wallet-sdk-facade` v1.2.0.
 *
 * Safety Guards:
 * - Preview network only
 * - Dry-run / Preflight mode by default (use --execute to submit on-chain)
 * - Zero key/seed exposure
 * ============================================================================
 */

import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { UnshieldedWallet } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { LedgerParameters, DustSecretKey, signingKeyFromBip340, signatureVerifyingKey, signData, sampleSigningKey } from '@midnight-ntwrk/ledger-v8';
import { ZswapSecretKeys } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { UnshieldedAddress, ShieldedAddress, ShieldedCoinPublicKey, ShieldedEncryptionPublicKey, MidnightBech32m } from '@midnight-ntwrk/wallet-sdk-address-format';
import { PolkadotNodeClient, makeConfig } from '@midnight-ntwrk/wallet-sdk-node-client';
import { SerializedTransaction } from '@midnight-ntwrk/wallet-sdk-abstractions';
import { filter, firstValueFrom } from 'rxjs';
import { performDeploymentPreflight } from '../src/deploy.js';
import { getActiveNetworkConfig } from '../src/network.js';

export function extractUtxoWithMetaObjects(target: any): any[] {
  const results: any[] = [];
  function search(obj: any) {
    if (!obj || typeof obj !== 'object') return;
    if (obj.utxo && typeof obj.utxo === 'object' && obj.meta && typeof obj.meta === 'object') {
      results.push(obj);
      return;
    }
    if (Array.isArray(obj)) {
      for (const item of obj) search(item);
    } else {
      for (const key of Object.keys(obj)) search(obj[key]);
    }
  }
  search(target);
  return results;
}

export async function runDustRegistration(executeOnChain: boolean = false) {
  const preflight = performDeploymentPreflight();
  const network = getActiveNetworkConfig();

  if (preflight.networkId !== 'preview') {
    throw new Error(`[Dust Registration Error] Dust registration is restricted to 'preview' network. Active: ${preflight.networkId}`);
  }

  const seedBytes = Buffer.from(preflight.seedHex, 'hex');
  const secretKeys = ZswapSecretKeys.fromSeed(seedBytes);
  const dustSecretKey = DustSecretKey.fromSeed(seedBytes);
  const coinPkHex = secretKeys.coinPublicKey;
  const encPkHex = secretKeys.encryptionPublicKey;

  const coinPkBuffer = Buffer.from(coinPkHex, 'hex');
  const unshieldedAddrObj = new UnshieldedAddress(coinPkBuffer);
  const unshieldedAddr = MidnightBech32m.encode('preview', unshieldedAddrObj).asString();

  const coinPk = ShieldedCoinPublicKey.fromHexString(coinPkHex);
  const encPk = ShieldedEncryptionPublicKey.fromHexString(encPkHex);
  const shieldedAddrObj = new ShieldedAddress(coinPk, encPk);
  const shieldedAddr = MidnightBech32m.encode('preview', shieldedAddrObj).asString();

  const signingKey = signingKeyFromBip340(seedBytes);
  const nightVerifyingKey = signatureVerifyingKey(signingKey);
  const signDustRegistration = (data: Uint8Array) => signData(signingKey, data);

  console.log(`\n================================================================`);
  console.log(`[Midnight Dust Registration CLI] Pre-Flight & Execution Pipeline`);
  console.log(`================================================================`);
  console.log(`• Network                      : ${preflight.networkId}`);
  console.log(`• Node RPC Endpoint            : ${network.nodeRpcUrl}`);
  console.log(`• Indexer Endpoint             : ${network.indexerUrl}`);
  console.log(`• Unshielded Address (Faucet)  : ${unshieldedAddr}`);
  console.log(`• Shielded Address             : ${shieldedAddr}`);
  console.log(`• Signature Verifying Key      : ${Buffer.from(nightVerifyingKey).toString('hex')}`);
  console.log(`• Execution Mode               : ${executeOnChain ? "LIVE ON-CHAIN BROADCAST (--execute)" : "DRY RUN / PREFLIGHT (Validation Only)"}`);
  console.log(`----------------------------------------------------------------`);

  console.log(`[1/4] Synchronizing WalletFacade with Midnight Preview Indexer...`);

  const config = {
    networkId: preflight.networkId || 'preview',
    costParameters: {
      feeBlocksMargin: 10,
    },
    indexerClientConnection: {
      indexerHttpUrl: network.indexerUrl,
      indexerWsUrl: network.indexerWsUrl,
    },
    relayURL: network.nodeRpcUrl.replace(/^http/, 'ws'),
    provingServerUrl: network.proofServerUrl,
  };
  const ledgerParams = LedgerParameters.initialParameters();
  const dustParams = ledgerParams.dust;

  const publicKeyObject = {
    address: unshieldedAddr,
    addressHex: coinPkHex
  };

  let walletFacade: WalletFacade | undefined;
  try {
    try {
      walletFacade = await WalletFacade.init({
        configuration: config as any,
        shielded: (cfg) => ShieldedWallet(cfg as any).startWithSeed(seedBytes),
        unshielded: (cfg) => UnshieldedWallet(cfg as any).startWithPublicKey(publicKeyObject as any),
        dust: (cfg) => DustWallet(cfg as any).startWithSeed(seedBytes, dustParams),
      });

      await walletFacade.shielded.start(secretKeys);
      await walletFacade.unshielded.start();
      await walletFacade.dust.start(dustSecretKey);
    } catch (initErr: any) {
      throw new Error(`[Dust Registration Error] Failed to initialize WalletFacade: ${initErr?.message || initErr}`);
    }

    const facadeState: any = await firstValueFrom(
      walletFacade.state().pipe(
        filter((s: any) => {
          const utxos = extractUtxoWithMetaObjects(s?.unshielded?.state);
          return utxos.length > 0;
        })
      )
    );

    console.log(`✅ Indexer synchronization active & UTXOs discovered.`);

    console.log(`[2/4] Searching for unregistered unshielded tNight UTXOs...`);

    const allAvailableUtxos = extractUtxoWithMetaObjects(facadeState?.unshielded?.state);

    if (allAvailableUtxos.length === 0) {
      throw new Error(
        `[Dust Registration Error] Aborted: No available unshielded UTXOs found for address ${unshieldedAddr}.\n` +
        `Please ensure the faucet transaction has been confirmed on Preview testnet.`
      );
    }

    const unregisteredNightUtxos = allAvailableUtxos.filter((u: any) => u?.meta?.registeredForDustGeneration === false);

    console.log(`• Total Unshielded UTXOs Found : ${allAvailableUtxos.length}`);
    console.log(`• Unregistered NIGHT UTXOs     : ${unregisteredNightUtxos.length}`);

    if (unregisteredNightUtxos.length === 0) {
      console.log(`\n✅ All available tNight UTXOs are already registered for Dust Generation!`);
      console.log(`No further registration transaction is needed.`);
      return;
    }

    const targetUtxo = unregisteredNightUtxos[0];
    const nightAmount = targetUtxo.utxo.value;
    console.log(`• Selected Target UTXO Intent  : ${targetUtxo.utxo.intentHash}#${targetUtxo.utxo.outputNo}`);
    console.log(`• Selected UTXO tNight Balance : ${Number(nightAmount) / 1_000_000_000} tNight (${nightAmount.toString()} raw units)`);

    // Explicit Preflight Diagnostics before registerNightUtxosForDustGeneration
    if (!unregisteredNightUtxos || unregisteredNightUtxos.length === 0) {
      throw new Error("[Preflight Check Failed] Dust registration argument 'nightUtxos' is empty or undefined.");
    }
    if (!nightVerifyingKey) {
      throw new Error("[Preflight Check Failed] Dust registration argument 'nightVerifyingKey' is undefined.");
    }
    if (typeof signDustRegistration !== "function") {
      throw new Error("[Preflight Check Failed] Dust registration argument 'signDustRegistration' callback is undefined or not a function.");
    }

    console.log(`\n[3/4] Estimating Dust registration fee & awaiting accrued Dust threshold...`);
    let fee: bigint;
    try {
      const est = await Promise.race([
        walletFacade.estimateRegistration(unregisteredNightUtxos),
        new Promise<never>((_, r) => setTimeout(() => r(new Error("estimateRegistration timeout")), 3000))
      ]);
      fee = est.fee;
    } catch {
      const fakeSigningKey = sampleSigningKey();
      const fakeVerifyingKey = signatureVerifyingKey(fakeSigningKey);
      const dustAddress = await walletFacade.dust.getAddress();
      const fakeUnsignedTx = await walletFacade.dust.createDustGenerationTransaction(
        undefined,
        walletFacade.defaultTtl(),
        unregisteredNightUtxos.map(({ utxo, meta }) => ({
          ...utxo,
          ctime: meta.ctime,
          registeredForDustGeneration: meta.registeredForDustGeneration,
        })),
        fakeVerifyingKey,
        dustAddress
      );
      const intent = fakeUnsignedTx.intents?.get(1)!;
      const signature = signData(fakeSigningKey, intent.signatureData(1));
      const fakeSignedTx = await walletFacade.dust.addDustGenerationSignature(fakeUnsignedTx, signature);
      const finalizedFakeTx = fakeSignedTx.mockProve().bind();
      fee = await walletFacade.calculateTransactionFee(finalizedFakeTx);
    }

    const requiredDustThreshold = fee + 2n;
    console.log(`• Estimated Registration Fee   : ${fee.toString()} raw Dust units`);
    console.log(`• Required Dust Safety Threshold: ${requiredDustThreshold.toString()} raw Dust units (fee + 2 safety margin)`);

    console.log(`• Waiting for generated Dust to reach safety threshold (${requiredDustThreshold.toString()} units)...`);
    await walletFacade.waitForGeneratedDust(unregisteredNightUtxos, requiredDustThreshold, { timeoutMs: 300000 });
    console.log(`✅ Accrued Dust threshold verified (${requiredDustThreshold.toString()} raw Dust units confirmed available).`);

    if (!executeOnChain) {
      console.log(`\n================================================================`);
      console.log(`[PREFLIGHT COMPLETED SUCCESSFULLY]`);
      console.log(`================================================================`);
      console.log(`1 unregistered tNight UTXO (${Number(nightAmount) / 1_000_000_000} tNight) is ready for registration.`);
      console.log(`• Estimated Registration Fee   : ${fee.toString()} raw Dust units`);
      console.log(`• Required Safety Threshold    : ${requiredDustThreshold.toString()} raw Dust units`);
      console.log(`• Accrued Dust Threshold Status: VERIFIED & CONFIRMED`);
      console.log(`All required arguments and SDK configuration parameters verified.`);
      console.log(`To execute this registration on-chain, run:`);
      console.log(`  npx tsx scripts/register-dust.ts --execute`);
      console.log(`================================================================\n`);
      return;
    }

    console.log(`[4/4] Constructing & signing Dust Registration transaction recipe...`);

    try {
      const recipe = await walletFacade.registerNightUtxosForDustGeneration(
        unregisteredNightUtxos,
        nightVerifyingKey,
        signDustRegistration
      );

      console.log(`Finalizing & broadcasting Dust Registration transaction...`);
      const signedRecipe = await walletFacade.signRecipe(recipe, signDustRegistration);
      const finalizedTx = await walletFacade.finalizeRecipe(signedRecipe);

      let txId = "";
      if (typeof (finalizedTx as any).identifiers === "function") {
        const ids = (finalizedTx as any).identifiers();
        txId = ids?.[0] ? String(ids[0]) : "";
      }
      if (!txId && (finalizedTx as any)?.id) {
        txId = typeof (finalizedTx as any).id === "function" ? (finalizedTx as any).id() : String((finalizedTx as any).id);
      }

      console.log(`• Resolved Transaction ID: ${txId || "N/A"}`);
      console.log(`• Submitting via PolkadotNodeClient to ${config.relayURL}...`);

      const nodeClient = await PolkadotNodeClient.init(
        makeConfig({
          nodeURL: config.relayURL,
        })
      );

      let statusState: 'SUBMITTED' | 'CONFIRMED' | 'FAILED' = 'FAILED';
      const SUBMISSION_TIMEOUT_MS = 30000;

      try {
        const submissionPromise = nodeClient.sendMidnightTransactionAndWait(
          SerializedTransaction.from(finalizedTx),
          'Submitted'
        );
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error(`[Timeout] Transaction submission timed out after ${SUBMISSION_TIMEOUT_MS / 1000}s`)),
            SUBMISSION_TIMEOUT_MS
          );
        });

        const submissionResult: any = await Promise.race([submissionPromise, timeoutPromise]);
        statusState = 'SUBMITTED';

        if (submissionResult?.txHash) {
          txId = submissionResult.txHash;
        }

        console.log(`\n================================================================`);
        console.log(`[TRANSACTION STATUS: SUBMITTED]`);
        console.log(`================================================================`);
        console.log(`• Status         : SUBMITTED`);
        console.log(`• Transaction ID : ${txId}`);
        console.log(`• Target UTXO    : ${targetUtxo.utxo.intentHash}#${targetUtxo.utxo.outputNo}`);
        console.log(`• Explorer Link  : https://explorer.preview.midnight.network/tx/${txId}`);
        console.log(`• Note           : Accepted into node mempool. Polling indexer for confirmation...`);
        console.log(`----------------------------------------------------------------`);
      } catch (subErr: any) {
        statusState = 'FAILED';
        const errorTag = subErr?._tag || subErr?.name || 'UnknownError';
        const causeMsg = subErr?.cause?.message || subErr?.cause?.toString() || subErr?.message || String(subErr);
        const rpcCode = subErr?.cause?.code ?? subErr?.code ?? 'N/A';
        const rpcData = subErr?.cause?.data ? (typeof subErr.cause.data === 'object' ? JSON.stringify(subErr.cause.data) : String(subErr.cause.data)) : 'N/A';

        console.error(`\n❌ [TRANSACTION STATUS: FAILED]`);
        console.error(`• Status         : FAILED`);
        console.error(`• Error Tag      : ${errorTag}`);
        console.error(`• Error Message  : ${subErr?.message || subErr}`);
        console.error(`• Cause Message  : ${causeMsg}`);
        console.error(`• RPC Error Code : ${rpcCode}`);
        console.error(`• RPC Error Data : ${rpcData}`);
        if (subErr?.cause) {
          console.error(`• Cause Raw Object :`, subErr.cause);
        }
        throw new Error(`[Dust Registration Submission Failed] [Tag: ${errorTag}] ${subErr?.message || subErr}. Cause: ${causeMsg} (Code: ${rpcCode}, Data: ${rpcData})`);
      } finally {
        // Disconnect node client ONLY after submission promise has resolved or rejected
        await nodeClient.close().catch(() => {});
      }

      if (statusState === 'SUBMITTED') {
        console.log(`[Indexer Check] Polling Midnight Preview indexer for on-chain confirmation...`);
        const POLL_TIMEOUT_MS = 60000;
        const POLL_INTERVAL_MS = 5000;
        const startTime = Date.now();
        let isConfirmed = false;

        while (Date.now() - startTime < POLL_TIMEOUT_MS) {
          try {
            const latestState: any = await firstValueFrom(walletFacade.unshielded.state);
            const currentUtxos = extractUtxoWithMetaObjects(latestState?.state);
            const matchingTarget = currentUtxos.find(
              (u: any) => u?.utxo?.intentHash === targetUtxo.utxo.intentHash && u?.utxo?.outputNo === targetUtxo.utxo.outputNo
            );
            if (matchingTarget && matchingTarget.meta?.registeredForDustGeneration === true) {
              isConfirmed = true;
              break;
            }
          } catch {
            // Continue polling until timeout
          }
          await new Promise((res) => setTimeout(res, POLL_INTERVAL_MS));
        }

        if (isConfirmed) {
          statusState = 'CONFIRMED';
          console.log(`\n================================================================`);
          console.log(`[TRANSACTION STATUS: CONFIRMED]`);
          console.log(`================================================================`);
          console.log(`• Status        : CONFIRMED on Midnight Preview Indexer`);
          console.log(`• Transaction ID: ${txId}`);
          console.log(`• Registered    : UTXO ${targetUtxo.utxo.intentHash}#${targetUtxo.utxo.outputNo} is now registered for Dust Generation!`);
          console.log(`• Explorer Link : https://explorer.preview.midnight.network/tx/${txId}`);
          console.log(`================================================================\n`);
        } else {
          console.log(`\n================================================================`);
          console.log(`[TRANSACTION STATUS: SUBMITTED (Awaiting Block Inclusion)]`);
          console.log(`================================================================`);
          console.log(`• Status        : SUBMITTED (Broadcast to node mempool, awaiting indexing)`);
          console.log(`• Transaction ID: ${txId}`);
          console.log(`• Explorer Link : https://explorer.preview.midnight.network/tx/${txId}`);
          console.log(`================================================================\n`);
        }
      }
    } catch (err: any) {
      throw new Error(`[Dust Registration On-Chain Failure] ${err?.message || err}`);
    }
  } finally {
    if (walletFacade) {
      await walletFacade.stop().catch(() => {});
    }
  }
}

if (typeof process !== "undefined" && process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, "/"))) {
  const executeArg = process.argv.includes("--execute");
  runDustRegistration(executeArg).catch((err) => {
    console.error("\n❌ [Dust Registration Aborted]", err?.message || err);
    process.exit(1);
  });
}
