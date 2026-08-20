# HandMadeHub 🎨

> **A Privacy-Preserving Decentralized Handmade Marketplace & Authenticity NFT Protocol built on the Midnight Network.**

---

# 📌 Level 3 Overview

HandMadeHub is a privacy-first decentralized marketplace for handmade products built on the **Midnight Network**.

Level 3 extends the project with **automated CI/CD validation**, **frontend circuit execution**, **Zero-Knowledge privacy behavior**, **automated Vitest test suite**, and deployment to the **Midnight Preview network**.

The platform allows independent makers and creators to:

- 🛍️ List handmade products
- 🎨 Create authenticity NFTs for their products
- 🔐 Protect sensitive maker secrets using Zero-Knowledge Proofs
- ✅ Verify the authenticity of handmade products without revealing private secrets
- 💰 Purchase products through privacy-preserving blockchain transactions
- 🌐 Interact with the Midnight Preview network
- 👛 Connect and disconnect using the Lace wallet
- ⚡ Execute Compact circuits directly from the frontend
- 🧪 Validate the codebase with automated integration tests
- 🔄 Validate builds and integration flows through GitHub Actions CI/CD

HandMadeHub combines a decentralized marketplace with blockchain-based authenticity verification while keeping sensitive information private.

---

# 🎯 Level 3 Requirements

The Level 3 implementation satisfies the following requirements:

| Requirement | Status | Evidence |
|---|---|---|
| Fully functional privacy dApp | ✅ | HandMadeHub marketplace + Midnight Compact privacy functionality |
| Minimum 3 tests passing | ✅ | Vitest test suite (9 tests passing) |
| CI/CD workflow | ✅ | `.github/workflows/ci.yml` running on GitHub Actions |
| Approved project idea | ✅ | HandMadeHub privacy-preserving marketplace proposal |
| Minimum 10 meaningful commits | ✅ | Level 3 development history (10+ commits) |
| Public GitHub repository | ✅ | Public repository |
| Live demo | ✅ | Vercel deployment |
| Demo video | ✅ | Wallet connection + successful circuit call demonstration |
| Privacy model documented | ✅ | Detailed privacy model & observer access rules below |

---

# 💡 Project Idea

HandMadeHub aims to solve the problem of trust and authenticity in online handmade marketplaces.

Traditional marketplaces require users to trust centralized platforms and sellers when determining whether a handmade product is genuine.

HandMadeHub introduces a blockchain-based authenticity layer where makers can create authenticity NFTs associated with their products.

The platform uses **Midnight Compact smart contracts and Zero-Knowledge Proofs** so that authenticity can be verified without exposing the maker's private secret.

Product information and authenticity commitments can be stored as blockchain state while sensitive witness information remains private.

---

# 🛍️ Core Features

## 🛍️ Decentralized Handmade Marketplace

Creators can list handmade products with:

- Product title
- Category
- Price
- Seller information
- Product status
- Authenticity NFT information

Product listings are maintained through the Midnight smart contract.

---

## 🔐 Privacy-Preserving Authentication

HandMadeHub uses Zero-Knowledge Proofs to verify authenticity without revealing the private secret used to create the authenticity commitment.

The private secret is used as a witness during circuit execution and does not need to be publicly revealed.

---

## 🎨 Authenticity NFTs

Makers can mint an authenticity NFT associated with a handmade product.

The NFT contains an authenticity commitment that can later be verified without exposing the original secret.

---

## ✅ Authenticity Verification

A buyer or verifier can provide a candidate secret.

The Compact circuit checks whether:

```text
H(candidateSecret, productId) == stored commitment
```

The private maker secret itself is never revealed.

---

## 💰 Product Purchase

Users can purchase listed handmade products through the Midnight marketplace contract.

---

## 📦 Product Withdrawal

Sellers can withdraw eligible products through the smart contract.

---

# 👛 Lace Wallet Integration

Level 3 supports the **Lace wallet** for blockchain interaction.

The frontend supports:

- Wallet connection
- Wallet disconnection
- Wallet authorization
- Transaction approval
- tNIGHT balance
- DUST balance
- Midnight Preview network interaction
- Zero-Knowledge transaction signing

---

# 🔐 Privacy Model

