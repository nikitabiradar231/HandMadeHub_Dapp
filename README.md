# HandMadeHub 🎨

> **A Privacy-Preserving Decentralized Handmade Marketplace & Authenticity NFT Protocol built on the Midnight Network.**

---

# 📌 Level 2 Overview

HandMadeHub is a privacy-first decentralized marketplace for handmade products built on the **Midnight Network**.

Level 2 extends the project with **Lace wallet integration**, frontend circuit execution, Zero-Knowledge privacy behavior, and deployment to the **Midnight Preview network**.

The platform allows independent makers and creators to:

- 🛍️ List handmade products
- 🎨 Create authenticity NFTs for their products
- 🔐 Protect sensitive maker secrets using Zero-Knowledge Proofs
- ✅ Verify the authenticity of handmade products
- 💰 Purchase products through privacy-preserving blockchain transactions
- 🌐 Interact with the Midnight Preview network
- 👛 Connect and disconnect using the Lace wallet
- ⚡ Execute Compact circuits directly from the frontend

HandMadeHub combines a decentralized marketplace with blockchain-based authenticity verification while keeping sensitive information private.

---

# 🎯 Level 2 Requirements

The Level 2 implementation satisfies the following requirements:

| Requirement | Status | Evidence |
|---|---|---|
| Lace wallet connect | ✅ | Lace wallet connection from frontend |
| Lace wallet disconnect | ✅ | Disconnect functionality implemented |
| Frontend circuit execution | ✅ | Compact circuit successfully called from frontend |
| Observable privacy behavior | ✅ | Authenticity verification without revealing private secret |
| Preview contract deployment | ✅ | Contract deployed to Midnight Preview |
| Verifiable Preview address | ✅ | 11f29a415f12812531d87e7c642215ae6d132e10810471d54a0b1025dbfa67bf|
| Public GitHub repository | ✅ | Repository available publicly |
| Live demo | ✅ | Vercel deployment https://frontend-6fjx1e5ag-nikitabiradar300-1089s-projects.vercel.app/  |
| Demo video | ✅ | Wallet connection + successful circuit call https://drive.google.com/file/d/1SkY23pjEQ13Xrle5Pn_PEVrrljtgp6uU/view?usp=drivesdk |
| Privacy claim documented | ✅ | Privacy model documented below |
| Minimum 8 meaningful commits | ✅ | Level 2 development history |

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

Level 2 uses the **Lace wallet** for blockchain interaction.

The frontend supports:

- Wallet connection
- Wallet disconnection
- Wallet authorization
- Transaction approval
- tNIGHT balance
- DUST balance
- Midnight Preview network interaction
- Zero-Knowledge transaction signing

The Level 2 demo specifically demonstrates connecting and disconnecting the Lace wallet from the frontend.

---

# 🔐 Privacy Model

Midnight provides a privacy architecture where public ledger information can be separated from private witness information used during Zero-Knowledge Proof generation.

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        USER / BROWSER                                │
│                                                                      │
│   ┌────────────────────────┐       ┌─────────────────────────────┐  │
│   │   PRIVATE WITNESS      │       │       LACE WALLET           │  │
│   │                        │       │                             │  │
│   │ • makerSecret          │       │ • Wallet Address            │  │
│   │ • candidateSecret      │       │ • DUST Balance              │  │
│   │ • buyerSecret          │       │ • Transaction Authorization │  │
│   └────────────┬───────────┘       └──────────────┬──────────────┘  │
│                │                                  │                 │
└────────────────┼──────────────────────────────────┼─────────────────┘
                 │                                  │
                 ▼                                  ▼
        ┌──────────────────┐              ┌──────────────────────┐
        │  ZERO-KNOWLEDGE  │              │  WALLET AUTHENTIC-   │
        │      PROOF       │              │      ATION            │
        │                  │              │                      │
        │ Private witness  │              │ Transaction signing  │
        └─────────┬────────┘              └──────────┬───────────┘
                  │                                  │
                  └────────────────┬─────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    MIDNIGHT PREVIEW NETWORK                         │
