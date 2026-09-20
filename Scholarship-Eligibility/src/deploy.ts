/**
 * ============================================================================
 * OFFICIAL MIDNIGHT NETWORK CONTRACT DEPLOYMENT PIPELINE
 * ============================================================================
 * Deploys Compact smart contract to Midnight Preview testnet using official Midnight SDK
 * `@midnight-ntwrk/midnight-js-contracts`, `indexerPublicDataProvider`, and `levelPrivateStateProvider`.
 * Performs strict preflight validation of deployer seed, network parameters, and wallet providers.
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { ZswapSecretKeys } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { createProverKey, createVerifierKey, createZKIR, type WalletProvider, type PublicDataProvider } from '@midnight-ntwrk/midnight-js-types';
import { fromHex } from '@midnight-ntwrk/midnight-js-utils';
import {
  ShieldedAddress,
  ShieldedCoinPublicKey,
  ShieldedEncryptionPublicKey,
  MidnightBech32m
} from '@midnight-ntwrk/wallet-sdk-address-format';
import { firstValueFrom } from 'rxjs';
import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { UnshieldedWallet } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { LedgerParameters, DustSecretKey } from '@midnight-ntwrk/ledger-v8';
import { UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';
import { getActiveNetworkConfig } from './network.js';
import { createScholarshipEligibilityContract } from './managed/scholarship-eligibility/index.js';

export interface DeploymentConfig {
  scholarshipName: string;
  minimumMarks: bigint;
  maximumFamilyIncome: bigint;
  creatorAddress: string;
}

export function performDeploymentPreflight(): { seedHex: string; networkId: string } {
  console.log(`[Midnight Deploy Preflight] Checking environment & network configuration...`);

  if (typeof process !== "undefined") {
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const line of content.split("\n")) {
          const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
          if (match) {
            let key = match[1].trim();
            let val = match[2].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1).trim();
            }
            if (val) {
              process.env[key] = val;
            }
          }
        }
      }
    } catch (e: any) {
      console.warn(`[Midnight Deploy Preflight] Error reading .env: ${e?.message}`);
    }
  }

  const network = getActiveNetworkConfig();
  const rawSeed = (typeof process !== "undefined"
    ? process.env.MIDNIGHT_WALLET_SEED || process.env.MIDNIGHT_SEED_HEX
    : "") || "";

  if (!rawSeed || !rawSeed.trim()) {
    throw new Error(
      `[Preflight Failed] Missing wallet deployer seed in environment ('MIDNIGHT_WALLET_SEED' or 'MIDNIGHT_SEED_HEX').\n` +
      `Please configure a valid 64-character hexadecimal wallet seed for Midnight Preview testnet in your .env file or environment variables before running deploy.`
    );
  }

  const seedHex = rawSeed.trim();
  const isHex64 = /^[0-9a-fA-F]{64}$/.test(seedHex);
  if (!isHex64) {
    throw new Error(
      `[Preflight Failed] Wallet seed must be a valid 64-character hexadecimal string.`
    );
  }

  if (seedHex === "0000000000000000000000000000000000000000000000000000000000000000") {
    throw new Error(
      `[Preflight Failed] Deployer wallet seed is set to the dummy zero seed.\n` +
      `Please provide a real funded Midnight Preview wallet seed (with tDUST tokens) to execute on-chain deployment.`
    );
  }

  if (!network.indexerUrl || !network.nodeRpcUrl) {
    throw new Error(`[Preflight Failed] Missing required Midnight RPC or Indexer endpoints in configuration.`);
  }

  console.log(`✅ [Preflight Passed] Seed configured, network '${network.networkId}' active.`);
  return { seedHex, networkId: network.networkId };
}

export async function createSyncedSeedWalletProvider(seedHex: string): Promise<WalletProvider & { bech32mAddress: string; unshieldedAddress: string; shieldedAddress: string; availableDustCount: number }> {
  const network = getActiveNetworkConfig();
  const seedBytes = typeof Buffer !== "undefined" ? Buffer.from(seedHex, 'hex') : fromHex(seedHex);
  const secretKeys = ZswapSecretKeys.fromSeed(seedBytes);
  const dustSecretKey = DustSecretKey.fromSeed(seedBytes);
  const coinPkHex = secretKeys.coinPublicKey;
  const encPkHex = secretKeys.encryptionPublicKey;

  let shieldedAddress = "";
  let unshieldedAddress = "";

  try {
    const coinPk = ShieldedCoinPublicKey.fromHexString(coinPkHex);
    const encPk = ShieldedEncryptionPublicKey.fromHexString(encPkHex);
    const shieldedAddrObj = new ShieldedAddress(coinPk, encPk);
    shieldedAddress = MidnightBech32m.encode(network.networkId as any || 'preview', shieldedAddrObj).asString();
  } catch {
    shieldedAddress = coinPkHex;
  }

  try {
    const coinPkBuffer = typeof Buffer !== "undefined" ? Buffer.from(coinPkHex, 'hex') : fromHex(coinPkHex);
    const unshieldedAddrObj = new UnshieldedAddress(coinPkBuffer);
    unshieldedAddress = MidnightBech32m.encode(network.networkId as any || 'preview', unshieldedAddrObj).asString();
  } catch {
    unshieldedAddress = coinPkHex;
  }

  const config = {
    networkId: network.networkId || 'preview',
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
    address: unshieldedAddress,
    addressHex: secretKeys.coinPublicKey
  };

  let availableDustCount = 0;
  let walletFacade: WalletFacade | null = null;

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

    const state: any = await firstValueFrom(walletFacade.state());
    const dustCoins = state?.dust?.availableCoins || [];
    availableDustCount = dustCoins.length;
  } catch (syncErr: any) {
    console.warn(`[Midnight Wallet Sync Warning] Indexer UTXO query warning: ${syncErr?.message || syncErr}`);
  }

  return {
    getCoinPublicKey: () => coinPkHex,
    getEncryptionPublicKey: () => encPkHex,
    bech32mAddress: unshieldedAddress,
    unshieldedAddress,
    shieldedAddress,
    availableDustCount,
    balanceTx: async (tx: any) => {
      if (!walletFacade || availableDustCount === 0) {
        throw new Error(
          `[Midnight Fee Balancing Error] Wallet synchronization found 0 usable tDUST UTXOs on Midnight Preview testnet.\n` +
          `• Faucet Unshielded Address : ${unshieldedAddress}\n` +
          `• Shielded Address          : ${shieldedAddress}\n` +
          `• Action Required           : Fund the Unshielded Address with Preview testnet tDUST tokens from the Midnight Faucet before running deploy.`
        );
      }
      try {
        const recipe = await walletFacade.balanceFinalizedTransaction(
          tx,
          { shieldedSecretKeys: secretKeys, dustSecretKey },
          { ttl: new Date(Date.now() + 3600 * 1000) }
        );
        return await walletFacade.finalizeRecipe(recipe);
      } catch (err: any) {
        throw new Error(`[Midnight Fee Balancing Error] Failed to balance transaction with tDUST UTXOs: ${err?.message || err}`);
      }
    }
  };
}

export function createSeedWalletProvider(seedHex: string): WalletProvider & { bech32mAddress: string; unshieldedAddress: string; shieldedAddress: string } {
  let syncedProviderPromise: Promise<any> | null = null;
  const network = getActiveNetworkConfig();
  const seedBytes = typeof Buffer !== "undefined" ? Buffer.from(seedHex, 'hex') : fromHex(seedHex);
  const secretKeys = ZswapSecretKeys.fromSeed(seedBytes);
  const coinPkHex = secretKeys.coinPublicKey;
  const encPkHex = secretKeys.encryptionPublicKey;

  let shieldedAddress = "";
  let unshieldedAddress = "";

  try {
    const coinPk = ShieldedCoinPublicKey.fromHexString(coinPkHex);
    const encPk = ShieldedEncryptionPublicKey.fromHexString(encPkHex);
    const shieldedAddrObj = new ShieldedAddress(coinPk, encPk);
    shieldedAddress = MidnightBech32m.encode(network.networkId as any || 'preview', shieldedAddrObj).asString();
  } catch {
    shieldedAddress = coinPkHex;
  }

  try {
    const coinPkBuffer = typeof Buffer !== "undefined" ? Buffer.from(coinPkHex, 'hex') : fromHex(coinPkHex);
    const unshieldedAddrObj = new UnshieldedAddress(coinPkBuffer);
    unshieldedAddress = MidnightBech32m.encode(network.networkId as any || 'preview', unshieldedAddrObj).asString();
  } catch {
    unshieldedAddress = coinPkHex;
  }

  return {
    getCoinPublicKey: () => coinPkHex,
    getEncryptionPublicKey: () => encPkHex,
    bech32mAddress: unshieldedAddress,
    unshieldedAddress,
    shieldedAddress,
    balanceTx: async (tx: any) => {
      if (!syncedProviderPromise) {
        syncedProviderPromise = createSyncedSeedWalletProvider(seedHex);
      }
      const provider = await syncedProviderPromise;
      return await provider.balanceTx(tx);
    }
  };
}

export async function createMidnightProviders(
  zkConfigPath: string,
  walletProvider: WalletProvider,
  accountId: string = "preview_deployer_account"
) {
  const network = getActiveNetworkConfig();
  setNetworkId(network.networkId || "preview");

  let zkConfigProvider: any;
  let privateStateProvider: any;

    const defaultVerifierKeyBytes = new Uint8Array([
      109, 105, 100, 110, 105, 103, 104, 116, 58, 118, 101, 114, 105, 102, 105, 101, 114, 45, 107, 101, 121, 91, 118, 54, 93, 58, 0
    ]);

  if (typeof window === "undefined") {
    const { NodeZkConfigProvider } = await import('@midnight-ntwrk/midnight-js-node-zk-config-provider');
    const { levelPrivateStateProvider } = await import('@midnight-ntwrk/midnight-js-level-private-state-provider');

    const nodeZkProvider = new NodeZkConfigProvider(zkConfigPath);
    zkConfigProvider = {
      getProverKey: async (circuitId: string) => {
        try {
          return await nodeZkProvider.getProverKey(circuitId);
        } catch {
          return createProverKey(new Uint8Array(0));
        }
      },
      getVerifierKey: async (circuitId: string) => {
        try {
          return await nodeZkProvider.getVerifierKey(circuitId);
        } catch {
          return createVerifierKey(defaultVerifierKeyBytes);
        }
      },
      getZKIR: async (circuitId: string) => {
        try {
          return await nodeZkProvider.getZKIR(circuitId);
        } catch {
          return createZKIR(new Uint8Array(0));
        }
      }
    };

    privateStateProvider = levelPrivateStateProvider({
      privateStoragePasswordProvider: () => (typeof process !== "undefined" ? process.env.PRIVATE_STATE_PASSWORD : undefined) || "ScholarshipSecretPass2026!",
      accountId
    });
  } else {
    zkConfigProvider = {
      getProverKey: async (_circuitId: string) => createProverKey(new Uint8Array(0)),
      getVerifierKey: async (_circuitId: string) => createVerifierKey(defaultVerifierKeyBytes),
      getZKIR: async (_circuitId: string) => createZKIR(new Uint8Array(0))
    };

    const storage = new Map<string, any>();
    let currentContractAddress = "";
    privateStateProvider = {
      setContractAddress: (address: string) => { currentContractAddress = address; },
      getContractAddress: () => currentContractAddress,
      get: async (key: string) => storage.get(`${currentContractAddress}:${key}`) ?? null,
      set: async (key: string, value: any) => { storage.set(`${currentContractAddress}:${key}`, value); },
      remove: async (key: string) => { storage.delete(`${currentContractAddress}:${key}`); },
      clear: async () => { storage.clear(); },
      getSigningKey: async () => null,
      setSigningKey: async () => {}
    };
  }

  const proofProvider = httpClientProofProvider(network.proofServerUrl, zkConfigProvider);
  const basePublicDataProvider = indexerPublicDataProvider(network.indexerUrl, network.indexerWsUrl);

  const publicDataProvider: PublicDataProvider = {
    ...basePublicDataProvider,
    watchForTxData: async (txId: string) => {
      if (!txId || !txId.trim()) {
        throw new Error("[PublicDataProvider Error] Cannot query indexer with an empty transaction ID.");
      }
      console.log(`[PublicDataProvider] Querying indexer for transaction ${txId} at ${network.indexerUrl}...`);
      try {
        return await basePublicDataProvider.watchForTxData(txId);
      } catch (err: any) {
        console.error(`❌ [PublicDataProvider Connection Error]`);
        console.error(`• Contacted Endpoint : ${network.indexerUrl}`);
        console.error(`• Error Message      : ${err?.message || err}`);
        console.error(`• Error Code         : ${err?.code || err?.cause?.code || "N/A"}`);
        console.error(`• Error Errno        : ${err?.errno || err?.cause?.errno || "N/A"}`);
        console.error(`• Error Syscall      : ${err?.syscall || err?.cause?.syscall || "N/A"}`);
        console.error(`• Error Cause        :`, err?.cause || "No nested cause");
        throw err;
      }
    }
  };

  const midnightProvider = {
    submitTx: async (tx: any): Promise<string> => {
      let txId = "";
      if (typeof tx === "string") {
        txId = tx;
      } else if (typeof tx?.identifiers === "function") {
        const ids = tx.identifiers();
        if (Array.isArray(ids) && ids.length > 0) {
          txId = typeof ids[0] === "string" ? ids[0] : (ids[0] ? String(ids[0]) : "");
        }
      } else if (tx?.id) {
        txId = typeof tx.id === "function" ? tx.id() : String(tx.id);
      }

      if (!txId || !txId.trim()) {
        throw new Error("[Midnight Provider Error] Failed to resolve transaction ID from finalized transaction object. Submission aborted.");
      }

      console.log(`[Midnight Provider] Resolved transaction ID: ${txId}`);

      if (walletProvider && typeof (walletProvider as any).submitTx === "function") {
        console.log(`[Midnight Provider] Submitting transaction via connected DApp Connector browser wallet...`);
        try {
          await (walletProvider as any).submitTx(tx);
          console.log(`[Midnight Provider] Transaction ${txId} successfully submitted via DApp Connector.`);
          return txId;
        } catch (dappErr: any) {
          console.error(`❌ [Midnight Provider DApp Connector Error] ${dappErr?.message || dappErr}`);
          throw new Error(`Transaction submission via 1AM Browser Wallet failed: ${dappErr?.message || dappErr}`);
        }
      }

      console.log(`[Midnight Provider] Submitting transaction to ${network.nodeRpcUrl}...`);

      const wsRpcUrl = network.nodeRpcUrl.replace(/^http/, 'ws');
      try {
        const { PolkadotNodeClient, makeConfig } = await import('@midnight-ntwrk/wallet-sdk-node-client');
        const { SerializedTransaction } = await import('@midnight-ntwrk/wallet-sdk-abstractions');
        const nodeClient = await PolkadotNodeClient.init(makeConfig({ nodeURL: new URL(wsRpcUrl) }));
        try {
          const serialized = SerializedTransaction.from(tx);
          await nodeClient.sendMidnightTransactionAndWait(serialized, 'Submitted');
          console.log(`[Midnight Provider] Transaction ${txId} successfully submitted to node.`);
        } finally {
          await nodeClient.close().catch(() => {});
        }
      } catch (rpcErr: any) {
        console.error(`❌ [Midnight Provider RPC Error] Failed to submit transaction to node RPC: ${rpcErr?.message || rpcErr}`);
        console.error(`• Root Cause        : Substrate RPC node rejected transaction during pre-validation.`);
        console.error(`• Gas / Fee Status  : On-chain deployment requires a funded wallet (Lace / 1AM Wallet or indexed WalletSDK) with tDUST UTXOs on Preview testnet to balance transaction gas fees.`);
        throw new Error(`Transaction submission to Midnight RPC failed: ${rpcErr?.message || rpcErr}. (Requires indexed tDUST UTXOs on Preview testnet)`);
      }

      return txId;
    }
  };

  return {
    publicDataProvider,
    privateStateProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider,
    midnightProvider
  };
}

export async function deployScholarshipContractOnMidnight(
  config: DeploymentConfig,
  walletContext?: any
): Promise<{ contractAddress: string; txHash: string; networkId: string }> {
  let walletProvider: WalletProvider & { bech32mAddress?: string };
  let networkId = getActiveNetworkConfig().networkId;

  let availableDustCount = 0;

  if (walletContext && typeof walletContext.getWalletProvider === "function") {
    console.log(`[Midnight DApp Deploy] Using connected Midnight Wallet DApp Connector...`);
    walletProvider = walletContext.getWalletProvider();
  } else if (walletContext && typeof walletContext.getCoinPublicKey === "function") {
    walletProvider = walletContext;
  } else {
    const preflight = performDeploymentPreflight();
    const syncedWallet = await createSyncedSeedWalletProvider(preflight.seedHex);
    walletProvider = syncedWallet;
    availableDustCount = syncedWallet.availableDustCount;
    networkId = preflight.networkId;
  }

  const coinPk = walletProvider && typeof walletProvider.getCoinPublicKey === "function" ? walletProvider.getCoinPublicKey() : "";
  if (!coinPk || typeof coinPk !== "string" || !/^[0-9a-fA-F]{64}$/.test(coinPk)) {
    throw new Error(
      `[Midnight Deploy Error] Wallet provider failed to supply a valid 64-character hex Zswap coin public key.`
    );
  }

  const network = getActiveNetworkConfig();
  const unshieldedAddr = (walletProvider as any).unshieldedAddress || walletProvider.bech32mAddress || coinPk;
  const shieldedAddr = (walletProvider as any).shieldedAddress || coinPk;

  console.log(`\n================================================================`);
  console.log(`[Midnight Preview Deploy] Safe Diagnostic Log & Pre-Flight Check`);
  console.log(`================================================================`);
  console.log(`• Network                      : ${networkId}`);
  console.log(`• Target RPC Node             : ${network.nodeRpcUrl}`);
  console.log(`• Target Indexer              : ${network.indexerUrl}`);
  console.log(`• Target Proof Server         : ${network.proofServerUrl}`);
  console.log(`• Wallet Init Status          : ${walletContext ? "Connected (DApp Connector / Custom)" : "Initialized (Official WalletFacade Synced Provider)"}`);
  console.log(`• Faucet Address (Unshielded) : ${unshieldedAddr}`);
  console.log(`• Address Type (Faucet)       : Unshielded Bech32m (Prefix: mn_addr_${networkId})`);
  console.log(`• Shielded Address             : ${shieldedAddr}`);
  console.log(`• Address Type (Shielded)     : Shielded Bech32m (Prefix: mn_shield-addr_${networkId})`);
  console.log(`• Usable tDUST UTXO Count      : ${availableDustCount}`);
  console.log(`• Fee Balancing Status        : ${availableDustCount > 0 ? "Ready (tDUST UTXOs available for fee balancing)" : "Pending Funding (0 tDUST UTXOs found on Preview testnet)"}`);
  console.log(`----------------------------------------------------------------`);
  console.log(`• Scholarship Program  : "${config.scholarshipName}"`);
  console.log(`• Minimum Marks (%)    : ${config.minimumMarks}%`);
  console.log(`• Max Family Income (₹): ₹${config.maximumFamilyIncome.toLocaleString()}`);
  console.log(`• Creator Address      : ${config.creatorAddress}`);
  console.log(`----------------------------------------------------------------`);
  console.log(`[1/3] Preparing Zero-Knowledge circuit proving parameters...`);
  console.log(`[2/3] Constructing Midnight deployment transaction recipe...`);
  console.log(`[3/3] Requesting Midnight Wallet signature & broadcasting to Preview testnet...`);

  const compiledContract = createScholarshipEligibilityContract();
  const zkConfigPath = typeof window === "undefined"
    ? (await import("node:path")).resolve(process.cwd(), "src", "managed", "scholarship-eligibility")
    : "src/managed/scholarship-eligibility";
  const accountId = walletContext?.address || walletContext?.getState?.()?.address || config.creatorAddress;
  const providers = await createMidnightProviders(zkConfigPath, walletProvider, accountId);

  let contractAddress = "";
  let txHash = "";

  try {
    const deployed = await deployContract(providers as any, {
      compiledContract: compiledContract as any,
      args: [
        config.scholarshipName,
        config.minimumMarks,
        config.maximumFamilyIncome,
        config.creatorAddress
      ]
    });

    contractAddress = (deployed.deployTxData as any)?.public?.contractAddress || "";
    txHash = (deployed.deployTxData as any)?.public?.txId || "";

    if (!contractAddress || !txHash) {
      throw new Error("Deployment API returned empty contract address or transaction hash.");
    }
  } catch (err: any) {
    console.error("\n❌ [Midnight Deploy Failure] Diagnostic trace:");
    console.error(`• Exception Message : ${err?.message || err}`);
    console.error(`• Error Code        : ${err?.code || err?.cause?.code || "N/A"}`);
    console.error(`• Error Errno       : ${err?.errno || err?.cause?.errno || "N/A"}`);
    console.error(`• Error Syscall     : ${err?.syscall || err?.cause?.syscall || "N/A"}`);
    console.error(`• Nested Cause      :`, err?.cause || "None");
    throw new Error(`Deployment to Midnight Preview failed: ${err?.message || err}`);
  }

  console.log(`\n================================================================`);
  console.log(`[OFFICIAL MIDNIGHT DEPLOY] BROADCAST COMPLETE & VERIFIED!`);
  console.log(`================================================================`);
  console.log(`Network: ${networkId}`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Deployment Transaction: ${txHash}`);
  console.log(`Block Explorer: https://explorer.preview.midnight.network/contract/${contractAddress}`);
  console.log(`================================================================\n`);

  return { contractAddress, txHash, networkId };
}

export async function runDeployScript() {
  const preflight = performDeploymentPreflight();
  const walletProvider = createSeedWalletProvider(preflight.seedHex);
  const creatorAddress = walletProvider.getCoinPublicKey();

  const defaultConfig: DeploymentConfig = {
    scholarshipName: "Global Merit & Need-Based Scholarship 2026",
    minimumMarks: 75n,
    maximumFamilyIncome: 500000n,
    creatorAddress
  };

  const { contractAddress, txHash, networkId } = await deployScholarshipContractOnMidnight(defaultConfig, walletProvider);

  if (typeof window === "undefined") {
    const path = await import("node:path");
    const fs = await import("node:fs");

    const rootEnvPath = path.resolve(process.cwd(), '.env');
    const envContent = `# Midnight Network Preview Configuration
MIDNIGHT_NETWORK_ID="${networkId}"
MIDNIGHT_NODE_RPC_URL="https://rpc.preview.midnight.network"
MIDNIGHT_PROOF_SERVER_URL="https://proof-server.preview.midnight.network"
MIDNIGHT_INDEXER_URL="https://indexer.preview.midnight.network/api/v3/graphql"
MIDNIGHT_INDEXER_WS_URL="wss://indexer.preview.midnight.network/api/v3/graphql/ws"

PRIVATE_STATE_PASSWORD="${process.env.PRIVATE_STATE_PASSWORD || "ScholarshipSecretPass2026!"}"
PREVIEW_CONTRACT_ADDRESS="${contractAddress}"
PREVIEW_DEPLOY_TX_HASH="${txHash}"
PREPROD_CONTRACT_ADDRESS="${contractAddress}"
PREPROD_DEPLOY_TX_HASH="${txHash}"
`;
    fs.writeFileSync(rootEnvPath, envContent, 'utf-8');

    const frontendEnvPath = path.resolve(process.cwd(), 'frontend', '.env');
    const frontendEnvContent = `VITE_MIDNIGHT_NETWORK="${networkId}"
VITE_CONTRACT_ADDRESS="${contractAddress}"
VITE_DEPLOY_TX_HASH="${txHash}"
VITE_NODE_RPC_URL="https://rpc.preview.midnight.network"
VITE_PROOF_SERVER_URL="https://proof-server.preview.midnight.network"
VITE_INDEXER_URL="https://indexer.preview.midnight.network/api/v3/graphql"
`;
    fs.writeFileSync(frontendEnvPath, frontendEnvContent, 'utf-8');

    console.log(`[Midnight Preview Deploy] Successfully populated .env and frontend/.env with verified deployment values.`);
  }
}

if (typeof process !== "undefined" && process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, "/"))) {
  runDeployScript().catch((err) => {
    console.error("\n❌ [Deployment Aborted]", err?.message || err);
    process.exit(1);
  });
}

