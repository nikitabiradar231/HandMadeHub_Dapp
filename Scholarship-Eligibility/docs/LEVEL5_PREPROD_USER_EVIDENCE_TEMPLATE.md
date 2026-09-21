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
| Historical Form Submissions | 50 | 51 | Source PDF data analyzed |
| Complete Preprod-Format Addresses | 50 | 50 | 50 complete wallet addresses submitted |
| Incomplete / Truncated Address | 0 | 1 | Entry #10 (Pooja Kohinkar - truncated string) |
| Transaction Hashes Supplied | 50 | 0 | Pending participant hash submission |
| Indexer Confirmed Transactions | 50 | 0 | 0 confirmed on indexer |
| Documented App Interactions | 50 | Pending | Pending participant evidence |
| **Independently Verified On-Chain** | **50** | **0 (Pending)** | **Requires indexer/tx hash verification** |

---

## 6. Preprod User Evidence Roster (50-User Target Table)

*This roster tracks participant entries as verified evidence (Tier C & Tier D) is collected.*

| # | Public Wallet Address | Network | Feature Tested | User Feedback ID | Participant-Provided Evidence | Transaction Hash | Verification Status |
|---|---|---|---|---|---|---|---|
| 1 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 2 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 3 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 4 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 5 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 6 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 7 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 8 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 9 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 10 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 11 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 12 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 13 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 14 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 15 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 16 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 17 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 18 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 19 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 20 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 21 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 22 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 23 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 24 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 25 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 26 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 27 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 28 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 29 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 30 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 31 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 32 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 33 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 34 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 35 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 36 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 37 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 38 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 39 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 40 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 41 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 42 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 43 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 44 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 45 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 46 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 47 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 48 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 49 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
| 50 | Pending | Preprod | Search / Details / Guidance / ZK | Pending | Pending | Pending | `PENDING_ONCHAIN_PROOF` |
