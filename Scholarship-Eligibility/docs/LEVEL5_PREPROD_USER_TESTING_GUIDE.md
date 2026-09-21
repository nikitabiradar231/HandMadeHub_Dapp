# Level 5 — Preprod User Testing & Evidence Guide

## 1. Purpose

This document provides a simple, standardized testing procedure for participants and project administrators evaluating the **Private Scholarship Eligibility Verification DApp** on the **Midnight Preprod Testnet**.

The primary objective is to collect legitimate evidence from **50 real users** who test the Level 5 Minimum Viable Product (MVP) and voluntarily submit feedback and public wallet information.

The historical dataset analyzed from the official feedback PDF contains **51 total feedback responses** containing **50 complete Preprod-format wallet addresses** submitted (and 1 truncated address). Independent on-chain verification is a separate evidence verification step requiring transaction hash receipts or indexer proofs. This guide defines the procedures for gathering and verifying participant evidence.

---

## 2. Prerequisites

Before starting the test, participants must ensure they have:

1. **Midnight-Compatible Wallet**: Injected browser wallet extension (Lace Wallet / 1AM Wallet) configured for the **Midnight Preprod Testnet** (`preprod`).
2. **Access to Live Application**: Local development server (`http://localhost:3000`) or official live deployment ([`https://scholarship-eligibility.vercel.app`](https://scholarship-eligibility.vercel.app)).
3. **Testnet tDUST Tokens**: Preprod testnet tokens from the official Midnight faucet for optional wallet transactions.
4. **ZERO Private Credentials Mandate**: Participants must NEVER share seed phrases, recovery words, private keys, wallet passwords, or secret viewing keys with the project team.

---

## 3. Strict Privacy & Security Safeguards

> [!IMPORTANT]
> **CRITICAL PRIVACY PROTECTION MANDATE**
> 
> Project team members and testing forms will **NEVER** ask for private wallet credentials.

### Prohibited Information (NEVER Collect or Share)
- ❌ **Seed Phrases / Secret Recovery Phrases** (12 or 24 words)
- ❌ **Private Keys** (Hexadecimal or Bech32)
- ❌ **Wallet Extension Passwords**
- ❌ **Private State Passwords or Secret Viewing Keys**

### Permitted Public Information (Voluntarily Provided Only)
- ✅ **Public Wallet Address**: Bech32 address string (`mn_addr_preprod1...` or `mn_dust_preprod1...`).
- ✅ **Transaction Hash**: 64-character hexadecimal transaction digest generated upon submitting a wallet action (optional).
- ✅ **Qualitative Feedback**: Feature ratings, usability impressions, and feature requests.

---

## 4. Participant Step-by-Step Test Flow

Participants should execute the following six-step testing workflow:

```text
[Step 1: Connect Wallet] ──> [Step 2: Search Scholarships] ──> [Step 3: Inspect Details]
                                                                        │
[Step 6: Submit Feedback] <── [Step 5: Apply / ZK Proof] <── [Step 4: Follow Guidance]
```

### Step 1 — Connect Wallet
1. Open the application interface.
2. Click **Connect Wallet** in the top navigation header.
3. Select your injected Midnight wallet (Lace Wallet or 1AM Wallet).
4. Verify that your wallet network indicator displays **Midnight Preprod (`preprod`)**.

### Step 2 — Search & Filter Scholarships
1. Under the **Student Portal**, locate the **Scholarship Search** input box.
2. Type a scholarship keyword, title, or category (e.g., `"Tech STEM"`, `"Merit"`, or `"Quantum"`).
3. Observe real-time, case-insensitive filtering matching scholarship names and descriptions.
4. Test the **Clear Search (`X`)** button and observe query result counter (`Showing X of Y scholarships`).

### Step 3 — Inspect Detailed Scholarship Information
1. Click **View Details & Apply** on any filtered scholarship card.
2. Review enriched metadata:
   - Unique Scholarship ID (`#id`)
   - Provider Name (`createdBy`) & Wallet Address (`creatorAddress`)
   - Creation Date (`createdAt`)
   - Eligibility Criteria Grid: Minimum Academic Marks (%) & Maximum Family Income Ceiling (₹)
   - Required Document Verification Tags
   - **Zero-Knowledge Privacy Guarantee Breakdown**: Explanation of how private circuits evaluate eligibility without publishing sensitive financial or academic numbers on-chain.

### Step 4 — Follow 4-Stage Workflow Guidance
1. Observe the **Student Application Workflow Guidance** banner at the top of the portal.
2. Review the four guided workflow stages:
   - **Stage 1: Connect Wallet**: Wallet detection and role selection.
   - **Stage 2: Search & Apply**: Keyword filtering and document PDF upload.
   - **Stage 3: Credential Review**: Provider verification and approval.
   - **Stage 4: ZK Eligibility Check**: Private Zero-Knowledge proof execution.
3. Review contextual callout guidance cards integrated into search views, application forms, and status tracking views.

### Step 5 — Perform Application & ZK Eligibility Action
1. Select your document PDFs (Academic Marksheet & Income Certificate) and click **Submit Application**.
2. As an approved student, enter your private academic marks and family income into the **ZK Eligibility Verification Form**.
3. Click **Check Eligibility**.
4. Observe off-chain private witness evaluation, ZK circuit execution, and local eligibility result generation.
5. If an on-chain transaction is broadcast by your wallet, copy the resulting **Transaction Hash**.

### Step 6 — Submit User Feedback
Provide structured feedback including:
- Participant Identifier / Feedback ID (e.g., Name or Anonymous ID)
- Level 5 Features Tested (Search, Details, Guidance, ZK Verification)
- Qualitative Feedback & Feature Requests
- Public Midnight Preprod Wallet Address (Voluntarily supplied)
- Transaction Hash (Optional, only if an on-chain transaction occurred)

---

## 5. Four-Tier Evidence Classification Framework

Participant submissions are evaluated and recorded across four evidence tiers:

| Tier | Tier Name | Required Evidence | Verification Status Label |
|---|---|---|---|
| **Tier A** | Submitted Address | Form response containing a public wallet address string. | `TIER_A_SUBMITTED` |
| **Tier B** | Format Validated | Address begins with valid Bech32 Preprod prefix (`mn_addr_preprod1...` or `mn_dust_preprod1...`) and length (~77 chars). | `FORMAT_VALIDATED` |
| **Tier C** | App Interaction Evidence | Documented testing of Level 5 features (Search, Details, Guidance, ZK Action) with timestamp and feedback. | `TIER_C_APP_EVIDENCE` |
| **Tier D** | Verified On-Chain | Transaction hash or indexer proof independently verified on Midnight Preprod RPC / GraphQL Indexer. | `VERIFIED_ONCHAIN` |

> [!CAUTION]
> **Key Distinction**: Tier B (Format Validated) proves address syntax only and does **NOT** imply Tier C (Interaction Evidence) or Tier D (On-Chain Verification). Only Tier C and Tier D entries count toward the 50 verified user target.

---

## 6. Administrator Verification Checklist

Before adding a participant entry to the official evidence roster in [`docs/LEVEL5_PREPROD_USER_EVIDENCE_TEMPLATE.md`](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_PREPROD_USER_EVIDENCE_TEMPLATE.md), the project administrator must verify:

- [ ] Participant tested the live Level 5 web application
- [ ] Participant connected an active Midnight Preprod wallet
- [ ] Participant tested scholarship search & filtering
- [ ] Participant opened and inspected enriched scholarship details view
- [ ] Participant reviewed 4-stage workflow guidance
- [ ] Participant executed an available eligibility/application action
- [ ] Participant submitted qualitative user feedback
- [ ] Public wallet address received voluntarily from participant
- [ ] Transaction hash received if an on-chain transaction occurred
- [ ] Confirmed ZERO private credentials (seeds, keys, passwords) were collected
- [ ] Evidence recorded in [`docs/LEVEL5_PREPROD_USER_EVIDENCE_TEMPLATE.md`](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_PREPROD_USER_EVIDENCE_TEMPLATE.md)

---

## 7. Evidence Recording Example (Placeholder Reference)

*The following is a non-functional PLACEHOLDER example illustrating how legitimate participant records are logged into the evidence template once testing is performed:*

```text
EXAMPLE RECORD:
User #: 01
Public Wallet Address: mn_addr_preprod1exampleaddress123456789abcdefghijklmnopqrstuvwxyz
Network: Midnight Preprod (preprod)
Feedback ID: FB-2026-001
Feature Tested: Search + Enriched Details + 4-Stage Guidance
Participant Feedback: "Search is fast and responsive. The 4-step guidance made the ZK proof step clear."
Transaction Hash: 0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890
Verification Status: VERIFIED_ONCHAIN (Tier D)
```

> **Note**: This example uses dummy placeholders and is not counted as a real participant submission.
