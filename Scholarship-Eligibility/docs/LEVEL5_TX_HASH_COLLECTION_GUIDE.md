# Level 5 — Public Transaction Hash Collection Guide

## 1. Purpose

This document provides step-by-step instructions for participants in the Level 5 user-testing program of the **Private Scholarship Eligibility Verification DApp**.

To satisfy the Level 5 requirement of **50 Preprod users with verifiable on-chain evidence**, participants who have submitted feedback need to provide a public **Transaction Hash (`txHash`)** resulting from an interaction on the **Midnight Preprod Testnet**.

---

## 2. Strict Security & Privacy Warning

> [!CAUTION]
> ### NEVER SUBMIT PRIVATE CREDENTIALS OR KEYS
> When participating in on-chain verification, **NEVER** share, enter, store, or submit any of the following:
> - ❌ Seed phrases / 12-word or 24-word recovery phrases
> - ❌ Wallet private keys
> - ❌ Wallet extension passwords
> - ❌ Private state viewing keys or secret decryption keys
>
> **Legitimate verification NEVER requests private keys or seed phrases.**

> [!NOTE]
> **Why is a Transaction Hash safe to share?**
> A transaction hash (`txHash`) is **public information** generated when a transaction is broadcast to the Midnight Preprod blockchain. It contains no private keys, passwords, or secret data, and is used solely to verify on the public indexer that a transaction was successfully included in a block on Midnight Preprod.

---

## 3. Step-by-Step Participant Instructions

### Step A: Access the DApp & Connect Wallet
1. Open the **Scholarship Eligibility Verification DApp** (`http://localhost:3000` or official deployment URL).
2. Connect your **Midnight Preprod Wallet** (Lace Wallet or 1AM Wallet extension).
3. Ensure your wallet network is set to **Midnight Preprod (`preprod`)**.

### Step B: Perform a Supported On-Chain Action
Execute one of the supported application interactions on the Midnight Preprod DApp:
- **Scholarship Application**: Select an available scholarship, attach verification PDF documents, and submit your application.
- **ZK Eligibility Verification**: Execute the Zero-Knowledge eligibility circuit (`verifyEligibility()`) for a verified scholarship application.
- **DUST Account Registration**: Perform a DUST registration or public output transaction on Midnight Preprod.

### Step C: Wait for Transaction Finalization
1. Approve and sign the transaction in your Midnight wallet extension.
2. Wait for the transaction status banner to display **"Transaction Confirmed"** or **"Finalized on Block"**.

### Step D: Copy Your Public Transaction Hash (`txHash`)
1. Open your wallet extension's **Activity / History** tab, OR copy the transaction hash displayed in the DApp confirmation view.
2. Copy the 64-character hexadecimal transaction ID string (e.g., `0x1a2b3c4d...` or `tx_...`).

### Step E: Submit Your Verification Evidence
Submit ONLY the following four public fields via the official participant verification form:
1. **Participant Identifier**: Your Name or Participant ID.
2. **Public Wallet Address**: Your previously submitted Midnight Preprod wallet address (`mn_addr_preprod1...` or `mn_dust_preprod1...`).
3. **Public Transaction Hash (`txHash`)**: The 64-character public transaction hash from Step D.
4. **Action Performed**: Description of action tested (e.g. *"Scholarship Application Submission"* or *"ZK Eligibility Circuit Execution"*).

*Note: The official Google Form collection link will be provided separately by the project administrator (Nikita).*

---

## 4. Participant Evidence Submission Template

This structured template represents the participant evidence roster format used to record submitted public transaction hashes:

| # | Participant Name | Public Wallet Address | Public Transaction Hash (`txHash`) | Action Performed | Verification Status |
|---|---|---|---|---|---|
| 1 | Participant Name | `mn_addr_preprod1...` | `[64-char public txHash]` | ZK Eligibility Verification | `PENDING_INDEXER_QUERY` |
| 2 | Participant Name | `mn_addr_preprod1...` | `[64-char public txHash]` | Scholarship Application | `PENDING_INDEXER_QUERY` |
| ... | ... | ... | ... | ... | ... |
| 50 | Participant Name | `mn_addr_preprod1...` | `[64-char public txHash]` | DUST Registration | `PENDING_INDEXER_QUERY` |

---

## 5. Automated On-Chain Verification

Once participant transaction hashes are collected into `scripts/verify-preprod-wallets.ts`, the automated verification suite executes:

```bash
npm run verify:preprod-users
```

The script queries the Midnight Preprod Indexer (`https://indexer.preprod.midnight.network/api/v3/graphql`) to confirm each transaction hash against public block height records:

```text
==================================================
VERIFICATION TOOLING SUMMARY
==================================================
Total Submitted Responses Analyzed      : 51
Complete Preprod-Format Wallet Addresses: 50
Independently Verified On-Chain         : [Verified Count / 50]
--------------------------------------------------
STATUS: Verified on Midnight Preprod Indexer.
```

---

## 6. Verification Pipeline Summary

```text
[Tier A: Address Submitted] ──► [Tier B: Preprod Format Validated] ──► [Tier C: App Interaction] ──► [Tier D: Public TxHash Verified On-Chain]
```
