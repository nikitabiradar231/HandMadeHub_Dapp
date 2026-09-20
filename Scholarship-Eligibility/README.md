# 🔐 Private Scholarship Eligibility Verification — Genuine Full-Stack Midnight DApp

> **Privacy-Preserving Zero-Knowledge Smart Contract DApp built on the Midnight Network (Preview Testnet)**

[![CI/CD](https://github.com/nikitabiradar231/Scholarship-Eligibility/actions/workflows/ci.yml/badge.svg)](https://github.com/nikitabiradar231/Scholarship-Eligibility/actions/workflows/ci.yml)
[![Midnight Network](https://img.shields.io/badge/Midnight-Compact%20ZK-indigo?style=flat-square)](#technology-stack)
[![Preview Testnet](https://img.shields.io/badge/Midnight-Preview-purple?style=flat-square)](#network-information)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🔗 Quick Links & Product Links

- **GitHub Repository**: [https://github.com/nikitabiradar231/Scholarship-Eligibility](https://github.com/nikitabiradar231/Scholarship-Eligibility)
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
git clone https://github.com/nikitabiradar231/Scholarship-Eligibility.git
cd Scholarship-Eligibility

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

## 🧪 Testing

### 1. Offline Unit Tests (15/15 Passing)
Run core contract logic & circuit validation tests offline:

```bash
npm test
```

The test suite (15/15 passing) verifies:
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

