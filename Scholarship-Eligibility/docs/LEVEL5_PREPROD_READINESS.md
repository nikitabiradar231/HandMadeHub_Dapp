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

### Explicit Network Classification
- **Level 4 Baseline MVP**: Deployed on **Midnight Preview Testnet** (`preview`). Contract: [`9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49`](https://explorer.preview.midnight.network/contract/9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49).
- **Level 5 Target MVP**: Configured for **Midnight Preprod Testnet** (`preprod`). A dedicated Preprod contract deployment is **REQUIRED** before on-chain user actions can be recorded on Preprod.

---

## 3. Level 5 Preprod Technical Requirements

To execute a live Preprod contract deployment and host 50 real Preprod users:

1. **Preprod Deployer Account & Wallet**:
   - Requires a funded Midnight Preprod wallet account with sufficient **tDUST** testnet tokens from the official Midnight Preprod faucet.
2. **Preprod Smart Contract Deployment**:
   - Execute deployment script against `https://rpc.preprod.midnight.network` using `@midnight-ntwrk/midnight-js-contracts`.
   - Populates `PREPROD_CONTRACT_ADDRESS` and `PREPROD_DEPLOY_TX_HASH` in `.env` and `frontend/.env`.
3. **Block Explorer Format**:
   - Preprod Block Explorer format: `https://explorer.preprod.midnight.network/contract/<PREPROD_CONTRACT_ADDRESS>`
4. **Service Endpoint Alignment**:
   - `MIDNIGHT_NETWORK_ID="preprod"`
   - `MIDNIGHT_NODE_RPC_URL="https://rpc.preprod.midnight.network"`
   - `MIDNIGHT_PROOF_SERVER_URL="https://proof-server.preprod.midnight.network"`
   - `MIDNIGHT_INDEXER_URL="https://indexer.preprod.midnight.network/api/v3/graphql"`

---

## 4. Official Deployment Status

```text
STATUS: PREPROD_DEPLOYMENT_REQUIRED
```

- **Application Code & Bindings**: **READY** (Compact ZK contract compiled, 34/34 passing regression tests, Vite frontend builds cleanly).
- **Network Configuration**: **CONFIGURED FOR PREPROD** (`src/network.ts` supports `PREPROD_MIDNIGHT_CONFIG`).
- **On-Chain Preprod Contract**: **NOT YET DEPLOYED** (Preprod contract deployment must be executed by project owner with a funded Preprod wallet seed).

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
