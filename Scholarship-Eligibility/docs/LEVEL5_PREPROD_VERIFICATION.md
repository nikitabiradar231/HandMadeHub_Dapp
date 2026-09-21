# Level 5 — Preprod Wallet Verification

## 1. Purpose

This document records the independent verification process and results for the public wallet addresses collected during Level 5 user feedback testing for the Private Scholarship Eligibility Verification DApp.

The objective is to establish verifiable evidence toward the Level 5 requirement of **50 Preprod users with verifiable wallet addresses**.

---

## 2. Verification Method

### Network & Infrastructure
- **Network**: Midnight Preprod Testnet (`preprod`)
### Network & Infrastructure
- **Target Network**: Midnight Preprod Testnet (`preprod`)
- **Node RPC Endpoint**: `https://rpc.preprod.midnight.network`
- **Indexer GraphQL Endpoint**: `https://indexer.preprod.midnight.network/api/v3/graphql`
- **Verification Command**: `npm run verify:preprod-users` (executes `scripts/verify-preprod-wallets.ts`)

### Verification Tooling & Explicit Status Codes
To prevent false assertions, the verification tool evaluates submitted addresses against five explicit status codes:

| Status Code | Status Label | Verification Criteria & Meaning |
|---|---|---|
| `FORMAT_VALIDATED` | Format Validated | Structurally valid Bech32 address with standard Preprod prefix (`mn_addr_preprod1...` or `mn_dust_preprod1...`) and length (~77 chars). |
| `NON_PREPROD` | Invalid (Network Mismatch) | Address uses non-Preprod prefix (`mn_addr1...` Mainnet format or `mn_addr_preview1...` Preview format). |
| `INCOMPLETE` | Invalid (Truncated String) | String length is incomplete (< 50 chars), indicating truncated form entry. |
| `PENDING_ONCHAIN_PROOF` | Pending On-Chain Proof | Valid Preprod address format, but no optional transaction hash or indexer proof receipt attached. |
| `VERIFIED_ONCHAIN` | Verified On-Chain | Independent query on Midnight Preprod GraphQL Indexer returns verified transaction receipt or block output matching participant's transaction hash. |

> **Crucial Rule**: `FORMAT_VALIDATED` proves address syntax only. Only entries with confirmed indexer proofs receive `VERIFIED_ONCHAIN`.

---

## 3. Verification Results

| # | User/Identifier | Wallet Address | Format | Preprod Evidence | On-chain Evidence | Contract Evidence | Status |
|---|---|---|---|---|---|---|---|
| 1 | Niki Biradar | `mn_addr_preprod1...3p9we` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 2 | Shridevi | `mn_addr_preprod1...4y4srq9u7q` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 3 | Mugda | `mn_addr_preprod1...vqesw` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 4 | Suraj | `mn_addr_preprod1...2qs8jp85` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 5 | Kirti | `mn_addr_preprod1...tq6yx2lv` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 6 | Preeti | `mn_addr_preprod1...qeen93e` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 7 | sudhakar sutar | `mn_addr_preprod1...js7gey40` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 8 | Vaishnavi Raut | `mn_addr_preprod1...59qd3pj97` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 9 | Samruddhi Nevse | `mn_addr_preprod1...sesfnuh` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 10 | Pooja Kohinkar | `mn_addr_preprod183323eryp4yajzrqmc7uagn` | Truncated/Incomplete | Failed (Incomplete string) | No observable on-chain record | None | Invalid (Truncated) |
| 11 | Srushti Chakradhar Benjarge | `mn_addr_preprod1...mssvexs86` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 12 | Ankita | `mn_addr_preprod1...2xwuuq` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 13 | Pratiksha Kalbhor | `mn_addr_preprod1...dsk7psx0` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 14 | Nayan Palande | `mn_addr_preprod1...e2j6m4` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 15 | Simran Rupesh Sawant | `mn_addr_preprod1...sqlmpe7c` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 16 | Sanskruti Chavan | `mn_addr_preprod1...qggh7yc` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 17 | Renuka | `mn_addr_preprod1...s0dx88f` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 18 | Baswaraj Biradar | `mn_addr_preprod1...4q7r9qtd` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 19 | Shivling umate | `mn_addr_preprod1...pmsrhfqz9` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 20 | Vivek Bedre | `mn_dust_preprod1...7r6vcxfsd` | DUST Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 21 | Varsha | `mn_addr_preprod1...qyps0am` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 22 | Baswaraj Patil | `mn_addr_preprod1...shcv5dx` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 23 | Sanskruti Borade | `mn_dust_preprod1...2uknf7` | DUST Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 24 | Tejaswini | `mn_addr_preprod1...jqwm4q73` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 25 | Tirupati | `mn_addr_preprod1...usdg8rm7` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 26 | Snehal | `mn_addr_preprod1...s39ahyr` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 27 | Shreeniwas | `mn_addr_preprod1...steqn2p` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 28 | Ajay | `mn_addr_preprod1...f3vtrl` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 29 | Aditya | `mn_addr_preprod1...qlqvqvy` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 30 | Sanskruti | `mn_addr_preprod1...cxt53w` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 31 | Riddhi | `mn_addr_preprod1...04qelj2p8` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 32 | Jivika | `mn_addr_preprod1...tzlwax` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 33 | Renuka | `mn_addr_preprod1...qv5shr8` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 34 | Shradha | `mn_addr_preprod1...qqg0uhq6` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 35 | Purva | `mn_addr_preprod1...svql7mz` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 36 | Shravani | `mn_addr_preprod1...rmq08279f` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 37 | Arpita balaji shinde | `mn_addr_preprod1...7q5u2kk7` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 38 | Snehal Gaikwad | `mn_addr_preprod1...sspkxgp7` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 39 | Kshitija | `mn_addr_preprod1...dqxlp37s` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 40 | Vaishnavi vasant lambhate | `mn_addr_preprod1...63qgrzhmn` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 41 | Vishvajit Bhagave | `mn_addr_preprod1...8s6pzckh` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 42 | Amir Saudagar | `mn_addr_preprod1...svccy6` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 43 | Samiksha | `mn_addr_preprod1...rtrg4g` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 44 | Payal Babar | `mn_addr_preprod1...q9q36em` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 45 | Paras Babar | `mn_addr_preprod1...fqm55c9r` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 46 | Karn babar | `mn_addr_preprod1...s95c8qd` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 47 | Harshal Tatyasaheb Jagdale | `mn_addr_preprod1...qt5rdw8` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 48 | Abhira | `mn_addr_preprod1...8sgr4dce` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 49 | Radha | `mn_addr_preprod1...ssf4y9y` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 50 | Swara | `mn_addr_preprod1...lszvqdug` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |
| 51 | Mukta | `mn_addr_preprod1...vshfpptw` | Shielded Preprod | Structurally Preprod | Unconfirmed (Shielded / No public UTXO) | Pending proof | Requires On-Chain Proof |