Midnight provides a privacy architecture where public ledger information can be separated from private witness information used during Zero-Knowledge Proof generation.

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        USER / BROWSER                                │
│                                                                      │
│   ┌────────────────────────┐      ┌─────────────────────────────┐   │
│   │   PRIVATE WITNESS      │      │       LACE WALLET           │   │
│   │                        │      │                             │   │
│   │ • makerSecret          │      │ • Wallet Address            │   │
│   │ • candidateSecret      │      │ • DUST Balance              │   │
│   │ • buyerSecret          │      │ • Transaction Authorization │   │
│   └────────────┬───────────┘      └──────────────┬──────────────┘   │
│                │                                 │                  │
└────────────────┼─────────────────────────────────┼──────────────────┘
                 │                                 │
                 ▼                                 ▼
        ┌──────────────────┐              ┌──────────────────────┐
        │  ZERO-KNOWLEDGE  │              │  WALLET AUTHENTIC-   │
        │      PROOF       │              │       ATION          │
        │                  │              │                      │
        │ Private witness  │              │ Transaction signing  │
        └─────────┬────────┘              └──────────┬───────────┘
                  │                                  │
                  └────────────────┬─────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    MIDNIGHT PREVIEW NETWORK                          │
│                                                                      │
│  PUBLIC LEDGER STATE                                                 │
│                                                                      │
│  • productsMap                                                       │
│  • nftsMap                                                           │
│  • Product ID                                                        │
│  • Product title                                                     │
│  • Category                                                          │
│  • Price                                                             │
│  • Seller                                                            │
│  • NFT token ID                                                      │
│  • Authenticity commitment                                           │
│  • Product status                                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### What an Observer Can / Cannot Learn

#### What an observer CAN learn:
- A product exists on-chain with title, category, price, and seller account.
- An authenticity NFT commitment hash exists for a given product.
- Product status updates (Listed vs. Sold).
- That a verification or transaction execution occurred.

#### What an observer CANNOT learn:
- The private maker secret.
- The candidate secret passed by the verifier.
- Sensitive witness values used during ZK proof generation.

The important privacy claim is:

> **The application can prove knowledge of the correct authenticity secret without publicly revealing the secret itself.**

---

# 🧱 Smart Contract

The main Compact smart contract is located at:

```text
contracts/handmade-marketplace.compact
```

The contract provides the following circuits:

```text
listProduct(title, category, price)

mintAuthenticityNft(productId, certificateText)

verifyAuthenticity(tokenId, candidateSecret)

purchaseProduct(productId, price)

withdrawProduct(productId)
```

---

# 🧩 Smart Contract Compilation

Compile the Compact contract using:

```bash
npm run compile
```

The project generates managed contract artifacts under:

```text
contracts/managed/handmade-marketplace/
```

### Generated Structure

```text
contracts/managed/handmade-marketplace/
├── compiler/
│   └── contract-info.json
├── contract/
│   ├── index.js
│   ├── index.d.ts
│   └── index.cjs
└── keys/
    ├── listProduct.prover
    ├── listProduct.verifier
    ├── mintAuthenticityNft.prover
    ├── mintAuthenticityNft.verifier
    ├── verifyAuthenticity.prover
    ├── verifyAuthenticity.verifier
    ├── purchaseProduct.prover
    ├── purchaseProduct.verifier
    ├── withdrawProduct.prover
    └── withdrawProduct.verifier
```

---

# 🧪 Testing

The project uses **Vitest** for smart contract testing.

Run:

```bash
npm run test
```

### Test Execution Output

```text
✓ tests/handmade-marketplace.test.ts (9 tests) 211959ms
  ✓ HandMadeHub contract on devnet > lists a product with no NFT (circuit logic + ledger write) 26522ms
  ✓ HandMadeHub contract on devnet > rejects a non-positive price 807ms
  ✓ HandMadeHub contract on devnet > mints an authenticity NFT, storing only a one-way commitment 46401ms
  ✓ HandMadeHub contract on devnet > verifies authenticity with the correct secret 23116ms
  ✓ HandMadeHub contract on devnet > rejects verification with a wrong secret (nothing revealed) 707ms
  ✓ HandMadeHub contract on devnet > sells a non-NFT product without any secret 23785ms
  ✓ HandMadeHub contract on devnet > rejects buying an NFT-backed product without the secret 587ms
  ✓ HandMadeHub contract on devnet > sells an NFT-backed product with the correct secret 25103ms
  ✓ HandMadeHub contract on devnet > never leaks the authenticity secret into public state or public tx data 58488ms

Test Files  1 passed (1)
     Tests  9 passed (9)
  Start at  20:39:24
  Duration  219.02s (transform 243ms, setup 0ms, collect 6.56s, tests 211.96s, environment 0ms, prepare 156ms)
```

---

# 🔄 CI/CD Pipeline

The project includes an automated GitHub Actions CI pipeline configured in [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml).

