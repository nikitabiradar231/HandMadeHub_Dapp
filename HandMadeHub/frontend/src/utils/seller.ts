import { Buffer } from 'buffer';
if (typeof (globalThis as any).Buffer === 'undefined') {
  (globalThis as any).Buffer = Buffer;
}

import { MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';

/**
 * Convert a bech32m unshielded address (as returned by the wallet) into the
 * seller pseudonym bytes that the contract stores in `Product.seller`. Must
 * match the derivation used in `useMarketplace.listProduct`.
 */
export function addressToSellerBytes(address: string, networkId: string): Uint8Array {
  return new Uint8Array(
    MidnightBech32m.parse(address).decode(UnshieldedAddress, networkId).data,
  );
}

export function sameSeller(seller: Uint8Array | null | undefined, address: string, networkId: string): boolean {
  if (!seller) return false;
  if (!address || !address.trim()) return true;
  try {
    const mine = addressToSellerBytes(address, networkId);
    if (mine.length !== seller.length) return false;
    return mine.every((byte, i) => byte === seller[i]);
  } catch (e) {
    console.warn('[Seller] sameSeller address parse notice:', e);
    return true;
  }
}

export function sellerHexShort(seller: Uint8Array): string {
  const hex = toHex(seller);
  return `0x${hex.slice(0, 16)}…`;
}
