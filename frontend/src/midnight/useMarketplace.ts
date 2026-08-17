import { useCallback, useRef, useState } from 'react';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';

import { CONTRACT_ADDRESS, NETWORK_ID, connectWallet } from './selectWallet';
import { buildProviders, type BrowserProviders } from './providers';
import {
  PRIVATE_STATE_ID,
  emptyWitnessValues,
  loadContractModule,
  makeCompiledContract,
  readPublicLedger,
  type WitnessValues,
} from './contract';
import { loadSecret, parseSecretHex, randomSecret, saveSecret } from './secrets';
import { saveProductImage } from '../utils/imageStore';

import { parseMidnightError } from './errors';
import {
  mergeProducts,
  mergeNfts,
  saveLocalProduct,
  saveLocalNft,
  updateLocalProductNft,
  updateLocalProductStatus,
} from './localStore';

export interface ProductView {
  id: bigint;
  title: string;
  category: string;
  price: bigint;
  seller: Uint8Array;
  status: number; // 0 Listed | 1 Sold | 2 Withdrawn
  nftTokenId: { is_some: boolean; value: bigint };
}

export interface NftView {
  tokenId: bigint;
  productId: bigint;
  artist: Uint8Array;
  commitment: Uint8Array;
  certificate: string;
  verified: boolean;
}

export type StatusKind = 'connecting' | 'proving' | 'success' | 'error';

export interface Status {
  kind: StatusKind;
  title: string;
  detail?: string;
}

export const PRODUCT_STATUS_LABELS = ['Listed', 'Sold', 'Withdrawn'] as const;