### CI Validation Flow:
```text
Push / PR to level3
       │
       ▼
Checkout Repository
       │
       ▼
Setup Node.js 22 & Install Dependencies
       │
       ▼
Build TypeScript & Frontend
       │
       ▼
Start Local Midnight Devnet (Docker Compose)
       │
       ▼
Deploy Contract to Local Devnet (`npm run deploy -- --network undeployed`)
       │
       ▼
Run Integration Tests (`npm test -- --network undeployed`)
       │
       ▼
CI Pipeline Green ✅
```

---

# 🌐 Preview Deployment

The HandMadeHub Compact smart contract is deployed to the **Midnight Preview network**.

| Information | Value |
|---|---|
| **Network** | Midnight Preview |
| **Network ID** | `preview` |
| **Contract Address** | `11f29a415f12812531d87e7c642215ae6d132e10810471d54a0b1025dbfa67bf` |

---

# 🌐 Live Demo

The Level 3 frontend is deployed using Vercel.

### Live Demo

[Open HandMadeHub Live Demo](https://frontend-6fjx1e5ag-nikitabiradar300-1089s-projects.vercel.app/)

---

# 🎥 Demo Video

The Level 3 demo video demonstrates:

1. Opening the deployed HandMadeHub application
2. Connecting the Lace wallet
3. Showing the connected wallet state
4. Disconnecting the Lace wallet
5. Connecting the wallet again
6. Performing a frontend action that calls the Compact circuit
7. Approving the transaction in Lace
8. Showing the successful circuit result
9. Demonstrating the observable privacy behavior

### Demo Video

[Watch HandMadeHub Demo Video](https://drive.google.com/file/d/1SkY23pjEQ13Xrle5Pn_PEVrrljtgp6uU/view?usp=drivesdk)

---

# 📋 Level 3 Submission Checklist

| Requirement | Status | Evidence |
|---|---|---|
| Fully functional dApp | ✅ | Marketplace + Midnight Compact privacy circuits |
| Lace wallet connect/disconnect | ✅ | Lace wallet integration in frontend |
| Circuit called successfully from frontend | ✅ | Successful circuit execution |
| Observable privacy behavior | ✅ | Private secret remains undisclosed |
| Contract deployed to Preview | ✅ | Preview deployment (`11f29a415f12812531d87e7c642215ae6d132e10810471d54a0b1025dbfa67bf`) |
| Public GitHub repository | ✅ | Public repository |
| Live demo | ✅ | [Vercel Deployment](https://frontend-6fjx1e5ag-nikitabiradar300-1089s-projects.vercel.app/) |
| Demo video | ✅ | [Demo Video](https://drive.google.com/file/d/1SkY23pjEQ13Xrle5Pn_PEVrrljtgp6uU/view?usp=drivesdk) |
| Privacy model & Observer rules | ✅ | Documented in Privacy Model section |
| Minimum 3 tests passing | ✅ | Vitest test suite (9 tests passing) |
| CI/CD Pipeline | ✅ | GitHub Actions workflow `.github/workflows/ci.yml` |
| Minimum 10 meaningful commits | ✅ | Level 3 Git history |

---

# 🚀 Getting Started

## Prerequisites

Before running HandMadeHub, install:

- **Node.js >= 22.0.0**
- **npm >= 10.0.0**
- **Docker Desktop**
- **WSL2** on Windows
- **Compact Compiler**
- **Lace Wallet browser extension**
- **Midnight Preview network configured in Lace**

---

## 1. Clone the Repository

```bash
git clone https://github.com/nikitabiradar231/HandMadeHub_Dapp.git
cd HandMadeHub_Dapp
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Docker Infrastructure

```bash
docker compose up -d
```

---

## 4. Compile the Smart Contract

```bash
npm run compile
```

---

## 5. Run Tests

```bash
npm run test
```

---

## 6. Start the Frontend

```bash
npm run frontend:dev
```

---

# 🌟 Project Highlights

### Privacy First
HandMadeHub uses Midnight's privacy architecture to keep sensitive witness values private.

### Blockchain Authenticity
Each authenticity NFT provides a cryptographic authenticity layer for handmade products.

### Decentralized Marketplace
The platform connects makers and buyers through blockchain-based marketplace functionality.

### Zero-Knowledge Verification
Users can verify authenticity without exposing the original secret.

### Automated CI/CD
Level 3 incorporates full GitHub Actions CI pipeline validation for contract deployment and tests.

---

## ⭐ HandMadeHub

**A privacy-preserving decentralized marketplace for handmade products with blockchain-powered authenticity verification.**

Built with ❤️ using **React + TypeScript + Compact + Midnight Network + Zero-Knowledge Proofs + Lace Wallet**.
