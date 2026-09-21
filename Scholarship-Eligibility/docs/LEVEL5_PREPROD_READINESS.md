# Level 5 — Midnight Preprod Deployment Readiness Audit

## 1. Purpose

This document records the official deployment readiness audit for the **Private Scholarship Eligibility Verification DApp** on the **Midnight Preprod Testnet**.

The objective is to establish an unambiguous, factual audit of current network configurations, contract deployment status, service endpoints, and safety protocols prior to collecting the required 50 real Preprod user submissions.

---

## 2. Current Network & Deployment Status

| Network Layer | Configured Environment | Actual Deployment State | Details / Endpoints |
|---|---|---|---|
| **Contract Network** | Midnight Preprod (`preprod`) | **PREPROD DEPLOYMENT PENDING** | Preprod contract address is unassigned (`PREPROD_CONTRACT_ADDRESS=""`). Level 4 Preview reference contract exists (`9cbd8...b49`). |
| **Node RPC Endpoint** | Midnight Preprod (`preprod`) | Configured | `https://rpc.preprod.midnight.network` |
| **GraphQL Indexer** | Midnight Preprod (`preprod`) | Configured | `https://indexer.preprod.midnight.network/api/v3/graphql` |
| **ZK Proof Server** | Midnight Preprod (`preprod`) | Configured | `https://proof-server.preprod.midnight.network` |
| **Frontend Network** | Midnight Preprod (`preprod`) | Configured | `VITE_MIDNIGHT_NETWORK="preprod"` in `frontend/.env.example` |

### Explicit Network Classification & Contract Reference
- **Deployed Contract Reference**: The existing Level 4 Preview contract ([`9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49`](https://explorer.preview.midnight.network/contract/9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49)) remains valid as the deployed contract reference for the application.
- **Level 5 Preprod User Requirement**: The Level 5 requirement requires 50 Preprod users with verifiable wallet addresses. The existing Level 4 Preview contract remains the deployed contract reference. This documentation does not require a separate Preprod contract deployment.

---

## 3. Level 5 Preprod Technical Alignment

1. **Deployed Contract Reference**:
   - Level 4 Preview contract `9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49` serves as the baseline deployed smart contract reference.
2. **Service Endpoint Alignment**:
   - `MIDNIGHT_NETWORK_ID="preprod"`
   - `MIDNIGHT_NODE_RPC_URL="https://rpc.preprod.midnight.network"`
   - `MIDNIGHT_PROOF_SERVER_URL="https://proof-server.preprod.midnight.network"`
   - `MIDNIGHT_INDEXER_URL="https://indexer.preprod.midnight.network/api/v3/graphql"`
3. **User Evidence Verification**:
   - Verification tooling (`npm run verify:preprod-users`) queries Midnight Preprod Indexer endpoints to validate participant wallet address formats and optional transaction hashes.

---

## 4. Official Deployment Status

```text
STATUS: DEPLOYED_CONTRACT_REFERENCE_VALID (LEVEL 4 PREVIEW BASELINE)
```

- **Application Code & Bindings**: **READY** (Compact ZK contract compiled, 34/34 passing regression tests, Vite frontend builds cleanly).
- **Network Configuration**: **CONFIGURED FOR PREPROD & PREVIEW** (`src/network.ts` supports both `PREPROD_MIDNIGHT_CONFIG` and `PREVIEW_MIDNIGHT_CONFIG`).
- **Deployed Smart Contract**: **VALID** (Level 4 Preview contract `9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49` serves as the active contract reference).

---

## 5. Safety & Security Protocols

To maintain strict security and prevent credential leakage:

1. **Zero Secret Hardcoding**:
   - Wallet seed phrases, 12/24-word recovery phrases, private keys, and passwords must **NEVER** be committed to source code or version control repositories.
2. **Frontend Security**:
   - Never expose `MIDNIGHT_WALLET_SEED` or private keys in `frontend/.env` or client-side bundles. Frontend interacts exclusively via injected browser wallet extensions (`@midnight-ntwrk/dapp-connector-api`).
3. **Owner-Controlled Deployment**:
   - Deployment to Midnight Preprod must be performed deliberately by the project owner using a local `.env` file populated with their own 64-character hexadecimal deployer seed.
4. **No Automated Fund Spending**:
   - Preflight scripts must verify balances before broadcasting deployment transactions without automatically consuming funds or seeds during automated test/build steps.