export function useMarketplace() {
  const [wallet, setWallet] = useState<ConnectedAPI | null>(null);
  const [address, setAddress] = useState<string>('');
  const [networkId, setNetworkId] = useState<string>(NETWORK_ID);
  const [balance, setBalance] = useState<{ tNight: bigint; dust: bigint } | null>(null);
  const [products, setProducts] = useState<ProductView[]>(() => mergeProducts([]));
  const [nfts, setNfts] = useState<NftView[]>(() => mergeNfts([]));
  const [status, setStatus] = useState<Status | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const deployedRef = useRef<any>(null);
  const providersRef = useRef<BrowserProviders | null>(null);
  const contractModuleRef = useRef<any>(null);
  const witnessValuesRef = useRef<WitnessValues>(emptyWitnessValues());

  const resetWitnesses = useCallback(() => {
    witnessValuesRef.current = emptyWitnessValues();
  }, []);

  const refresh = useCallback(async () => {
    if (!providersRef.current || !contractModuleRef.current) {
      setProducts(mergeProducts([]));
      setNfts(mergeNfts([]));
      return;
    }
    try {
      const contractState =
        await providersRef.current.publicDataProvider.queryContractState(CONTRACT_ADDRESS);
      if (!contractState) {
        setProducts(mergeProducts([]));
        setNfts(mergeNfts([]));
        return;
      }
      const ledger = readPublicLedger(contractModuleRef.current, contractState);
      const indexedProducts = [...ledger.products].map(([id, p]: [bigint, any]) => ({
        id,
        title: p.title,
        category: p.category,
        price: p.price,
        seller: new Uint8Array(p.seller),
        status: Number(p.status),
        nftTokenId: { is_some: p.nftTokenId.is_some, value: p.nftTokenId.value },
      }));
      const indexedNfts = [...ledger.nfts].map(([tokenId, nft]: [bigint, any]) => ({
        tokenId,
        productId: nft.productId,
        artist: new Uint8Array(nft.artist),
        commitment: new Uint8Array(nft.commitment),
        certificate: nft.certificate,
        verified: Boolean(nft.verified),
      }));

      setProducts(mergeProducts(indexedProducts));
      setNfts(mergeNfts(indexedNfts));
    } catch {
      setProducts(mergeProducts([]));
      setNfts(mergeNfts([]));
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!wallet) return;
    try {
      const unshielded = await wallet.getUnshieldedBalances();
      const dust = await wallet.getDustBalance();
      setBalance({ tNight: unshielded[unshieldedToken().raw] ?? 0n, dust: dust.balance });
    } catch {
      // ignore — balances are informational
    }
  }, [wallet]);

  const connect = useCallback(async () => {
    setStatus({ kind: 'connecting', title: 'Connecting to Lace wallet…' });
    try {
      const connectedApi = await connectWallet(NETWORK_ID);
      const config = await connectedApi.getConfiguration();
      const { unshieldedAddress } = await connectedApi.getUnshieldedAddress();

      const providers = await buildProviders(connectedApi);
      const contractModule = await loadContractModule();
      const compiledContract = makeCompiledContract(contractModule, witnessValuesRef.current);

      const deployed = await findDeployedContract(providers as any, {
        compiledContract,
        contractAddress: CONTRACT_ADDRESS,
        privateStateId: PRIVATE_STATE_ID,
        initialPrivateState: {},
      });

      deployedRef.current = deployed;
      providersRef.current = providers;
      contractModuleRef.current = contractModule;
      setWallet(connectedApi);
      setAddress(unshieldedAddress);
      setNetworkId(config.networkId);
      setStatus(null);

      await refresh();
      await refreshBalance();
    } catch (error) {
      setStatus({ kind: 'error', title: 'Connection failed', detail: parseMidnightError(error) });
    }
  }, [refresh, refreshBalance]);

  const disconnect = useCallback(() => {
    deployedRef.current = null;
    providersRef.current = null;
    contractModuleRef.current = null;
    resetWitnesses();
    setWallet(null);
    setAddress('');
    setBalance(null);
    setProducts([]);
    setNfts([]);
    setStatus(null);
    setBusyAction(null);
  }, [resetWitnesses]);

  /**
   * Re-establish the wallet session and resume sync. Re-runs the same connect
   * flow (the connector re-resolves the session with the extension) and then
   * refreshes ledger state and balances. Never touches stored private state:
   * private state and signing keys live in the extension / browser storage and
   * are intentionally left intact.
   */
  const reauthenticate = useCallback(async () => {
    await connect();
  }, [connect]);

  /**
   * Run a marketplace action with proof-phase status reporting. The witness
   * values are restored to empty before and after, so a secret is only ever in
   * memory while its proof is being built.
   */
  const runAction = useCallback(
    async (actionName: string, provingTitle: string, fn: () => Promise<string>) => {
      if (busyAction) return;
      setBusyAction(actionName);
      setStatus({
        kind: 'proving',
        title: provingTitle,
        detail:
          'Generating a zero-knowledge proof — your secret stays on this device and is never revealed. This can take 30–60 seconds.',
      });
      try {
        const summary = await fn();
        setStatus({ kind: 'success', title: summary });
        await refresh();
        await refreshBalance();
      } catch (error) {
        setStatus({
          kind: 'error',
          title: `${provingTitle} failed`,
          detail: parseMidnightError(error),
        });
      } finally {
        resetWitnesses();
        setBusyAction(null);
      }
    },
    [busyAction, refresh, refreshBalance, resetWitnesses],
  );

  const listProduct = useCallback(
    (title: string, category: string, priceRaw: string) =>
      runAction('listProduct', 'Listing your product…', async () => {
        if (!deployedRef.current || !wallet) throw new Error('Not connected.');
        if (!title.trim() || !category.trim()) throw new Error('Title and category are required.');
        const price = BigInt(priceRaw.trim());
        if (price <= 0n) throw new Error('Price must be a positive integer (tNIGHT).');

        const { unshieldedAddress } = await wallet.getUnshieldedAddress();
        const seller = new Uint8Array(
          MidnightBech32m.parse(unshieldedAddress).decode(UnshieldedAddress, networkId).data,
        );

        const tx = await deployedRef.current.callTx.listProduct(
          title.trim(),
          category.trim(),
          price,
          seller,
        );
        const productId = BigInt(tx.private.result);
        saveLocalProduct({
          id: productId,
          title: title.trim(),
          category: category.trim(),
          price,
          seller,
          status: 0,
          nftTokenId: { is_some: false, value: 0n },
        });
        return `Product #${productId} listed at ${price.toLocaleString()} tNIGHT.`;
      }),
    [runAction, wallet, networkId],
  );

  const mintNft = useCallback(
    (productIdRaw: string, certificate: string, imageUri?: string) =>
      runAction('mintNft', 'Minting authenticity NFT…', async () => {
        if (!deployedRef.current || !wallet) throw new Error('Not connected.');
        const productId = BigInt(productIdRaw.trim());

        const secret = randomSecret();
        witnessValuesRef.current.makerSecret = secret;

        const tx = await deployedRef.current.callTx.mintAuthenticityNft(productId, certificate.trim());
        const tokenId = BigInt(tx.private.result);
        saveSecret(tokenId, secret);
        if (imageUri) {
          saveProductImage(productId, imageUri, tokenId);
        }

        const { unshieldedAddress } = await wallet.getUnshieldedAddress();
        const artist = new Uint8Array(
          MidnightBech32m.parse(unshieldedAddress).decode(UnshieldedAddress, networkId).data,
        );

        saveLocalNft({
          tokenId,
          productId,
          artist,
          commitment: new Uint8Array(32),
          certificate: certificate.trim(),
          verified: true,
        });
        updateLocalProductNft(productId, tokenId);

        return `Authenticity NFT #${tokenId} minted for product #${productId}. The secret is stored only in this browser.`;
      }),
    [runAction, wallet, networkId],
  );

  const mintNFTProduct = useCallback(
    (
      title: string,
      category: string,
      priceRaw: string,
      certificate: string,
      imageUri?: string,
    ) =>
      runAction('mintNFTProduct', 'Minting NFT & listing product…', async () => {
        if (!deployedRef.current || !wallet) throw new Error('Not connected to Midnight wallet.');
        if (!title.trim() || !category.trim()) throw new Error('Title and category are required.');
        const price = BigInt(priceRaw.trim());
        if (price <= 0n) throw new Error('Price must be a positive integer (tNIGHT).');

        const { unshieldedAddress } = await wallet.getUnshieldedAddress();
        const seller = new Uint8Array(
          MidnightBech32m.parse(unshieldedAddress).decode(UnshieldedAddress, networkId).data,
        );

        // Step 1: List Product on Midnight contract (triggers wallet confirmation)
        const listTx = await deployedRef.current.callTx.listProduct(
          title.trim(),
          category.trim(),
          price,
          seller,
        );
        const productId = BigInt(listTx.private.result);

        // Save listed product immediately to local cache & store uploaded image
        saveLocalProduct({
          id: productId,
          title: title.trim(),
          category: category.trim(),
          price,
          seller,
          status: 0,
          nftTokenId: { is_some: false, value: 0n },
        });

        if (imageUri) {
          saveProductImage(productId, imageUri, undefined, title);
        }

        // Step 2: Mint authenticity NFT with block-sync retries
        setStatus({
          kind: 'proving',
          title: 'Product listed! Minting authenticity NFT with Lace Wallet…',
          detail: 'Waiting for Midnight preview testnet block confirmation & indexer sync…',
        });

        let nftTokenId: bigint | null = null;
        const secret = randomSecret();
        witnessValuesRef.current.makerSecret = secret;
        const certText = certificate.trim() || `Authenticity Certificate for ${title.trim()}`;

        const MAX_RETRIES = 6;
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            await new Promise((r) => setTimeout(r, attempt === 1 ? 3000 : 4000));
            const mintTx = await deployedRef.current.callTx.mintAuthenticityNft(productId, certText);
            nftTokenId = BigInt(mintTx.private.result);
            saveSecret(nftTokenId, secret);

            saveLocalNft({
              tokenId: nftTokenId,
              productId,
              artist: seller,
              commitment: new Uint8Array(32),
              certificate: certText,
              verified: true,
            });
            updateLocalProductNft(productId, nftTokenId);

            if (imageUri) {
              saveProductImage(productId, imageUri, nftTokenId, title);
            }
            break;
          } catch (err: any) {
            console.warn(`Mint NFT attempt ${attempt}/${MAX_RETRIES} waiting for block inclusion:`, err);
            if (attempt === MAX_RETRIES) {
              // If indexer sync on Preview testnet takes longer, product is listed & live!
              return `Product #${productId} listed on Midnight Marketplace! Click "Mint NFT for ID #${productId}" in Step 2 to finish attaching the NFT once block sync finishes.`;
            }
          }
        }

        return `🎉 Authenticity NFT #${nftTokenId} for "${title}" minted & listed successfully at ${price.toLocaleString()} tNIGHT!`;
      }),
    [runAction, wallet, networkId],
  );

  const verifyNft = useCallback(
    (tokenIdRaw: string, secretHex?: string) =>
      runAction('verifyNft', 'Verifying authenticity…', async () => {
        if (!deployedRef.current) throw new Error('Not connected.');
        const tokenId = BigInt(tokenIdRaw.trim());
        const secret =
          (secretHex && secretHex.trim() ? parseSecretHex(secretHex) : null) ??
          loadSecret(tokenId);
        if (!secret) {
          throw new Error(
            'No secret available for this NFT. Paste the 32-byte secret minted with it, or verify from the wallet that minted it.',
          );
        }
        witnessValuesRef.current.candidateSecret = secret;

        const tx = await deployedRef.current.callTx.verifyAuthenticity(tokenId);
        const verified = Boolean(tx.private.result);
        if (!verified) {
          throw new Error('The supplied secret does not match this NFT — nothing was revealed on-chain.');
        }
        return `✅ Genuine — the secret matches NFT #${tokenId}. Only the boolean result was disclosed on-chain.`;
      }),
    [runAction],
  );

  const purchase = useCallback(
    (product: ProductView, pastedSecret?: string) =>
      runAction('purchase', 'Buying this item…', async () => {
        if (!deployedRef.current) throw new Error('Not connected.');
        if (product.status !== 0) throw new Error('This product is not for sale.');

        if (product.nftTokenId.is_some) {
          const tokenId = product.nftTokenId.value;
          let secret = loadSecret(tokenId);
          if (!secret && pastedSecret?.trim()) secret = parseSecretHex(pastedSecret);
          if (!secret) {
            throw new Error(
              'This item is backed by an authenticity NFT. Provide the artist secret to prove you are the legitimate owner.',
            );
          }
          witnessValuesRef.current.buyerSecret = secret;
        }

        await deployedRef.current.callTx.purchaseProduct(product.id, product.price);
        updateLocalProductStatus(product.id, 1); // 1 = Sold
        return `Purchased “${product.title}” for ${product.price.toLocaleString()} tNIGHT.`;
      }),
    [runAction],
  );

  const withdrawProduct = useCallback(
    (productIdRaw: string) =>
      runAction('withdraw', 'Withdrawing your listing…', async () => {
        if (!deployedRef.current) throw new Error('Not connected.');
        const productId = BigInt(productIdRaw.trim());
        const tx = await deployedRef.current.callTx.withdrawProduct(productId);
        updateLocalProductStatus(productId, 2); // 2 = Withdrawn
        return `Listing #${productId} withdrawn (tx ${tx.public.txId.slice(0, 16)}…).`;
      }),
    [runAction],
  );

  return {
    connected: wallet !== null,
    wallet,
    address,
    networkId,
    balance,
    products,
    nfts,
    status,
    busyAction,
    connect,
    disconnect,
    reauthenticate,
    refresh,
    refreshBalance,
    listProduct,
    mintNft,
    mintNFTProduct,
    verifyNft,
    purchase,
    withdrawProduct,
    hasSecret: (tokenId: bigint) => loadSecret(tokenId) !== null,
  };
}
