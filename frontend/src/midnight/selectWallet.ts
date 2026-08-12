import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

/** Environment defaults (overridable via `frontend/.env`). */
export const NETWORK_ID: string = import.meta.env.VITE_NETWORK_ID ?? 'preview';

// The Midnight.js runtime and contract layers call getNetworkId() for every
// wallet, provider, contract and transaction operation. Configure it up front —
// before any of those run — so ledger deserialization, address parsing and
// transaction building are bound to the network declared by the frontend.
setNetworkId(NETWORK_ID);

/**
 * Ledger address of the deployed HandMadeHub contract. The default is the
 * address recorded in `.midnight-state.json` for the local devnet.
 */
export const CONTRACT_ADDRESS: string =
  import.meta.env.VITE_CONTRACT_ADDRESS ??
  '11f29a415f12812531d87e7c642215ae6d132e10810471d54a0b1025dbfa67bf';

/**
 * The Midnight browser wallet injects an object under `window.midnight` whose
 * values are `InitialAPI` instances (one per supported API version). We use
 * the connector API v4.x family.
 */
const COMPATIBLE_CONNECTOR_API_VERSION = '4';

declare global {
  interface Window {
    midnight?: Record<string, InitialAPI>;
    oneam?: any;
    '1am'?: any;
    oneamWallet?: any;
    mnLace?: any;
    lace?: any;
    cardano?: any;
  }
}

/**
 * Discover all injected Midnight and 1AM wallet instances from global window object.
 */
export function findWallets(): InitialAPI[] {
  if (typeof window === 'undefined') return [];

  const found: InitialAPI[] = [];

  // 1. Inspect window.midnight (official DApp Connector standard)
  const injectedMidnight = window.midnight;
  if (injectedMidnight && typeof injectedMidnight === 'object') {
    for (const val of Object.values(injectedMidnight)) {
      if (val && typeof val === 'object' && 'apiVersion' in val) {
        found.push(val as InitialAPI);
      }
    }
  }

  // 2. Direct window.oneam or window['1am']
  const directOneAM = window.oneam || window['1am'] || window.oneamWallet;
  if (directOneAM && typeof directOneAM === 'object') {
    if ('apiVersion' in directOneAM) {
      found.push(directOneAM as InitialAPI);
    } else if (directOneAM.api && typeof directOneAM.api === 'object' && 'apiVersion' in directOneAM.api) {
      found.push(directOneAM.api as InitialAPI);
    }
  }

  // 3. Inspect window.cardano.midnight
  if (window.cardano?.midnight && typeof window.cardano.midnight === 'object' && 'apiVersion' in window.cardano.midnight) {
    found.push(window.cardano.midnight as InitialAPI);
  }

  return found;
}

export function findCompatibleWallet(): InitialAPI | undefined {
  const wallets = findWallets();

  // Prioritize 1AM or Midnight v4 connector
  const oneAM = wallets.find((w) => w.name?.toLowerCase().includes('1am') || w.rdns?.toLowerCase().includes('1am'));
  if (oneAM && oneAM.apiVersion?.startsWith(COMPATIBLE_CONNECTOR_API_VERSION)) {
    return oneAM;
  }

  return wallets.find((w) => w.apiVersion?.startsWith(COMPATIBLE_CONNECTOR_API_VERSION)) || wallets[0];
}

/** All `InitialAPI`s, used to render a wallet picker. */
export function listWalletDescriptors(): { rdns: string; name: string; icon: string }[] {
  return findWallets().map(({ rdns, name, icon }) => ({
    rdns: rdns || '1am.midnight.wallet',
    name: name || 'Midnight 1AM Wallet',
    icon: icon || '',
  }));
}

/**
 * Connect to the Midnight / 1AM wallet on the requested network.
 *
 * @throws if no compatible wallet extension is installed, the user rejects the
 * connection, or the wallet is already connected to a different network.
 */
export async function connectWallet(networkId: string = NETWORK_ID): Promise<ConnectedAPI> {
  let wallet = findCompatibleWallet();

  // Retry discovery for up to 1 second if extension loads asynchronously
  if (!wallet && typeof window !== 'undefined') {
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 100));
      wallet = findCompatibleWallet();
      if (wallet) break;
    }
  }

  if (!wallet) {
    throw new Error(
      'No compatible Midnight / 1AM wallet found. Install the 1AM Midnight browser extension (connector API v4.x) and reload this page.',
    );
  }

  console.log(`[Midnight DApp] Connecting to wallet "${wallet.name || 'Midnight Wallet'}" on network ${networkId}…`);

  const connectedApi = await wallet.connect(networkId);
  const status = await connectedApi.getConnectionStatus();

  if (status.status !== 'connected' || status.networkId !== networkId) {
    const actual = status.status === 'connected' ? `'${status.networkId}'` : 'nothing';
    throw new Error(`Wallet is connected to ${actual}, but HandMadeHub requires '${networkId}'.`);
  }

  return connectedApi;
}
