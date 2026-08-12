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

  console.debug('[Midnight/1AM Error Trace]:', error);

  // 1. User rejection
  if (
    code === '4001' ||
    rawMessage.includes('4001') ||
    /rejected|denied|cancelled|canceled|declined/i.test(rawMessage)
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
      rawMessage,
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
  if (/insufficient.*dust|insufficient.*tnight|balance too low|not enough funds/i.test(rawMessage)) {
    return {
      title: 'Insufficient Balance',
      detail: 'Your Midnight wallet does not have enough DUST or tNIGHT for transaction fees. Please fund your wallet using the faucet.',
      isRecoverable: true,
      code: 'INSUFFICIENT_FUNDS',
    };
  }

  // 4. Wallet Provider Not Found
  if (
    /no compatible midnight wallet|wallet extension not found|provider not detected|install the 1am/i.test(
      rawMessage,
    )
  ) {
    return {
      title: 'Wallet Extension Missing',
      detail: 'No compatible Midnight / 1AM wallet extension was found. Please ensure your browser extension is unlocked and refreshed.',
      isRecoverable: false,
      code: 'WALLET_NOT_FOUND',
    };
  }

  // 5. 1AM Gateway Challenge / Authentication Errors
  if (/challenge request failed|404|401|unauthorized|authentication required|sign in to the 1am/i.test(rawMessage)) {
    return {
      title: '1AM Gateway Authentication Failed',
      detail: 'Could not complete 1AM Gateway authentication challenge. Please re-authenticate your wallet.',
      isRecoverable: true,
      code: '1AM_AUTH_FAILED',
    };
  }

  // 6. Network ID Mismatch
  if (/wrong.*network|network mismatch|connected to.*requires/i.test(rawMessage)) {
    return {
      title: 'Network Mismatch',
      detail: 'Your wallet is on a different Midnight network. Please switch to the Preview testnet.',
      isRecoverable: true,
      code: 'WRONG_NETWORK',
    };
  }

  // 7. ZK Proof Generation Failure
  if (/proof.*failed|proving failed|zk.*error|failed to build proof/i.test(rawMessage)) {
    return {
      title: 'Proof Generation Failed',
      detail: 'Zero-knowledge proof calculation encountered an issue. Ensure your local proof server or extension is running.',
      isRecoverable: true,
      code: 'PROOF_FAILED',
    };
  }

  // 8. Indexer or Network Fetch Errors
  if (/failed to fetch|networkerror|econnrefused|indexer query/i.test(rawMessage)) {
    return {
      title: 'Network Connection Issue',
      detail: 'Unable to reach the Midnight indexer or RPC gateway. Check your internet connection and try again.',
      isRecoverable: true,
      code: 'FETCH_FAILED',
    };
  }

  // Clean raw message fallback
  const cleanMessage = rawMessage.replace(/^Error:\s*/, '').trim();
  return {
    title: 'Operation Failed',
    detail: cleanMessage.length > 140 ? `${cleanMessage.slice(0, 140)}…` : cleanMessage,
    isRecoverable: true,
  };
}
