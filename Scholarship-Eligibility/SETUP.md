# Environment Setup & Local Execution Guide

This document provides step-by-step instructions for setting up, compiling, testing, and running the **Private Scholarship Eligibility & Credential Verification System** locally.

---

## 📋 Prerequisites

Before installing, ensure your development machine has the following tools installed:

1. **Node.js**: `v20.0.0` or higher (Recommended: `v22.x`)
2. **npm**: `v10.0.0` or higher
3. **Docker & Docker Compose**: (Optional, for running local Midnight Node, Indexer, and Proof Server containers)

Check your versions:
```bash
node -v
npm -v
```

---

## 🛠️ Step 1: Root Project Setup

1. **Navigate to the workspace directory**:
   ```bash
   cd private-scholarship-eligibility
   ```

2. **Install root dependencies**:
   ```bash
   npm install
   ```

---

## 🔨 Step 2: Compile Smart Contract Layer

The smart contract logic is defined in `contracts/scholarship-eligibility.compact`. The TypeScript runtime wrapper in `src/contract.ts` manages multi-scholarship registration, creator ownership checks, permanent role binding, credential status tracking, off-chain private witness evaluation, and ZK proof generation.

To compile the contract runtime:
```bash
npm run build:contract
```

---

## 🧪 Step 3: Run Automated Privacy & Contract Tests

Run the complete test suite (34 tests covering fresh state initialization, permanent role locking, scholarship ownership deletion, non-owner edit/delete rejection, credential status gating, ZK proof execution, L5 search, L5 scholarship details, L5 workflow guidance, and cross-feature integration):

```bash
npm test
```

Expected Output:
```text
 ✓ tests/scholarship-eligibility.test.ts (19 tests)
 Test Files  2 passed (2)
      Tests  34 passed (34)
```

---

## 📦 Step 4: Build Production Frontend Bundle

To verify that the frontend builds without TypeScript or bundler errors:

```bash
npm run frontend:build
```

The compiled production bundle will be generated in `frontend/dist/`.

---

## 🌐 Step 5: Start Frontend Development Server

1. **Launch Vite development server**:
   ```bash
   npm run frontend:dev
   ```

2. **Access the application**:
   Open your browser and navigate to: `http://localhost:3000`
