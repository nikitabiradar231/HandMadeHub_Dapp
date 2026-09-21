# Level 5 — Preprod User Evidence Collection Template

## 1. Purpose & Scope

This document defines the standardized evidence collection framework for Level 5 of the **Private Scholarship Eligibility Verification DApp**.

The objective is to establish verifiable evidence for the Level 5 requirement of **50 Preprod users with verifiable wallet addresses and application interaction evidence**.

---

## 2. Strict Privacy Protection Mandate

To guarantee user security and comply with privacy-preserving principles:

- **Public Data Only**: Only public Midnight wallet addresses (`mn_addr_preprod1...` or `mn_dust_preprod1...`) and voluntarily provided transaction hashes are collected.
- **STRICTLY PROHIBITED**:
  - ❌ NEVER request, collect, store, display, or log wallet seed phrases.
  - ❌ NEVER request 12-word or 24-word recovery phrases.
  - ❌ NEVER request private keys.
  - ❌ NEVER request wallet extension passwords.
  - ❌ NEVER request private state encryption keys or secret viewing keys.
- **Optional Transaction Proof**: Transaction hashes are collected only if voluntarily provided by participants after executing on-chain actions.

---

## 3. Four-Tier Evidence Classification Framework

To ensure maximum rigor and prevent false assertions, participant submissions are classified into four distinct tiers:

| Evidence Tier | Tier Name | Definition & Qualification Criteria | Status |
|---|---|---|---|
| **Tier A** | Submitted Address | Public wallet address string submitted via feedback form. | Unverified |
| **Tier B** | Format Validated | Address begins with valid Bech32 Preprod prefix (`mn_addr_preprod1...` or `mn_dust_preprod1...`) and standard character length (~77 chars). | Structurally Valid |
| **Tier C** | App Interaction Evidence | Documented testing of Level 5 MVP features (Search, Enriched Details, 4-Step Guidance, Credential/ZK Action) with timestamp. | User Evidence |
| **Tier D** | On-Chain Verified | Transaction hash, block explorer receipt, or indexer record independently verified on Midnight Preprod RPC (`https://rpc.preprod.midnight.network`) or GraphQL Indexer. | Verified On-Chain |

> **Crucial Rule**: Format validity alone (Tier B) does NOT constitute proof of application usage. Tier C and Tier D evidence are required to count a participant toward the verified 50-user requirement.

---

## 4. Individual Participant Verification Checklist

Each participant record must satisfy the following checklist before being counted toward the 50-user requirement:

- [ ] Participant accessed the Level 5 web application (`http://localhost:3000` or live deployment)
- [ ] Connected an active Midnight Preprod wallet (Lace Wallet / 1AM Wallet)
- [ ] Tested scholarship browsing and keyword search filtering
- [ ] Opened enriched scholarship details view modal
- [ ] Followed 4-stage workflow guidance banner
- [ ] Performed an available application submission or ZK eligibility check action
- [ ] Submitted structured qualitative feedback
- [ ] Provided valid public Midnight Preprod wallet address
- [ ] (Optional) Provided transaction hash receipt for on-chain action
- [ ] Verified ZERO secret credentials (seeds, private keys, passwords) were collected or exposed

---

## 5. Target Progress Summary

| Metric | Target | Current Status | Notes |
|---|---|---|---|
| **Target Preprod Users** | **50** | 50 Target | Level 5 Requirement |
| Historical Form Responses | 50 | 51 | Source PDF data analyzed |
| Structurally Valid Addresses | 50 | 49 | 47 Shielded, 2 DUST |
| Non-Preprod / Invalid Format | 0 | 3 | 1 Mainnet, 1 Preview, 1 Truncated |
| Documented App Interactions | 50 | Pending | Pending active session proofs |
| **Independently Verified On-Chain** | **50** | **0 (Pending)** | **Requires indexer/tx hash verification** |

---

## 6. Preprod User Evidence Roster (50-User Target Table)

*This roster tracks participant entries as verified evidence (Tier C & Tier D) is collected.*

| # | Public Wallet Address | Network | User Feedback ID | Feature Tested | Feedback Submitted | Transaction Hash | Verification Status |
|---|---|---|---|---|---|---|---|
| 1 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 2 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 3 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 4 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 5 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 6 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 7 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 8 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 9 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 10 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 11 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 12 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 13 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 14 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 15 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 16 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 17 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 18 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 19 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 20 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 21 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 22 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 23 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 24 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 25 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 26 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 27 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 28 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 29 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 30 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 31 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 32 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 33 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 34 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 35 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 36 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 37 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 38 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 39 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 40 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 41 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 42 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 43 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 44 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 45 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 46 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 47 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 48 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 49 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
| 50 | Pending | Preprod | Pending | Search / Details / Guidance / ZK | Pending | Pending | Pending Verification |
