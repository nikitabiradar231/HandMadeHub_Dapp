/**
 * ============================================================================
 * MIDNIGHT NETWORK CONFIGURATION
 * ============================================================================
 * Endpoint configurations for Midnight Preview testnet and local network node,
 * proof server, and indexer services.
 * ============================================================================
 */

export interface MidnightNetworkConfig {
  networkId: string;
  nodeRpcUrl: string;
  proofServerUrl: string;
  indexerUrl: string;
  indexerWsUrl: string;
  isLocalStandalone: boolean;
}

export const LOCAL_MIDNIGHT_CONFIG: MidnightNetworkConfig = {
  networkId: "undeployed-standalone-local",
  nodeRpcUrl: "http://127.0.0.1:9944",
  proofServerUrl: "http://127.0.0.1:6300",
  indexerUrl: "http://127.0.0.1:8088",
  indexerWsUrl: "ws://127.0.0.1:8088/ws",
  isLocalStandalone: true
};

export const PREVIEW_MIDNIGHT_CONFIG: MidnightNetworkConfig = {
  networkId: "preview",
  nodeRpcUrl: "https://rpc.preview.midnight.network",
  proofServerUrl: "https://proof-server.preview.midnight.network",
  indexerUrl: "https://indexer.preview.midnight.network/api/v3/graphql",
  indexerWsUrl: "wss://indexer.preview.midnight.network/api/v3/graphql/ws",
  isLocalStandalone: false
};

export const PREPROD_MIDNIGHT_CONFIG: MidnightNetworkConfig = {
  networkId: "preprod",
  nodeRpcUrl: "https://rpc.preprod.midnight.network",
  proofServerUrl: "https://proof-server.preprod.midnight.network",
  indexerUrl: "https://indexer.preprod.midnight.network",
  indexerWsUrl: "wss://indexer.preprod.midnight.network/ws",
  isLocalStandalone: false
};

import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export function getActiveNetworkConfig(): MidnightNetworkConfig {
  const envNetwork =
    (typeof process !== "undefined" && process.env && (process.env.MIDNIGHT_NETWORK_ID || process.env.VITE_MIDNIGHT_NETWORK)) ||
    (typeof window !== "undefined" && (window as any).__ENV__?.VITE_MIDNIGHT_NETWORK) ||
    "preview";

  let config = PREVIEW_MIDNIGHT_CONFIG;
  if (envNetwork === "local" || envNetwork === "standalone") {
    config = LOCAL_MIDNIGHT_CONFIG;
  } else if (envNetwork === "preprod") {
    config = PREPROD_MIDNIGHT_CONFIG;
  } else {
    const customNodeRpc = typeof process !== "undefined" ? process.env.MIDNIGHT_NODE_RPC_URL : undefined;
    const customIndexer = typeof process !== "undefined" ? process.env.MIDNIGHT_INDEXER_URL : undefined;
    const customIndexerWs = typeof process !== "undefined" ? process.env.MIDNIGHT_INDEXER_WS_URL : undefined;
    const customProof = typeof process !== "undefined" ? process.env.MIDNIGHT_PROOF_SERVER_URL : undefined;

    config = {
      networkId: envNetwork || PREVIEW_MIDNIGHT_CONFIG.networkId,
      nodeRpcUrl: customNodeRpc || PREVIEW_MIDNIGHT_CONFIG.nodeRpcUrl,
      proofServerUrl: customProof || PREVIEW_MIDNIGHT_CONFIG.proofServerUrl,
      indexerUrl: customIndexer || PREVIEW_MIDNIGHT_CONFIG.indexerUrl,
      indexerWsUrl: customIndexerWs || PREVIEW_MIDNIGHT_CONFIG.indexerWsUrl,
      isLocalStandalone: false
    };
  }

  try {
    setNetworkId(config.networkId || "preview");
  } catch (e) {
    // Ignore if already set
  }

  return config;
}

