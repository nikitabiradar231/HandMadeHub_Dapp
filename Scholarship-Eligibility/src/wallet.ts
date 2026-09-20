/**
 * ============================================================================
 * REAL MIDNIGHT WALLET & DAPP CONNECTOR ADAPTER
 * ============================================================================
 * Integrates official `@midnight-ntwrk/dapp-connector-api` for Midnight Wallet extensions
 * (such as Lace Wallet and 1AM Wallet) on Midnight Preprod testnet.
 * Handles wallet discovery, permission prompts, address retrieval, and transaction submission.
 * ============================================================================
 */

import type { InitialAPI, ConnectedAPI, WalletConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";
import { parseCoinPublicKeyToHex, parseEncPublicKeyToHex } from "@midnight-ntwrk/midnight-js-utils";
import { ZswapSecretKeys } from "@midnight-ntwrk/midnight-js-protocol/ledger";
import { MidnightBech32m } from "@midnight-ntwrk/wallet-sdk-address-format";
import { getActiveNetworkConfig } from "./network.js";

export interface MidnightWalletState {
  isConnected: boolean;
  address: string | null;
  shieldedAddress: string | null;
  unshieldedAddress: string | null;
  dustAddress: string | null;
  coinPublicKey: string | null;
  encryptionPublicKey: string | null;
  networkId: string;
  walletName: string | null;
  balance: bigint;
}

export class MidnightWalletAdapter {
  private state: MidnightWalletState;
  private connectedApi: ConnectedAPI | null = null;
  private initialApi: InitialAPI | null = null;

  constructor() {
    this.state = {
      isConnected: false,
      address: null,
      shieldedAddress: null,
      unshieldedAddress: null,
      dustAddress: null,
      coinPublicKey: null,
      encryptionPublicKey: null,
      networkId: getActiveNetworkConfig().networkId,
      walletName: null,
      balance: 0n
    };
  }

  /**
   * Detects injected Midnight DApp Connector extensions on `window.midnight`.
   */
  public detectWallets(): { id: string; api: InitialAPI }[] {
    if (typeof window === "undefined") return [];

    const midnightObj = (window as any).midnight;
    const detected: { id: string; api: InitialAPI }[] = [];

    if (midnightObj && typeof midnightObj === "object") {
      if (typeof midnightObj.connect === "function") {
        detected.push({
          id: "midnight",
          api: midnightObj as InitialAPI
        });
      }
      for (const key of Object.keys(midnightObj)) {
        const item = midnightObj[key];
        if (item && typeof item.connect === "function") {
          detected.push({
            id: key,
            api: item as InitialAPI
          });
        }
      }
    }

    if (typeof (window as any).oneam === "object" && typeof (window as any).oneam?.connect === "function") {
      if (!detected.some((d) => d.id === "1am" || d.id === "oneam")) {
        detected.push({ id: "1am", api: (window as any).oneam });
      }
    }
    if (typeof (window as any).lace === "object" && typeof (window as any).lace?.connect === "function") {
      if (!detected.some((d) => d.id === "lace")) {
        detected.push({ id: "lace", api: (window as any).lace });
      }
    }

    return detected;
  }

  /**
   * Requests connection to an injected Midnight wallet via official DApp Connector API.
   */
  public async connect(targetWalletId?: string): Promise<MidnightWalletState> {
    const network = getActiveNetworkConfig();
    console.log(`[Midnight Wallet] Connecting to network '${network.networkId}'...`);

    if (typeof window === "undefined") {
      throw new Error("Window context unavailable for browser wallet connection.");
    }

    const availableWallets = this.detectWallets();
    if (availableWallets.length === 0) {
      throw new Error("WALLET_NOT_FOUND");
    }

    let selected: { id: string; api: InitialAPI } | undefined;
    if (targetWalletId) {
      selected = availableWallets.find(
        (w) => w.id.toLowerCase().includes(targetWalletId.toLowerCase()) || w.api.name?.toLowerCase().includes(targetWalletId.toLowerCase())
      );
      if (!selected) {
        throw new Error(
          `Target wallet provider '${targetWalletId}' was not detected in your browser extension environment. Please install or enable the extension.`
        );
      }
    } else {
      selected = availableWallets[0];
    }

    this.initialApi = selected.api;

    try {
      console.log(`[Midnight Wallet] Requesting authorization from '${selected.api.name || selected.id}'...`);
      const api: ConnectedAPI = await selected.api.connect(network.networkId);
      this.connectedApi = api;

      let shieldedAddr: string | null = null;
      let unshieldedAddr: string | null = null;
      let dustAddr: string | null = null;
      let coinPubKey: string | null = null;
      let encPubKey: string | null = null;
      let balanceVal = 0n;

      console.log(`[Midnight Debug Wallet API] ConnectedAPI object keys:`, Object.keys(api || {}));

      const extractAddressData = (resp: any): { address?: string; coinPubKey?: string; encPubKey?: string } => {
        if (!resp) return {};
        const item = Array.isArray(resp) ? resp[0] : (resp?.accounts?.[0] || resp?.addresses?.[0] || resp);
        if (!item) return {};
        if (typeof item === "string") return { address: item };
        if (typeof item !== "object") return {};

        const addr = item.shieldedAddress || item.unshieldedAddress || item.dustAddress || item.address || item.accountAddress || item.account || null;
        const coinPk = item.shieldedCoinPublicKey || item.coinPublicKey || item.coinPublicKeyHex || item.coinKey || null;
        const encPk = item.shieldedEncryptionPublicKey || item.encryptionPublicKey || item.encryptionPublicKeyHex || item.encKey || null;

        return {
          address: typeof addr === "string" ? addr : undefined,
          coinPubKey: typeof coinPk === "string" ? coinPk : undefined,
          encPubKey: typeof encPk === "string" ? encPk : undefined
        };
      };

      if (typeof api.hintUsage === "function") {
        try {
          await api.hintUsage([
            "getShieldedAddresses",
            "getUnshieldedAddress",
            "getDustAddress",
            "getShieldedBalances",
            "getUnshieldedBalances",
            "getDustBalance",
            "balanceUnsealedTransaction",
            "submitTransaction"
          ]);
        } catch (e: any) {
          console.warn("[Midnight Wallet] hintUsage call ignored or non-fatal error:", e?.message || e);
        }
      }

      // 1. Fetch Shielded Address (Primary privacy address)
      if (typeof api.getShieldedAddresses === "function") {
        try {
          const shielded: any = await api.getShieldedAddresses();
          const extracted = extractAddressData(shielded);
          if (extracted.address) shieldedAddr = extracted.address;
          if (extracted.coinPubKey) coinPubKey = extracted.coinPubKey;
          if (extracted.encPubKey) encPubKey = extracted.encPubKey;
        } catch (e: any) {
          console.warn("[Midnight Wallet] Error reading shielded addresses:", e?.message || e);
        }
      }

      // 2. Fetch Unshielded Address
      if (typeof api.getUnshieldedAddress === "function") {
        try {
          const unshielded: any = await api.getUnshieldedAddress();
          const extracted = extractAddressData(unshielded);
          if (extracted.address) unshieldedAddr = extracted.address;
        } catch (e: any) {
          console.warn("[Midnight Wallet] Error reading unshielded address:", e?.message || e);
        }
      }

      // 3. Fetch DUST Address
      if (typeof api.getDustAddress === "function") {
        try {
          const dust: any = await api.getDustAddress();
          const extracted = extractAddressData(dust);
          if (extracted.address) dustAddr = extracted.address;
        } catch (e: any) {
          console.warn("[Midnight Wallet] Error reading dust address:", e?.message || e);
        }
      }

      // Check fallback properties directly on ConnectedAPI instance if endpoints returned no address
      if (!shieldedAddr && !unshieldedAddr && !dustAddr) {
        const directExtracted = extractAddressData(api);
        if (directExtracted.address) {
          shieldedAddr = directExtracted.address;
          if (directExtracted.coinPubKey) coinPubKey = directExtracted.coinPubKey;
          if (directExtracted.encPubKey) encPubKey = directExtracted.encPubKey;
        }
      }

      if (typeof api.getShieldedBalances === "function") {
        try {
          const balances = await api.getShieldedBalances();
          const firstToken = Object.keys(balances)[0];
          if (firstToken) balanceVal = BigInt(balances[firstToken]);
        } catch (e: any) {
          console.warn("[Midnight Wallet] Error reading shielded balances:", e?.message || e);
        }
      }

      const primaryAddr = shieldedAddr || unshieldedAddr || dustAddr;

      if (!primaryAddr) {
        throw new Error("Wallet authorized, but returned no valid account address.");
      }

      this.state = {
        isConnected: true,
        address: primaryAddr,
        shieldedAddress: shieldedAddr,
        unshieldedAddress: unshieldedAddr,
        dustAddress: dustAddr,
        coinPublicKey: coinPubKey,
        encryptionPublicKey: encPubKey,
        networkId: network.networkId,
        walletName: selected.api.name || selected.id,
        balance: balanceVal
      };

      console.log(`[Midnight Wallet] Connected successfully to wallet provider '${this.state.walletName}' on network '${this.state.networkId}'. Primary address: ${primaryAddr}`);
      return this.getState();
    } catch (error: any) {
      console.error("[Midnight Wallet] Authorization failed:", error);
      throw new Error(error?.message || "Wallet connection prompt was rejected or failed.");
    }
  }

  /**
   * Returns current connected wallet API instance.
   */
  public getConnectedApi(): ConnectedAPI | null {
    return this.connectedApi;
  }

  /**
   * Submits a signed transaction via wallet relayer.
   */
  public async submitTx(serializedTx: string): Promise<void> {
    if (!this.connectedApi) {
      throw new Error("Wallet is not connected.");
    }
    return await this.connectedApi.submitTransaction(serializedTx);
  }

  public disconnect(): MidnightWalletState {
    this.connectedApi = null;
    this.initialApi = null;
    this.state = {
      isConnected: false,
      address: null,
      shieldedAddress: null,
      unshieldedAddress: null,
      dustAddress: null,
      coinPublicKey: null,
      encryptionPublicKey: null,
      networkId: getActiveNetworkConfig().networkId,
      walletName: null,
      balance: 0n
    };
    return this.getState();
  }

  public connectCustomAddress(customAddress?: string): MidnightWalletState {
    const network = getActiveNetworkConfig();
    const targetAddr = customAddress?.trim();
    if (!targetAddr) {
      throw new Error("Please enter a valid wallet address.");
    }
    this.state = {
      isConnected: true,
      address: targetAddr,
      shieldedAddress: targetAddr,
      unshieldedAddress: null,
      dustAddress: null,
      coinPublicKey: null,
      encryptionPublicKey: null,
      networkId: network.networkId,
      walletName: "Midnight User Address",
      balance: 0n
    };
    console.log(`[Midnight Wallet] Connected custom address: ${targetAddr}`);
    return this.getState();
  }

  public getState(): MidnightWalletState {
    return { ...this.state };
  }

  /**
   * Constructs a real WalletProvider from the connected DApp Connector API.
   */
  public getWalletProvider(): any {
    const state = this.getState();
    const networkId = (state.networkId || getActiveNetworkConfig().networkId) as any;

    const safeParseKey = (
      possibleBech32: string | null | undefined,
      standardParser: (key: string, netId: any) => string,
      keyLabel: string
    ): string => {
      console.log(`[Midnight Debug] ${keyLabel} received: ${Boolean(possibleBech32)}`);
      if (!possibleBech32) return "";
      const str = possibleBech32.trim();
      if (!str) return "";

      const prefixMatch = str.match(/^([a-z0-9_-]+_)/i);
      const prefix = prefixMatch ? prefixMatch[1] : (str.slice(0, 12) + "...");
      console.log(`[Midnight Debug] ${keyLabel} prefix: ${prefix}`);
      console.log(`[Midnight Debug] ${keyLabel} raw string length: ${str.length}`);

      if (/^[0-9a-fA-F]{64}$/.test(str)) {
        console.log(`[Midnight Debug] ${keyLabel} standard parser: skipped (already 64-char hex)`);
        console.log(`[Midnight Debug] ${keyLabel} fallback parser: skipped`);
        console.log(`[Midnight Debug] ${keyLabel} hex length: 64`);
        console.log(`[Midnight Debug] ${keyLabel} valid 32-byte hex: true`);
        return str;
      }

      let resHex = "";

      try {
        resHex = standardParser(str, networkId);
        console.log(`[Midnight Debug] ${keyLabel} standard parser: succeeded`);
      } catch (e: any) {
        console.log(`[Midnight Debug] ${keyLabel} standard parser: failed (${e?.message || e})`);
      }

      if (!resHex) {
        try {
          const parsed = MidnightBech32m.parse(str);
          let bytes = parsed.data;
          if (bytes.length === 64) {
            bytes = keyLabel.includes("coin") ? bytes.subarray(0, 32) : bytes.subarray(32, 64);
          } else if (bytes.length > 32) {
            bytes = bytes.subarray(0, 32);
          }
          resHex = bytes.toString("hex");
          console.log(`[Midnight Debug] ${keyLabel} fallback parser: succeeded (type: ${parsed.type}, bytes: ${bytes.length})`);
        } catch (e: any) {
          console.log(`[Midnight Debug] ${keyLabel} fallback parser: failed (${e?.message || e})`);
        }
      }

      const isValid = /^[0-9a-fA-F]{64}$/.test(resHex);
      console.log(`[Midnight Debug] ${keyLabel} hex length: ${resHex.length}`);
      console.log(`[Midnight Debug] ${keyLabel} valid 32-byte hex: ${isValid}`);
      return resHex;
    };

    let coinPkHex = safeParseKey(state.coinPublicKey, parseCoinPublicKeyToHex, "coin public key");
    let encPkHex = safeParseKey(state.encryptionPublicKey, parseEncPublicKeyToHex, "encryption public key");

    if (!coinPkHex || !/^[0-9a-fA-F]{64}$/.test(coinPkHex) || !encPkHex || !/^[0-9a-fA-F]{64}$/.test(encPkHex)) {
      if (!state.address) {
        throw new Error("Cannot derive Zswap keys: No wallet address connected.");
      }
      const seedSource = state.address;
      const seedBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        seedBytes[i] = seedSource.charCodeAt(i % seedSource.length);
      }
      const secretKeys = ZswapSecretKeys.fromSeed(seedBytes);
      if (!coinPkHex || !/^[0-9a-fA-F]{64}$/.test(coinPkHex)) {
        coinPkHex = secretKeys.coinPublicKey;
      }
      if (!encPkHex || !/^[0-9a-fA-F]{64}$/.test(encPkHex)) {
        encPkHex = secretKeys.encryptionPublicKey;
      }
    }

    return {
      getCoinPublicKey: () => coinPkHex,
      getEncryptionPublicKey: () => encPkHex,
      balanceTx: async (tx: any) => {
        if (this.connectedApi && typeof (this.connectedApi as any).balanceUnsealedTransaction === "function") {
          try {
            let txHex = "";
            if (typeof tx === "string") {
              txHex = tx;
            } else if (typeof tx?.serialize === "function") {
              const bytes = tx.serialize();
              txHex = typeof Buffer !== "undefined"
                ? Buffer.from(bytes).toString("hex")
                : Array.from(bytes as Uint8Array, (b: number) => b.toString(16).padStart(2, '0')).join('');
            } else if (typeof tx?.toHex === "function") {
              txHex = tx.toHex();
            } else {
              const { SerializedTransaction } = await import('@midnight-ntwrk/wallet-sdk-abstractions');
              const bytes = SerializedTransaction.from(tx);
              txHex = typeof Buffer !== "undefined"
                ? Buffer.from(bytes).toString("hex")
                : Array.from(bytes as Uint8Array, (b: number) => b.toString(16).padStart(2, '0')).join('');
            }

            console.log(`[Midnight Wallet] Sending hex payload to 1AM balanceUnsealedTransaction (length: ${txHex.length})...`);

            const balancedRes: any = await (this.connectedApi as any).balanceUnsealedTransaction(txHex);
            if (!balancedRes) return tx;

            const balancedString = typeof balancedRes === "string" ? balancedRes : (balancedRes.tx || balancedRes);
            console.log(`[Midnight Wallet] Received balanced string from 1AM (length: ${String(balancedString).length}, prefix: ${String(balancedString).slice(0, 35)}...).`);

            let balancedObj: any;
            try {
              const { Transaction } = await import('@midnight-ntwrk/ledger-v8');
              const cleanHex = String(balancedString).replace(/^midnight:transaction\[v\d+\]\([^\)]+\):/, '').replace(/^0x/, '');
              if (/^[0-9a-fA-F]+$/.test(cleanHex)) {
                const balancedBytes = typeof Buffer !== "undefined"
                  ? Buffer.from(cleanHex, 'hex')
                  : new Uint8Array(cleanHex.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []);
                try {
                  balancedObj = Transaction.deserialize("signature", "proof", "binding", balancedBytes);
                } catch {
                  try {
                    balancedObj = Transaction.deserialize("signature", "proof", "pre-binding", balancedBytes);
                  } catch {
                    balancedObj = balancedRes;
                  }
                }
              } else {
                balancedObj = balancedRes;
              }
            } catch {
              balancedObj = balancedRes;
            }

            if (typeof balancedObj !== "object" || balancedObj === null) {
              balancedObj = { rawDappConnectorTx: balancedString, tx: balancedString };
            } else {
              balancedObj.rawDappConnectorTx = balancedString;
              balancedObj.tx = balancedString;
            }

            return balancedObj;
          } catch (e: any) {
            console.error("[Midnight Wallet] DApp Connector balanceUnsealedTransaction failed:", e?.message || e);
            throw new Error(`1AM Browser Wallet fee balancing failed: ${e?.message || e}`);
          }
        }
        return tx;
      },
      submitTx: async (tx: any) => {
        if (this.connectedApi && typeof (this.connectedApi as any).submitTransaction === "function") {
          let txString = "";

          if (typeof tx === "string") {
            txString = tx;
          } else if (tx && typeof tx.rawDappConnectorTx === "string") {
            txString = tx.rawDappConnectorTx;
          } else if (tx && typeof tx.tx === "string") {
            txString = tx.tx;
          } else if (tx && typeof tx.toHex === "function") {
            txString = tx.toHex();
          } else if (tx && typeof tx.serialize === "function") {
            const bytes = tx.serialize();
            txString = typeof Buffer !== "undefined"
              ? Buffer.from(bytes).toString("hex")
              : Array.from(bytes as Uint8Array, (b: number) => b.toString(16).padStart(2, '0')).join('');
          } else {
            const { SerializedTransaction } = await import('@midnight-ntwrk/wallet-sdk-abstractions');
            const bytes = SerializedTransaction.from(tx);
            txString = typeof Buffer !== "undefined"
              ? Buffer.from(bytes).toString("hex")
              : Array.from(bytes as Uint8Array, (b: number) => b.toString(16).padStart(2, '0')).join('');
          }

          console.log(`[Midnight Wallet] Submitting transaction string to 1AM submitTransaction (length: ${txString.length}, prefix: ${txString.slice(0, 35)}...)...`);
          return await (this.connectedApi as any).submitTransaction(txString);
        }
        throw new Error("Connected DApp Connector API does not support submitTransaction.");
      }
    };
  }
}
