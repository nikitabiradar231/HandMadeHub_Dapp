# 🔐 Private Scholarship Eligibility Verification — Genuine Full-Stack Midnight DApp

> **Privacy-Preserving Zero-Knowledge Smart Contract DApp built on the Midnight Network (Preview Testnet)**

[![CI/CD](https://github.com/nikitabiradar231/HandMadeHub_Dapp/actions/workflows/ci.yml/badge.svg)](https://github.com/nikitabiradar231/HandMadeHub_Dapp/actions/workflows/ci.yml)
[![Midnight Network](https://img.shields.io/badge/Midnight-Compact%20ZK-indigo?style=flat-square)](#technology-stack)
[![Preview Testnet](https://img.shields.io/badge/Midnight-Preview-purple?style=flat-square)](#network-information)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🔗 Quick Links & Product Links

- **Official Level 5 Submission Repository**: [https://github.com/nikitabiradar231/HandMadeHub_Dapp](https://github.com/nikitabiradar231/HandMadeHub_Dapp) (located in `Scholarship-Eligibility/` directory)
- **Live DApp Deployment**: [https://scholarship-eligibility.vercel.app](https://scholarship-eligibility.vercel.app)
- **Product X (Twitter) Profile**: [@ScholarshipZK](https://x.com/ScholarshipZK)
- **Demo Video Guide**: [Watch Video Demonstration](https://drive.google.com/file/d/11B1n7HpT8hWQvCwUFXCiICrCSkZo8RUN/view?usp=drivesdk)

---

## 🎥 Demo Flow Overview
1. Open the application at `http://localhost:3000` or live deployment at [https://scholarship-eligibility.vercel.app](https://scholarship-eligibility.vercel.app).
2. Click **Connect Wallet** to detect injected Midnight wallets (Lace Wallet / 1AM Wallet) via `@midnight-ntwrk/dapp-connector-api` on Midnight Preview.
3. Select your role as **Student** or **Scholarship Provider**.
4. As **Provider**: Create a new scholarship program defining `minimumMarks` and `maximumFamilyIncome` criteria. Review student document submissions and verify credentials.
5. As **Student**: Browse available scholarships, submit documents, and execute the `verifyEligibility()` zero-knowledge circuit.
6. Observe wallet signing, proof generation, transaction broadcast to Midnight Preview, and live indexer state updates.

---

## 🌐 Network Information & Deployment Status

- **Target Network**: Midnight Preview Testnet (`preview`)
- **Deployed Contract Address**: [`9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49`](https://explorer.preview.midnight.network/contract/9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49)
- **Deployment Transaction Hash**: [`0060c6949e09eab2a692561e8b7b59ddd6ecafde95b103744885dbafbf94877e65`](https://explorer.preview.midnight.network/tx/0060c6949e09eab2a692561e8b7b59ddd6ecafde95b103744885dbafbf94877e65)
- **Node RPC Endpoint**: `https://rpc.preview.midnight.network`
- **Proof Server Endpoint**: `https://proof-server.preview.midnight.network`
- **Indexer Endpoint**: `https://indexer.preview.midnight.network/api/v3/graphql`
- **Indexer WebSocket**: `wss://indexer.preview.midnight.network/api/v3/graphql/ws`
- **Block Explorer**: [https://explorer.preview.midnight.network](https://explorer.preview.midnight.network)
- **Deployment API**: Official `deployContract()` method from `@midnight-ntwrk/midnight-js-contracts`
- **DApp Connector API**: Official `@midnight-ntwrk/dapp-connector-api` integration
- **Compact Contract Location**: `contracts/scholarship-eligibility.compact`
- **Generated Contract API Location**: `src/managed/scholarship-eligibility/index.ts`

---

## 🏗️ DApp Architecture

```text
User Device (Browser)
     │
     ├── React 18 + Vite Frontend
     │        │
     │        ├── Midnight DApp Connector API (@midnight-ntwrk/dapp-connector-api)
     │        │        │
     │        │        └── Midnight Wallet Extension (Lace / 1AM Wallet)
     │        │
     │        └── Midnight Indexer Public Data Provider (@midnight-ntwrk/midnight-js-indexer-public-data-provider)
     │                 │
     │                 └── Midnight Indexer GraphQL / WebSocket Services (Preview Testnet)
     │
     └── Compact Smart Contract Executable (@midnight-ntwrk/compact-js)
              │
              ├── Private Witnesses (studentMarks, studentIncome, isCredentialVerified, callerAddress, callerRole)
              │
              └── ZK Circuits (verifyEligibility, updateCredentialStatus, updateScholarshipCriteria)
```

---

## ⚙️ Installation & Build Setup

### Prerequisites
- Node.js 20+ or Node.js 22
- npm 10+
- Midnight Wallet extension installed in browser (Lace Wallet / 1AM Wallet on Midnight Preview)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/nikitabiradar231/HandMadeHub_Dapp.git
cd HandMadeHub_Dapp/Scholarship-Eligibility

# Install root contract dependencies
npm install

# Install frontend dependencies
npm --prefix frontend install
```

### 2. Environment Configuration

Copy the example environment files:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

Ensure `.env` contains:
```env
MIDNIGHT_NETWORK_ID="preview"
MIDNIGHT_NODE_RPC_URL="https://rpc.preview.midnight.network"
MIDNIGHT_PROOF_SERVER_URL="https://proof-server.preview.midnight.network"
MIDNIGHT_INDEXER_URL="https://indexer.preview.midnight.network"
MIDNIGHT_INDEXER_WS_URL="wss://indexer.preview.midnight.network/ws"
PRIVATE_STATE_PASSWORD="ScholarshipSecretPass2026!"
MIDNIGHT_WALLET_SEED="<YOUR_64_CHAR_HEX_SEED>"
PREVIEW_CONTRACT_ADDRESS="9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49"
PREVIEW_DEPLOY_TX_HASH="0060c6949e09eab2a692561e8b7b59ddd6ecafde95b103744885dbafbf94877e65"
```

### 3. Build Contract & Frontend

```bash
# Compile TypeScript smart contract bindings
npm run build:contract

# Build React production bundle
npm run frontend:build
```

### 4. Deploy Contract to Midnight Preview (Live Deployment Guide)

Follow these steps to deploy the Compact contract to Midnight Preview testnet:

1. **Configure `.env`**:
   Copy `.env.example` to `.env` and set your 64-character hexadecimal deployer wallet seed:
   ```env
   MIDNIGHT_WALLET_SEED="<YOUR_64_CHAR_HEX_SEED>"
   ```
2. **Fund the Deployer Account**:
   Obtain testnet **tDUST** tokens from the official Midnight Preview faucet for your deployer account address.
3. **Verify Balance**:
   Ensure your deployer account has sufficient tDUST to cover gas fees for contract deployment.
4. **Run Deployment Script**:
   ```bash
   npm run deploy
   ```
5. **Inspect Output**:
   The script performs strict preflight validation. Upon successful deployment to Midnight Preview, it updates `.env` and `frontend/.env` with `PREVIEW_CONTRACT_ADDRESS` and `PREVIEW_DEPLOY_TX_HASH`.
6. **Start Frontend Web Application**:
   ```bash
   npm run frontend:dev
   ```
7. **Connect Midnight Wallet & Verify**:
   Open `http://localhost:3000`, connect your wallet on Midnight Preview, and execute `verifyEligibility()` ZK proof circuit.

---

## 🔄 Level 5 — User Feedback & Iteration

Level 5 of the project focuses on executing a closed-loop user feedback cycle: collecting real user feedback on the Level 4 Minimum Viable Product (MVP), identifying key user requests, implementing feedback-driven feature improvements, adding comprehensive regression test suites, and documenting Preprod user wallet evidence.

### 🔁 The Feedback Loop Process

```text
User Feedback Collection (51 Responses Analyzed)
                 │
                 ▼
Quantitative & Qualitative Analysis (Theme Extraction)
                 │
                 ▼
Three Core Feature Improvements Selected
                 │
                 ▼
Feature Implementation (Search, Details, Guidance)
                 │
                 ▼
Automated Regression Testing (34/34 Passing Tests)
                 │
                 ▼
Final Documentation & Evidence Report
```

---

### 💡 Implemented Level 5 Feedback Features

#### 1. 🔍 Scholarship Search & Filtering
- **User Feedback**: Multiple users requested search functionality to easily locate relevant scholarships (*"Add a search option"* — Niki Biradar, Suraj, Vivek Bedre).
- **Implementation**:
  - Real-time search input component in the Student Portal (`StudentPortal.tsx`).
  - Filters by **scholarship title/name** and **description** in a case-insensitive manner.
  - Interactive clear button (`X`), live query results counter (`Showing X of Y scholarships`), and dedicated empty state when no matches are found.
  - Contract service layer method `searchScholarships(query: string)` in `ScholarshipEligibilityContract`.

#### 2. 📋 Enhanced Scholarship Details & Metadata
- **User Feedback**: Users requested deeper scholarship detail views (*"Add more scholarship details"* — Shridevi; *"Make the result page more detailed"* — Kirti).
- **Implementation**:
  - Enriched card badges displaying provider organization string (`createdBy`), unique scholarship ID (`#id`), required document tags, ZK privacy indicators, and formatted creation timestamps.
  - Multi-section detailed view modal with structured sections: Overview, Eligibility Criteria Grid, Required Documents, Zero-Knowledge Privacy Guarantee breakdown, and PDF submission area.

#### 3. 🧭 Step-by-Step Workflow Guidance
- **User Feedback**: Users requested step-by-step guidance to simplify the application process (*"A little more guidance at each step could make the experience even smoother"* — Nayan Palande).
- **Implementation**:
  - Numbered 4-stage workflow progress banner at the top of the Student Portal:
    - **Step 1: Connect Wallet** (Midnight Preprod wallet detection)
    - **Step 2: Search & Apply** (Filter scholarships & upload document PDFs)
    - **Step 3: Credential Review** (Provider review & verification approval)
    - **Step 4: ZK Eligibility Check** (Execute private zero-knowledge circuit)
  - Contextual helper callout cards integrated into search/browsing views, application modals, status tracking tables, and ZK eligibility forms.

---

### 🧪 Level 5 Automated Regression Testing

To guarantee that future codebase updates cannot accidentally break feedback features, a comprehensive regression test suite was built into `tests/scholarship-eligibility.test.ts`.

- **Total Test Count**: **34 / 34 passing tests** across 2 test files.
- **Search Regression (`TEST 16`)**: Verifies title matching, description matching, case-insensitivity, no-results state, empty query behavior, and query resetting.
- **Details Regression (`TEST 17`)**: Verifies criteria parameters, document tags, publisher metadata, creation timestamps, and data integrity.
- **Guidance Regression (`TEST 18`)**: Verifies 4-stage workflow card definitions and contextual helper messages across all UI states.
- **Cross-Feature Integration (`TEST 19`)**: End-to-end integration test demonstrating: searching for a scholarship (`"Tech STEM"`) → loading enriched details → processing applicant through 4-stage guided workflow → executing Midnight ZK circuit (`marksDisclosed === false`, `incomeDisclosed === false`) → clearing search filter state safely.
- **Build Verification**:
  - Smart Contract Build: `npm run build` (`tsc`) passed with **0 errors**.
  - Frontend Production Build: `npm run frontend:build` (`tsc && vite build`) passed with **0 errors**.

---

### 📜 Level 5 Git Commit History

The Level 5 iteration was executed across five dedicated, single-purpose Git commits:

1. `feat(l5): add scholarship search based on user feedback` (`6c1bbee4b57d04499ef431d3f7ed46d0d3cee5fa`)
2. `feat(l5): improve scholarship details based on user feedback` (`55a4478fbf2d6070320bc246eeddcfbe2b423347`)
3. `feat(l5): add guidance throughout scholarship workflow` (`cb15f797c2b131de7f855ec1cdf24e5881ab6023`)
4. `test(l5): add regression coverage for feedback features` (`c66ed2901141db3307674a9d1a4958a82b6576d4`)
5. `docs(l5): finalize level 5 documentation and feedback loop` *(Current commit)*

---

### 📊 Preprod User Evidence & Verification Status

- **Target Goal**: 50 Real Preprod users with verifiable wallet addresses and documented application interaction evidence (**Collection Status: In Progress / Pending**).
- **Official Level 5 Documentation Package**:
  1. **User Feedback Report**: [`docs/LEVEL5_FEEDBACK_REPORT.md`](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_FEEDBACK_REPORT.md) (Feedback collection, analysis & 3 selected features)
  2. **Preprod Verification Report**: [`docs/LEVEL5_PREPROD_VERIFICATION.md`](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_PREPROD_VERIFICATION.md) (Tooling logic, status codes & indexer verification rules)
  3. **User Evidence Template**: [`docs/LEVEL5_PREPROD_USER_EVIDENCE_TEMPLATE.md`](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_PREPROD_USER_EVIDENCE_TEMPLATE.md) (Standardized 50-user tracking roster)
  4. **User Testing Guide**: [`docs/LEVEL5_PREPROD_USER_TESTING_GUIDE.md`](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_PREPROD_USER_TESTING_GUIDE.md) (6-step participant flow & administrator verification checklist)
  5. **Preprod Readiness Audit**: [`docs/LEVEL5_PREPROD_READINESS.md`](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_PREPROD_READINESS.md) (Network configuration, contract status & safety protocols)
- **Four-Tier Verification Framework**:
  1. *Tier A (Submitted Address)*: Address string submitted via feedback form (`mn_addr_preprod1...`).
  2. *Tier B (Format Validated)*: Valid Bech32 Preprod prefix (`mn_addr_preprod1...` / `mn_dust_preprod1...`) and character length (~77 chars).
  3. *Tier C (App Interaction Evidence)*: Documented testing of Level 5 features (Search, Details View, 4-Step Guidance, ZK Action).
  4. *Tier D (On-Chain Verified)*: Transaction hash or indexer proof verified on Midnight Preprod RPC / GraphQL Indexer (`npm run verify:preprod-users`).
- **Strict Privacy Protections**: Zero secret credentials collected or requested (no seeds, recovery phrases, private keys, passwords, or viewing keys).
- **Historical Dataset Analysis**:
  - *Total Feedback Submissions Collected*: 51 responses from official feedback PDF.
  - *Complete Preprod-Format Wallet Addresses Submitted*: 50 complete wallet addresses.
  - *Incomplete / Truncated Address*: 1 truncated address (#10 Pooja Kohinkar).
- **Deployed Smart Contract Reference**: Level 4 smart contract (`9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49`) remains deployed on Midnight Preview Testnet as the baseline contract reference.
- **Current Verification Status**: **Pending Verification (0 / 50 Verified On-Chain)**. Format completeness alone (Tier B) does not constitute on-chain proof. The Level 5 50-user requirement is being actively documented and verified. Full details are in [`docs/LEVEL5_PREPROD_VERIFICATION.md`](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_PREPROD_VERIFICATION.md).

---

## 🧪 Testing

### 1. Offline Unit & Regression Test Suite (34/34 Passing)
Run core contract logic, circuit validation, and Level 5 regression tests offline:

```bash
npm test
```

The test suite (34/34 passing across 2 test files) verifies:
1. Fresh state initialization with zero default demo data.
2. Permanent Student → Provider role binding protection.
3. Permanent Provider → Student role binding protection.
4. Provider scholarship ownership deletion authorization.
5. Ownership protection preventing unauthorized deletion.
6. Ownership protection preventing unauthorized criteria modification.
7. Role enforcement preventing student accounts from creating scholarships.
8. Full end-to-end ZK eligibility lifecycle for an eligible student (`marks >= min`, `income <= max`).
9. Circuit execution for marks below minimum requirement (`isEligible = false`).
10. Circuit execution for family income exceeding maximum parameter (`isEligible = false`).
11. Circuit execution for both conditions failing (`isEligible = false`).
12. Wallet adapter connection state management and key derivation.
13. Indexer public data service response parsing.
14. Privacy invariants ensuring raw student marks and income are never disclosed in public ledger state.
15. Circuit safety assertions rejecting ZK proof generation for unverified student credentials.
16. **[L5 Search]** Scholarship search & title/description filtering, case-insensitivity, no-results state, empty query handling, and query reset.
17. **[L5 Details]** Scholarship detail metadata integrity, criteria parameters, document tags, publisher information, creation date, and application linking.
18. **[L5 Guidance]** 4-step workflow card definitions (Connect Wallet, Search & Apply, Credential Review, ZK Verification) and contextual helper messages across UI views.
19. **[L5 Cross-Feature]** End-to-end multi-feature integration: keyword search → detailed modal → guided 4-step applicant flow → Zero-Knowledge circuit execution → query reset.

### 2. Live Midnight Preview Integration Test (Read-Only)
Run safe, read-only live Midnight Preview RPC & Indexer connectivity tests:

```bash
npm run test:integration
```

---

## 📜 Compact Smart Contract Circuits

The contract `contracts/scholarship-eligibility.compact` implements the following circuits:

1. `verifyEligibility(): Boolean`:
   - Gated by Student role witness check.
   - Verifies credential status witness (`isCredentialVerified == true`).
   - Reads private witnesses `studentMarks()` and `studentIncome()`.
   - Computes private zero-knowledge proof assertion against public ledger criteria `minimumMarks` and `maximumFamilyIncome`.
   - Increments public `verificationsCount` counter and discloses only boolean result.

2. `updateCredentialStatus(newStatus: String<32>): []`:
   - Enforces creator ownership check matching `callerAddress()` with `creatorAddress`.
   - Updates public `credentialVerificationStatus`.

3. `updateScholarshipCriteria(newName: String<64>, newMinMarks: Uint, newMaxIncome: Uint): []`:
   - Enforces creator ownership check matching `callerAddress()` with `creatorAddress`.
   - Updates public ledger criteria.

---

## ⚙️ CI/CD Pipeline

The GitHub Actions workflow [.github/workflows/ci.yml](file:///.github/workflows/ci.yml) builds smart contract bindings, executes the unit test suite, builds the frontend bundle, and manages Preview deployment using GitHub Secrets:
- `MIDNIGHT_WALLET_SEED`
- `MIDNIGHT_NETWORK`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## 📄 License

This project is licensed under the MIT License.