│                                                                      │
│  PUBLIC LEDGER STATE                                                 │
│                                                                      │
│  • productsMap                                                       │
│  • nftsMap                                                           │
│  • Product ID                                                         │
│  • Product title                                                      │
│  • Category                                                           │
│  • Price                                                              │
│  • Seller                                                             │
│  • NFT token ID                                                       │
│  • Authenticity commitment                                           │
│  • Product status                                                     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

# 🔍 Observable Privacy Behavior

The main privacy behavior demonstrated by HandMadeHub is **authenticity verification without revealing the private maker secret**.

The application uses the private secret as a witness for the Zero-Knowledge circuit.

The user can observe a successful verification result, while the actual private secret is not displayed or published as part of the verification result.

The privacy flow is:

```text
Private Maker Secret
        │
        ▼
Zero-Knowledge Circuit
        │
        ▼
Cryptographic Commitment
        │
        ▼
Verification Result
```

The important privacy claim is:

> **The application can prove knowledge of the correct authenticity secret without publicly revealing the secret itself.**

The private witness is therefore separated from the public verification result.

---

# 🧱 Smart Contract

The main Compact smart contract is:

```text
contracts/handmade-marketplace.compact
```

The contract provides the following circuits:

```text
listProduct(title, category, price)

mintAuthenticityNft(productId, certificateText)

verifyAuthenticity(tokenId, candidateSecret)

purchaseProduct(productId)

withdrawProduct(productId)
```

---

# ⚙️ Smart Contract Circuits

## 1. `listProduct`

Creates a marketplace product listing.

```text
listProduct(
    title,
    category,
    price
)
```

The product is recorded in the marketplace state.

---

## 2. `mintAuthenticityNft`

Creates an authenticity NFT for a listed product.

```text
mintAuthenticityNft(
    productId,
    certificateText
)
```

The NFT is associated with the product and contains an authenticity commitment.

---

## 3. `verifyAuthenticity`

Verifies that a candidate secret matches the authenticity commitment.

```text
verifyAuthenticity(
    tokenId,
    candidateSecret
)
```

The Zero-Knowledge circuit verifies the secret without exposing the private maker secret.

---

## 4. `purchaseProduct`

Allows a user to purchase a listed product.

```text
purchaseProduct(productId)
```

---

## 5. `withdrawProduct`

Allows the seller to withdraw an eligible product from the marketplace.

```text
withdrawProduct(productId)
```

---

# 🌐 Preview Deployment

The HandMadeHub Compact smart contract is deployed to the **Midnight Preview network**.

| Information | Value |
|---|---|
| **Network** | Midnight Preview |
| **Network ID** | `preview` |
| **Contract Address** | `11f29a415f12812531d87e7c642215ae6d132e10810471d54a0b1025dbfa67bf` ||

### Contract Address

```text
11f29a415f12812531d87e7c642215ae6d132e10810471d54a0b1025dbfa67bf
```
---

# 🌐 Live Demo

The Level 2 frontend is deployed using Vercel.

### Live Demo

