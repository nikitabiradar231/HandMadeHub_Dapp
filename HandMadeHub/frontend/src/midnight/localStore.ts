/**
 * Local storage persistence and optimistic caching for HandMadeHub.
 * Prevents products and NFTs from disappearing while waiting for
 * Midnight indexer block propagation on Preview testnet.
 */

import type { NftView, ProductView } from './useMarketplace';

const LOCAL_PRODUCTS_KEY = 'hmh_cache_products_v2';
const LOCAL_NFTS_KEY = 'hmh_cache_nfts_v2';

interface SerializedProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  sellerHex: string;
  status: number;
  nftTokenId: { is_some: boolean; value: string };
  createdAt?: number;
}

interface SerializedNft {
  tokenId: string;
  productId: string;
  artistHex: string;
  commitmentHex: string;
  certificate: string;
  verified: boolean;
  createdAt?: number;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function saveLocalProduct(product: ProductView): void {
  try {
    const existing = getLocalProducts();
    const filtered = existing.filter((p) => p.id !== product.id);
    const updated: ProductView[] = [product, ...filtered];

    const serialized: SerializedProduct[] = updated.map((p) => ({
      id: p.id.toString(),
      title: p.title,
      category: p.category,
      price: p.price.toString(),
      sellerHex: bytesToHex(p.seller),
      status: p.status,
      nftTokenId: {
        is_some: p.nftTokenId.is_some,
        value: p.nftTokenId.value.toString(),
      },
      createdAt: Date.now(),
    }));

    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(serialized));
  } catch (err) {
    console.warn('[LocalStore] Failed to save local product:', err);
  }
}

export function getLocalProducts(): ProductView[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) return [];
    const parsed: SerializedProduct[] = JSON.parse(raw);
    return parsed.map((p) => ({
      id: BigInt(p.id),
      title: p.title,
      category: p.category,
      price: BigInt(p.price),
      seller: hexToBytes(p.sellerHex),
      status: p.status,
      nftTokenId: {
        is_some: p.nftTokenId.is_some,
        value: BigInt(p.nftTokenId.value || '0'),
      },
    }));
  } catch (err) {
    console.warn('[LocalStore] Failed to parse local products:', err);
    return [];
  }
}

export function updateLocalProductNft(productId: bigint, nftTokenId: bigint): void {
  try {
    const products = getLocalProducts();
    const target = products.find((p) => p.id === productId);
    if (target) {
      target.nftTokenId = { is_some: true, value: nftTokenId };
      saveLocalProduct(target);
    }
  } catch (err) {
    console.warn('[LocalStore] Failed to update product NFT id:', err);
  }
}

export function updateLocalProductStatus(productId: bigint, status: number): void {
  try {
    const products = getLocalProducts();
    const target = products.find((p) => p.id === productId);
    if (target) {
      target.status = status;
      saveLocalProduct(target);
    }
  } catch (err) {
    console.warn('[LocalStore] Failed to update product status:', err);
  }
}

export function saveLocalNft(nft: NftView): void {
  try {
    const existing = getLocalNfts();
    const filtered = existing.filter((n) => n.tokenId !== nft.tokenId);
    const updated: NftView[] = [nft, ...filtered];

    const serialized: SerializedNft[] = updated.map((n) => ({
      tokenId: n.tokenId.toString(),
      productId: n.productId.toString(),
      artistHex: bytesToHex(n.artist),
      commitmentHex: bytesToHex(n.commitment),
      certificate: n.certificate,
      verified: n.verified,
      createdAt: Date.now(),
    }));

    localStorage.setItem(LOCAL_NFTS_KEY, JSON.stringify(serialized));
  } catch (err) {
    console.warn('[LocalStore] Failed to save local NFT:', err);
  }
}

export function getLocalNfts(): NftView[] {
  try {
    const raw = localStorage.getItem(LOCAL_NFTS_KEY);
    if (!raw) return [];
    const parsed: SerializedNft[] = JSON.parse(raw);
    return parsed.map((n) => ({
      tokenId: BigInt(n.tokenId),
      productId: BigInt(n.productId),
      artist: hexToBytes(n.artistHex),
      commitment: hexToBytes(n.commitmentHex),
      certificate: n.certificate,
      verified: n.verified,
    }));
  } catch (err) {
    console.warn('[LocalStore] Failed to parse local NFTs:', err);
    return [];
  }
}

/**
 * Merge indexed ledger data with local optimistic cache data.
 * Prioritizes indexed state when available, but retains locally created items
 * that haven't been indexed by the GraphQL indexer yet.
 */
export function mergeProducts(indexed: ProductView[]): ProductView[] {
  const local = getLocalProducts();
  const indexedMap = new Map<string, ProductView>();
  indexed.forEach((p) => indexedMap.set(p.id.toString(), p));

  const result: ProductView[] = [...indexed];

  for (const locProduct of local) {
    const key = locProduct.id.toString();
    if (!indexedMap.has(key)) {
      result.push(locProduct);
    } else {
      // If local item has NFT attached but indexer hasn't synced nftTokenId yet, preserve nftTokenId
      const indexedItem = indexedMap.get(key)!;
      if (!indexedItem.nftTokenId.is_some && locProduct.nftTokenId.is_some) {
        indexedItem.nftTokenId = locProduct.nftTokenId;
      }
    }
  }

  return result.sort((a, b) => (b.id > a.id ? 1 : b.id < a.id ? -1 : 0));
}

export function mergeNfts(indexed: NftView[]): NftView[] {
  const local = getLocalNfts();
  const indexedMap = new Map<string, NftView>();
  indexed.forEach((n) => indexedMap.set(n.tokenId.toString(), n));

  const result: NftView[] = [...indexed];

  for (const locNft of local) {
    const key = locNft.tokenId.toString();
    if (!indexedMap.has(key)) {
      result.push(locNft);
    }
  }

  return result.sort((a, b) => (b.tokenId > a.tokenId ? 1 : b.tokenId < a.tokenId ? -1 : 0));
}
