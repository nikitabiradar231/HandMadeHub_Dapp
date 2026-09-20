# Level 5 — Preprod Wallet Verification

## 1. Purpose

This document records the independent verification process and results for the public wallet addresses collected during Level 5 user feedback testing for the Private Scholarship Eligibility Verification DApp.

The objective is to establish verifiable evidence toward the Level 5 requirement of **50 Preprod users with verifiable wallet addresses**.

---

## 2. Verification Method

### Network & Infrastructure
- **Network**: Midnight Preprod Testnet (`preprod`)
- **Node RPC Endpoint**: `https://rpc.preprod.midnight.network`
- **Indexer GraphQL Endpoint**: `https://indexer.preprod.midnight.network/api/v3/graphql`
- **Verification Utility**: `scripts/verify-preprod-wallets.ts`

### Verification Logic & Criteria
To prevent false assertions, the verification process strictly distinguishes structural address validity from on-chain proof:

1. **Format & Network Prefix Check**:
   - Valid Preprod Shielded Address: Begins with `mn_addr_preprod1` and has standard length (~77 chars).
   - Valid Preprod DUST Address: Begins with `mn_dust_preprod1` and has standard length (~77 chars).
   - Non-Preprod / Mismatch: Begins with `mn_addr_preview1` (Preview) or `mn_addr1` (Mainnet / unspecified).
   - Truncated / Incomplete: Length < 50 characters.

2. **On-Chain Evidence Criteria**:
   - **Counts as Verified**: A wallet address that has observable, verified transaction hashes, unshielded outputs, or contract call receipts returned by the Midnight Preprod Indexer / RPC node.
   - **Does NOT Count as Verified**: User form submissions, `mn_addr_preprod1` string prefix alone, Bech32 syntax validity alone, or unverified claims.

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
| 14 | Nayan Palande | `mn_addr1seyst82p...gkqgst` | Mainnet / Unspecified | Failed (Mainnet format) | No observable on-chain record | None | Invalid (Network mismatch) |
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
| 42 | Amir Saudagar | `mn_addr_preview1...tujjxl` | Preview Network | Failed (Preview Network) | No observable on-chain record | None | Invalid (Network mismatch) |
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

- **Total Submitted Responses**: 51
- **Complete Preprod Candidates (Structural)**: 49 (47 Shielded `mn_addr_preprod1`, 2 DUST `mn_dust_preprod1`)
- **Successfully Verified On-Chain**: 0
- **On-Chain Activity Confirmed**: 0
- **Contract Interaction Confirmed**: 0
- **Not Verified (Requires On-Chain Proof)**: 49
- **Invalid / Incomplete**: 1 (#10 Pooja Kohinkar - truncated string)
- **Non-Preprod Networks**: 2 (#14 Nayan Palande - Mainnet format; #42 Amir Saudagar - Preview network)

**STATUS**: **50-user requirement is NOT yet verified.**

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
3. **Network Mismatch & Incomplete Data**:
   - Entry #14 submitted a Mainnet-style address (`mn_addr1...`).
   - Entry #42 submitted a Preview network address (`mn_addr_preview1...`).
   - Entry #10 submitted a truncated 40-character address string.