```text
https://frontend-6fjx1e5ag-nikitabiradar300-1089s-projects.vercel.app/
``
---

# 🎥 Demo Video

The Level 2 demo video demonstrates:

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

```text
Demo Video :- https://drive.google.com/file/d/1SkY23pjEQ13Xrle5Pn_PEVrrljtgp6uU/view?usp=drivesdk
```
---

# 📋 Level 2 Submission Checklist

| Requirement | Status | Evidence |
|---|---|---|
| Lace wallet connect | ✅ | Frontend wallet connection |
| Lace wallet disconnect | ✅ | Frontend disconnect functionality |
| Circuit called successfully from frontend | ✅ | Successful circuit execution |
| Observable privacy behavior | ✅ | Private secret remains undisclosed |
| Contract deployed to Preview | ✅ | Preview deployment |
| Verifiable Preview contract address | ✅ | 11f29a415f12812531d87e7c642215ae6d132e10810471d54a0b1025dbfa67bf |
| Public GitHub repository | ✅ | Public repository |
| Live demo | ✅ | Vercel deployment https://frontend-6fjx1e5ag-nikitabiradar300-1089s-projects.vercel.app/|
| Demo video | ✅ | Wallet + successful circuit demonstration https://drive.google.com/file/d/1SkY23pjEQ13Xrle5Pn_PEVrrljtgp6uU/view?usp=drivesdk |
| README privacy claim | ✅ | Privacy Model section |
| Minimum 8 meaningful commits | ✅ | Level 2 Git history |

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

The compiled contract includes the marketplace and authenticity circuits.

### Generated Structure

```text
contracts/managed/handmade-marketplace/
├── contract/
│   ├── index.js
│   ├── index.d.ts
│   └── index.cjs
│
└── zkConfig/
    ├── listProduct.pk
    ├── listProduct.vk
    ├── mintAuthenticityNft.pk
    ├── mintAuthenticityNft.vk
    ├── verifyAuthenticity.pk
    ├── verifyAuthenticity.vk
    ├── purchaseProduct.pk
    ├── purchaseProduct.vk
    ├── withdrawProduct.pk
    └── withdrawProduct.vk
```

---

# 🧪 Testing

The project uses **Vitest** for smart contract testing.

Run:

```bash
npm run test
```

The test suite covers functionality such as:

- Product listing
- Authenticity NFT minting
- Authenticity commitment generation
- Authenticity verification
- Invalid-secret rejection

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

# 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │     HandMadeHub      │
                    │    React Frontend    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Lace Wallet      │
                    │   Connect / Sign     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Midnight.js      │
                    │        SDK           │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
          ┌───────────────────┐   ┌──────────────────┐
          │  Compact Contract │   │  Proof Server    │
          │                   │   │                  │
          │ Marketplace       │   │ ZK Proofs        │
          │ Authenticity NFT  │   │                  │
          │ Verification      │   │                  │
          └─────────┬─────────┘   └──────────────────┘
                    │
                    ▼
          ┌───────────────────────────┐
          │ Midnight Preview Network │
          │                           │
          │ Public Ledger State       │
          └───────────────────────────┘
```

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React |
| **Language** | TypeScript / JavaScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Smart Contract** | Compact |
| **Blockchain** | Midnight Network |
| **Network** | Midnight Preview Testnet |
| **Wallet** | Lace Wallet |
| **Blockchain SDK** | Midnight.js |
| **Proof Generation** | Midnight Proof Server |
| **Infrastructure** | Docker |
| **Testing** | Vitest |
| **Indexer** | Midnight GraphQL Indexer |

---

# 📂 Project Structure

```text
HandMade/
│
├── contracts/
│   ├── handmade-marketplace.compact
│   │
│   └── managed/
│       └── handmade-marketplace/
│           ├── contract/
│           └── zkConfig/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.tsx
│       └── ...
│
├── src/
│   ├── midnight/
│   ├── components/
│   └── ...
│
├── tests/
│   └── handmade-marketplace.test.ts
│
├── compose.yml
├── package.json
├── vite.config.ts
└── README.md
```

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
- Sufficient **tNIGHT and DUST** for transactions

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

This starts the required local infrastructure, including the Midnight proof server.

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

Open the local development URL shown by Vite.

---

# 🔄 Level 2 User Flow

```text
┌────────────────────┐
│    Open DApp       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   Connect Lace     │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Wallet Connected   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Perform DApp Action│
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Frontend Calls     │
│ Compact Circuit    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Lace Transaction   │
│ Approval           │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ ZK Proof Generated │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Circuit Successful │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Privacy Behavior   │
│ Observable         │
└────────────────────┘
```

