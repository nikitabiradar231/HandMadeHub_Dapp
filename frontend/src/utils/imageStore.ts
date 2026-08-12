/**
 * Persistent local image storage for HandMadeHub NFT products.
 * Uses localStorage with key prefixes to save and retrieve product images by Product ID, NFT Token ID, or Title.
 */

const PRODUCT_PREFIX = 'hmh_img_prod_';
const NFT_PREFIX = 'hmh_img_nft_';
const TITLE_PREFIX = 'hmh_img_title_';

export function saveProductImage(
  productId: string | bigint,
  dataUrl: string,
  nftTokenId?: string | bigint,
  title?: string,
): void {
  try {
    if (!dataUrl) return;
    const pKey = `${PRODUCT_PREFIX}${productId.toString()}`;
    localStorage.setItem(pKey, dataUrl);

    if (nftTokenId !== undefined) {
      const nKey = `${NFT_PREFIX}${nftTokenId.toString()}`;
      localStorage.setItem(nKey, dataUrl);
    }

    if (title && title.trim()) {
      const tKey = `${TITLE_PREFIX}${title.trim().toLowerCase()}`;
      localStorage.setItem(tKey, dataUrl);
    }
  } catch (err) {
    console.warn('Failed to save product image to localStorage:', err);
  }
}

export function getProductImage(
  productId?: string | bigint | null,
  nftTokenId?: string | bigint | null,
  title?: string | null,
): string | null {
  try {
    if (productId !== undefined && productId !== null) {
      const pKey = `${PRODUCT_PREFIX}${productId.toString()}`;
      const img = localStorage.getItem(pKey);
      if (img) return img;
    }

    if (nftTokenId !== undefined && nftTokenId !== null) {
      const nKey = `${NFT_PREFIX}${nftTokenId.toString()}`;
      const img = localStorage.getItem(nKey);
      if (img) return img;
    }

    if (title && title.trim()) {
      const tKey = `${TITLE_PREFIX}${title.trim().toLowerCase()}`;
      const img = localStorage.getItem(tKey);
      if (img) return img;
    }
  } catch (err) {
    console.warn('Failed to read product image from localStorage:', err);
  }
  return null;
}