---

## 4. Verification Summary

- **Total Submitted Responses Analyzed**: 51
- **Complete Preprod-Format Wallet Addresses**: 50 (48 Shielded `mn_addr_preprod1...`, 2 DUST `mn_dust_preprod1...`)
- **Incomplete / Truncated Address String**: 1 (#10 Pooja Kohinkar - 40-character truncated string)
- **Pending On-Chain Proof**: 50 complete addresses
- **Independently Verified On-Chain**: 0 (Pending indexer tx hash verification)

**STATUS**: **50 complete Preprod-format wallet addresses submitted (0 / 50 independently verified on-chain).**

---

## 5. Evidence

At present, no transaction hashes or explorer receipts are attached to the Google Form response dataset provided in the PDF. Independent indexer queries on the public indexer currently return no unshielded output records for these shielded wallet addresses.

When transaction hashes or signed receipts are provided for these wallets, they will be verified against `https://indexer.preprod.midnight.network/api/v3/graphql` and listed here with verified transaction hash references.

---

## 6. Limitations

1. **Privacy Architecture of Midnight Network**:
   - Shielded wallet addresses (`mn_addr_preprod1...`) preserve Zero-Knowledge privacy. Public GraphQL indexers do not publicly index balances or transaction history by shielded address without the viewing key.
2. **Form Evidence Scope**:
   - The user feedback PDF documents form responses collected from users, but does not collect transaction hashes or proof receipts.
3. **Incomplete Data**:
   - Entry #10 submitted a truncated 40-character address string (`mn_addr_preprod183323eryp4yajzrqmc7uagn`). All other 50 submitted addresses are complete, valid Midnight Preprod wallet strings.

---

## 7. Evidence Collection Framework & Four-Tier Progression

To guide future participant onboarding and establish verifiable proof toward the 50-user requirement, the application adopts a standardized evidence template ([`docs/LEVEL5_PREPROD_USER_EVIDENCE_TEMPLATE.md`](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_PREPROD_USER_EVIDENCE_TEMPLATE.md)).

### Four-Tier Verification Pipeline

```text
[Tier A: Form Address Submission]
              │
              ▼
[Tier B: Bech32 Preprod Format Validation]
              │
              ▼
[Tier C: Documented App Feature Interaction]
              │
              ▼
[Tier D: Independent On-Chain Indexer Proof]
```

### Strict Key Distinctions
- **Tier A vs Tier B**: Address string submission (Tier A) becomes format-valid (Tier B) when it passes Bech32 prefix checks (`mn_addr_preprod1...` / `mn_dust_preprod1...`).
- **Tier B vs Tier C**: Format validity (Tier B) proves address syntax only. Tier C requires documented session interaction testing Level 5 MVP features (Search, Details, Guidance, ZK Circuit).
- **Tier C vs Tier D**: App interaction (Tier C) records client testing. Tier D requires an independent transaction hash receipt verified on the Midnight Preprod RPC / Indexer.

### Privacy Safeguards
- **Zero Secrets Rule**: Participant onboarding NEVER requests or exposes wallet seeds, 12/24-word recovery phrases, private keys, wallet passwords, or secret viewing keys. Public wallet addresses and voluntary transaction hashes are the only identifiers collected.