---

# 🔐 Why Zero-Knowledge Proofs?

Traditional product-authenticity systems may require users to reveal sensitive information or rely completely on centralized databases.

HandMadeHub uses Zero-Knowledge Proofs to provide a different approach.

### The blockchain can verify:

- A product exists
- An authenticity NFT exists
- An authenticity commitment exists
- A verification transaction occurred
- Marketplace state

### The blockchain does not need to receive:

- The original maker secret
- The private authenticity witness
- Sensitive information used to generate the commitment

The authenticity verification is based on proving knowledge of the correct secret rather than publicly revealing the secret.

---

# 📊 Level 2 Deployment Status

| Component | Status |
|---|---|
| Compact Smart Contract | ✅ Deployed |
| Midnight Preview Testnet | ✅ |
| Preview Contract Address | ✅ |
| Authenticity NFT | ✅ |
| ZK Authenticity Verification | ✅ |
| Product Listing | ✅ |
| Product Purchase | ✅ |
| Product Withdrawal | ✅ |
| Lace Wallet Integration | ✅ |
| Lace Connect | ✅ |
| Lace Disconnect | ✅ |
| Frontend Circuit Call | ✅ |
| Observable Privacy Behavior | ✅ |
| React Frontend | ✅ |
| Vercel Deployment | ✅ |

---

# 📸 Level 2 Evidence

## 1. Lace Wallet Connection

The deployed HandMadeHub frontend connects to the Lace wallet.

The demo shows:

```text
Connect Wallet
      ↓
Lace Wallet
      ↓
Approve Connection
      ↓
Wallet Connected
```

---

## 2. Lace Wallet Disconnect

The frontend provides a disconnect action that removes the active wallet connection.

---

## 3. Successful Circuit Call

The Level 2 demo demonstrates a Compact circuit being called from the frontend and successfully completing through Lace wallet authorization.

```text
Frontend Action
      ↓
Compact Circuit
      ↓
Lace Approval
      ↓
ZK Proof Generation
      ↓
Successful Transaction
```

---

## 4. Privacy Behavior

The authenticity verification demonstrates the privacy model.

The verification result is observable, while the private maker secret used as the witness is not publicly revealed.

---

## 5. Preview Contract

```text
Network: Midnight Preview

Contract Address:
11f29a415f12812531d87e7c642215ae6d132e10810471d54a0b1025dbfa67bf
```

---

# 🌐 Live Demo

The Level 2 frontend is deployed using Vercel.

### Live Demo

[Open HandMadeHub Live Demo](https://frontend-6fjx1e5ag-nikitabiradar300-1089s-projects.vercel.app/)

---

# 🎥 Demo Video

The Level 2 demo video demonstrates:

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

 Demo Video :- https://drive.google.com/file/d/1SkY23pjEQ13Xrle5Pn_PEVrrljtgp6uU/view?usp=drivesdk
# 🌟 Project Highlights

### Privacy First

HandMadeHub uses Midnight's privacy architecture to keep sensitive witness values private.

### Blockchain Authenticity

Each authenticity NFT provides a cryptographic authenticity layer for handmade products.

### Decentralized Marketplace

The platform connects makers and buyers through blockchain-based marketplace functionality.

### Zero-Knowledge Verification

Users can verify authenticity without exposing the original secret.

### Lace Wallet Integration

Level 2 integrates Lace for wallet connection, disconnection, transaction authorization, and blockchain interaction.

### Preview Deployment

The Compact smart contract is deployed to the Midnight Preview network for verifiable blockchain interaction.

---

## ⭐ HandMadeHub

**A privacy-preserving decentralized marketplace for handmade products with blockchain-powered authenticity verification.**

Built with ❤️ using **React + TypeScript + Compact + Midnight Network + Zero-Knowledge Proofs + Lace Wallet**.
