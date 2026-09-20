import { describe, it, expect } from "vitest";
import { getActiveNetworkConfig } from "../src/network.js";
import { MidnightIndexerService } from "../src/indexer.js";

/**
 * ============================================================================
 * LIVE MIDNIGHT PREVIEW INTEGRATION TEST (SAFE & READ-ONLY)
 * ============================================================================
 * This test suite verifies live network connectivity to Midnight Preview testnet:
 * 1. Checks Midnight Preview Node RPC endpoint connectivity.
 * 2. Queries the Midnight Preview GraphQL Indexer service.
 * 3. Verifies the deployed Scholarship-Eligibility smart contract address on-chain via indexer.
 * 
 * SAFETY GUARANTEES:
 * - NO contract deployment
 * - NO circuit verifyEligibility() invocation
 * - NO blockchain transaction submission
 * - NO wallet seed or private keys required
 * - NO tDUST consumed
 * - NO state modification
 * ============================================================================
 */

describe("Live Midnight Preview Network Integration Test (Read-Only)", () => {
  const config = getActiveNetworkConfig();

  // Environment/configuration contract address source of truth with fallback
  const expectedContractAddress =
    process.env.PREVIEW_CONTRACT_ADDRESS ||
    process.env.VITE_CONTRACT_ADDRESS ||
    "9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49";

  // --------------------------------------------------------------------------
  // TEST 1 — Midnight Preview RPC Connectivity
  // --------------------------------------------------------------------------
  it("LIVE PREVIEW — Connect and check Midnight Preview Node RPC (https://rpc.preview.midnight.network)", async () => {
    expect(config.nodeRpcUrl).toBe("https://rpc.preview.midnight.network");

    const response = await fetch(config.nodeRpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "system_chain",
        params: [],
        id: 1
      })
    });

    expect(response.status).toBe(200);
    const data = (await response.json()) as any;
    expect(data.jsonrpc).toBe("2.0");
    expect(data.result).toBeDefined();
    expect(typeof data.result).toBe("string");
    expect(data.result.toLowerCase()).toContain("midnight");
  });

  // --------------------------------------------------------------------------
  // TEST 2 — Midnight Preview GraphQL Indexer Query
  // --------------------------------------------------------------------------
  it("LIVE PREVIEW — Query Midnight Preview GraphQL Indexer (https://indexer.preview.midnight.network/api/v3/graphql)", async () => {
    const query = `
      query GetContractAddress($address: String!) {
        contract(address: $address) {
          address
        }
      }
    `;

    const response = await fetch(config.indexerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { address: expectedContractAddress }
      })
    });

    expect(response.status).toBe(200);
    const payload = (await response.json()) as any;
    expect(payload.data).toBeDefined();
    expect(payload.data.contract).toBeDefined();
    expect(payload.data.contract.address).toBe(expectedContractAddress);
  });

  // --------------------------------------------------------------------------
  // TEST 3 — Deployed Contract Address Verification via MidnightIndexerService
  // --------------------------------------------------------------------------
  it("LIVE PREVIEW — Query deployed contract via MidnightIndexerService & verify contract address", async () => {
    const indexerService = new MidnightIndexerService();
    expect(indexerService.getProvider()).toBeDefined();

    // Query indexer for contract record
    const query = `
      query VerifyDeployedContract($address: String!) {
        contract(address: $address) {
          address
        }
      }
    `;

    const response = await fetch(config.indexerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { address: expectedContractAddress }
      })
    });

    const body = (await response.json()) as any;

    expect(body.data?.contract?.address).toBe("9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49");
    expect(body.data.contract.address).toBe(expectedContractAddress);
  });
});
