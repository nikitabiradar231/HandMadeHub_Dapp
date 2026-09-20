/**
 * ============================================================================
 * REAL MIDNIGHT INDEXER PUBLIC DATA PROVIDER SERVICE
 * ============================================================================
 * Integrates `@midnight-ntwrk/midnight-js-indexer-public-data-provider` to read
 * live public ledger state and transaction statuses from Midnight Network indexer.
 * ============================================================================
 */

import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import type { PublicDataProvider } from "@midnight-ntwrk/midnight-js-types";
import { getActiveNetworkConfig } from "./network.js";
import type { PublicLedgerState } from "./managed/scholarship-eligibility/index.js";

export class MidnightIndexerService {
  private provider: PublicDataProvider;
  private network = getActiveNetworkConfig();

  constructor(customIndexerUrl?: string, customIndexerWsUrl?: string) {
    const queryUrl = customIndexerUrl || this.network.indexerUrl;
    const wsUrl = customIndexerWsUrl || this.network.indexerWsUrl;
    this.provider = indexerPublicDataProvider(queryUrl, wsUrl);
  }

  public getProvider(): PublicDataProvider {
    return this.provider;
  }

  /**
   * Reads public contract ledger state directly from Midnight Indexer GraphQL service.
   */
  public async fetchContractState(contractAddress: string): Promise<PublicLedgerState | null> {
    try {
      console.log(`[Midnight Indexer] Querying contract state for ${contractAddress}...`);
      const rawState = await this.provider.queryContractState(contractAddress as any);
      if (!rawState) {
        console.warn(`[Midnight Indexer] No contract state returned for ${contractAddress}`);
        return null;
      }
      return this.parseLedgerState(rawState);
    } catch (error) {
      console.warn(`[Midnight Indexer] Error fetching state for ${contractAddress}:`, error);
      return null;
    }
  }

  /**
   * Watches for transaction finalization via Midnight Indexer WebSocket.
   */
  public async waitForTxFinalization(txId: string): Promise<any> {
    console.log(`[Midnight Indexer] Watching for tx finalization: ${txId}...`);
    return await this.provider.watchForTxData(txId);
  }

  /**
   * Watches for deployment transaction finalization via Midnight Indexer.
   */
  public async waitForDeployFinalization(contractAddress: string): Promise<any> {
    console.log(`[Midnight Indexer] Watching for deployment at ${contractAddress}...`);
    return await this.provider.watchForDeployTxData(contractAddress as any);
  }

  public parseLedgerState(rawState: any): PublicLedgerState | null {
    if (typeof rawState !== "object" || rawState === null) return null;

    const data = rawState?.data || rawState?.state || rawState?.ledgerState || rawState;

    if (typeof data === "object" && data !== null && ("scholarshipName" in data || "minimumMarks" in data || "isInitialized" in data)) {
      return {
        scholarshipName: String(data.scholarshipName || "Scholarship Program"),
        minimumMarks: BigInt(data.minimumMarks ?? 0),
        maximumFamilyIncome: BigInt(data.maximumFamilyIncome ?? 0),
        creatorAddress: String(data.creatorAddress || ""),
        credentialVerificationStatus: String(data.credentialVerificationStatus || "Pending Review"),
        verificationsCount: BigInt(data.verificationsCount ?? 0),
        latestVerificationResult: Boolean(data.latestVerificationResult),
        isInitialized: Boolean(data.isInitialized ?? true)
      };
    }

    return null;
  }
}
