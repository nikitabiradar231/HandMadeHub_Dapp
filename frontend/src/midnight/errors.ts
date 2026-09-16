/**
 * Human-readable error parsing for Midnight Network and 1AM Gateway operations.
 * Converts raw internal exceptions, RPC errors, and wallet/gateway messages
 * into user-friendly status text while logging full debug trace to dev console.
 */

export interface ParsedError {
  title: string;
  detail: string;
  isRecoverable: boolean;
  code?: string;
}

export function parseMidnightError(error: unknown): string {
  const parsed = parseMidnightErrorDetails(error);
  return `${parsed.title}${parsed.detail ? `: ${parsed.detail}` : ''}`;
}

export function parseMidnightErrorDetails(error: unknown): ParsedError {
  if (!error) {
    return {
      title: 'Unknown Error',
      detail: 'An unspecified error occurred. Please try again.',
      isRecoverable: true,
    };
  }

  const rawMessage = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string | number })?.code ? String((error as { code?: string | number }).code) : undefined;

  let currentErr: any = error;
  const causes: string[] = [];
  while (currentErr && typeof currentErr === 'object') {
    if (currentErr.message && typeof currentErr.message === 'string') {
      causes.push(currentErr.message);
    }
    currentErr = currentErr.cause;
  }
  const fullErrorString = [rawMessage, ...causes, String(error)].join(' ');

  console.debug('[Midnight/Lace Error Trace]:', error);

  // 1. User rejection
  if (
    code === '4001' ||
    code === '4001' ||
    /4001|rejected|denied|cancelled|canceled|declined/i.test(fullErrorString)
  ) {
    return {
      title: 'Action Cancelled',
      detail: 'Transaction or signature request was rejected in your wallet.',
      isRecoverable: true,
      code: 'USER_REJECTED',
    };
  }

  // 2. DUST State / Synchronization errors
  if (
    /DUST state is not ready|sync\/state refresh|wallet state is not ready|synchronizing/i.test(
      fullErrorString,
    )
  ) {
    return {
      title: 'Wallet Synchronizing',
      detail: 'Wallet state is still synchronizing with the Midnight network. Please wait a moment and try again.',
      isRecoverable: true,
      code: 'DUST_SYNCING',
    };
  }

  // 3. Balance / DUST Insufficient
  if (/insufficient.*dust|insufficient.*tnight|balance too low|not enough funds/i.test(fullErrorString)) {
    return {
      title: 'Insufficient Balance',
      detail: 'Your Midnight wallet does not have enough DUST or tNIGHT for transaction fees. Please fund your wallet using the faucet.',
      isRecoverable: true,
      code: 'INSUFFICIENT_FUNDS',
    };
  }

  // 4. Wallet Provider Not Found
  if (
    /no compatible midnight wallet|no compatible lace wallet|wallet extension not found|provider not detected|install the lace|install the 1am/i.test(
      fullErrorString,
    )
  ) {
    return {
      title: 'Wallet Extension Missing',
      detail: 'No compatible Lace Midnight wallet extension was found. Please ensure your Lace browser extension is unlocked and refreshed.',
      isRecoverable: false,
      code: 'WALLET_NOT_FOUND',
    };
  }

  // 5. Network ID Mismatch
  if (/wrong.*network|network mismatch|connected to.*requires/i.test(fullErrorString)) {
    return {
      title: 'Network Mismatch',
      detail: 'Your wallet is on a different Midnight network. Please switch to the Preview testnet.',
      isRecoverable: true,
      code: 'WRONG_NETWORK',
    };
  }

  // 6. ZK Proof Generation & Header Tag Mismatch Failure
  if (/expected header tag|midnight:proof-versioned|midnight:vec/i.test(fullErrorString)) {
    return {
      title: 'Proof Version Mismatch',
      detail:
        'The connected wallet extension generated an unversioned proof format (midnight:vec). Please run a local Midnight Proof Server (`docker compose up -d proof-server`) and set `VITE_PROOF_SERVER_URL=http://127.0.0.1:6300` in frontend/.env.',
      isRecoverable: true,
      code: 'PROOF_HEADER_MISMATCH',
    };
  }

  if (/temporarily banned|transaction.*banned/i.test(fullErrorString)) {
    return {
      title: 'Transaction Temporarily Banned',
      detail:
        'The node mempool temporarily rate-limited this transaction because a previous submission failed or used overlapping inputs. Please wait 30–60 seconds, reconnect your wallet, and try again.',
      isRecoverable: true,
      code: 'TRANSACTION_BANNED',
    };
  }

  if (/proof.*failed|proving failed|zk.*error|failed to build proof/i.test(fullErrorString)) {
    return {
      title: 'Proof Generation Failed',
      detail: 'Zero-knowledge proof calculation encountered an issue. Ensure your Lace wallet or local proof server is ready.',
      isRecoverable: true,
      code: 'PROOF_FAILED',
    };
  }

  // 7. Indexer or Network Fetch Errors
  if (/failed to fetch|networkerror|econnrefused|indexer query/i.test(fullErrorString)) {
    return {
      title: 'Network Connection Issue',
      detail: 'Unable to reach the Midnight indexer or RPC gateway. Check your internet connection and try again.',
      isRecoverable: true,
      code: 'FETCH_FAILED',
    };
  }

  // 8. Scoped Transaction Error handling
  if (/submitting scoped transaction|balancing scoped transaction/i.test(rawMessage)) {
    let clean = rawMessage
      .replace(/^Unexpected error (submitting|balancing) scoped transaction '[^']*':\s*/i, '')
      .replace(/^Error:\s*/i, '')
      .trim();

    if (!clean || clean === 'Error') {
      clean = 'Wallet declined or failed to submit the transaction to Midnight Network.';
    }

    return {
      title: 'Transaction Submission Failed',
      detail: `${clean} Ensure your Lace Wallet is unlocked, connected to Preview Testnet, and has tNIGHT and DUST balance.`,
      isRecoverable: true,
      code: 'SCOPED_TX_FAILED',
    };
  }

  // Clean raw message fallback
  let cleanMessage = rawMessage
    .replace(/^Error:\s*/i, '')
    .replace(/^Unexpected error (submitting|balancing) scoped transaction '[^']*':\s*/i, '')
    .replace(/^Error:\s*/i, '')
    .trim();

  if (!cleanMessage || cleanMessage === 'Error') {
    cleanMessage = 'Transaction failed. Please check Lace Wallet connection and try again.';
  }

  return {
    title: 'Operation Failed',
    detail: cleanMessage.length > 180 ? `${cleanMessage.slice(0, 180)}…` : cleanMessage,
    isRecoverable: true,
  };
}
