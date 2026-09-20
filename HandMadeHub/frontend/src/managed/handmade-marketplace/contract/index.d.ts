import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum ProductStatus { Listed = 0, Sold = 1, Withdrawn = 2 }

export type Product = { id: bigint;
                        title: string;
                        category: string;
                        price: bigint;
                        seller: Uint8Array;
                        status: ProductStatus;
                        nftTokenId: { is_some: boolean, value: bigint }
                      };

export type Nft = { tokenId: bigint;
                    productId: bigint;
                    artist: Uint8Array;
                    commitment: Uint8Array;
                    certificate: string;
                    verified: boolean
                  };

export type Witnesses<PS> = {
  makerSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  candidateSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  buyerSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  listProduct(context: __compactRuntime.CircuitContext<PS>,
              title_0: string,
              category_0: string,
              price_0: bigint,
              seller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  mintAuthenticityNft(context: __compactRuntime.CircuitContext<PS>,
                      productId_0: bigint,
                      certificate_0: string): __compactRuntime.CircuitResults<PS, bigint>;
  verifyAuthenticity(context: __compactRuntime.CircuitContext<PS>,
                     tokenId_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  purchaseProduct(context: __compactRuntime.CircuitContext<PS>,
                  productId_0: bigint,
                  price_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  withdrawProduct(context: __compactRuntime.CircuitContext<PS>,
                  productId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  listProduct(context: __compactRuntime.CircuitContext<PS>,
              title_0: string,
              category_0: string,
              price_0: bigint,
              seller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  mintAuthenticityNft(context: __compactRuntime.CircuitContext<PS>,
                      productId_0: bigint,
                      certificate_0: string): __compactRuntime.CircuitResults<PS, bigint>;
  verifyAuthenticity(context: __compactRuntime.CircuitContext<PS>,
                     tokenId_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  purchaseProduct(context: __compactRuntime.CircuitContext<PS>,
                  productId_0: bigint,
                  price_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  withdrawProduct(context: __compactRuntime.CircuitContext<PS>,
                  productId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  listProduct(context: __compactRuntime.CircuitContext<PS>,
              title_0: string,
              category_0: string,
              price_0: bigint,
              seller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  mintAuthenticityNft(context: __compactRuntime.CircuitContext<PS>,
                      productId_0: bigint,
                      certificate_0: string): __compactRuntime.CircuitResults<PS, bigint>;
  verifyAuthenticity(context: __compactRuntime.CircuitContext<PS>,
                     tokenId_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  purchaseProduct(context: __compactRuntime.CircuitContext<PS>,
                  productId_0: bigint,
                  price_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  withdrawProduct(context: __compactRuntime.CircuitContext<PS>,
                  productId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  products: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Product;
    [Symbol.iterator](): Iterator<[bigint, Product]>
  };
  nfts: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Nft;
    [Symbol.iterator](): Iterator<[bigint, Nft]>
  };
  readonly nextProductId: bigint;
  readonly nextNftId: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
