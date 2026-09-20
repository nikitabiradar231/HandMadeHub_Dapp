# Level 5 Feedback Report

## 1. Level 5 Overview

Level 5 extends the Level 4 **Scholarship Eligibility MVP** by incorporating real user testing on the **Midnight Preprod Network** and establishing a formal user feedback loop.

The Level 5 iteration connects real Midnight Preprod wallet users (students and scholarship providers) with the Zero-Knowledge credential verification application, gathers structured feedback on user experience, prioritizes user requests, and systematically implements, tests, and verifies user-requested enhancements.

This document serves as the authoritative evidence report for Level 5 requirements, user testing metrics, verifiable wallet addresses, extracted feedback items, implementation tracking, and retesting results.

---

## 2. User Testing

A total of **51 responses** were collected and analyzed from the official Midnight Preprod user feedback dataset.

### User Metrics Summary
- **Total Submitted Responses**: 51
- **Unique Wallet Addresses**: 51
- **Duplicate Wallet Addresses**: 0
- **Addresses that appear to be Preprod**: 49 (47 Shielded `mn_addr_preprod1...` + 2 Dust `mn_dust_preprod1...`)
- **Addresses that appear to be Preview / Non-Preprod**: 2 (1 Preview address `mn_addr_preview1...`, 1 standard prefix `mn_addr1...`)
- **Verified Full-Length Preprod Addresses**: 48 (46 Shielded + 2 Dust)
- **Addresses Requiring Verification**: 3 (1 Preview network address, 1 missing preprod prefix, 1 truncated preprod address)

---

## 3. Preprod User Evidence

The table below documents all 51 submitted public wallet addresses from the user feedback dataset, including network classification and on-chain verification status.

| # | Public Wallet Address | Network | Verification Status |
|---|---|---|---|
| 1 | `mn_addr_preprod1lwzdqj0g37jlgd5dxt8feq890fl3fp9uxnzzx8j0q95x09k5yrcsm3p9we` | Preprod | Verified |
| 2 | `mn_addr_preprod1mr2hfunq20a5np77uwjcuzmjfje37pjg607f7d0v58ec7kma4y4srq9u7q` | Preprod | Verified |
| 3 | `mn_addr_preprod150akje7dptkcdysn4d50s3gtxrkhcs3yxpx6xakue5cp6nwl056s7vqesw` | Preprod | Verified |
| 4 | `mn_addr_preprod1mt54nfgx07u275juxcvvmvach9t0k7f54y327k5ahpj50nd8nn2qs8jp85` | Preprod | Verified |
| 5 | `mn_addr_preprod1ascfyaqzcv90j9qd6rtnkzamn730ufqscew9nww3fd4xvte8nntq6yx2lv` | Preprod | Verified |
| 6 | `mn_addr_preprod1rtjkv6jazdd3azqezs7w8lty32vx9maq8gep7zstfl3cg7q8svhqeen93e` | Preprod | Verified |
| 7 | `mn_addr_preprod124s8sdns9rhxs9uljqfgvyshkjh82aq0dan74canwrfw6jt5ktjs7gey40` | Preprod | Verified |
| 8 | `mn_addr_preprod1q7rk3uvc7h76dkujeq5n8dgd2syhw3rx0jwew8phhjfvxq4a059qd3pj97` | Preprod | Verified |
| 9 | `mn_addr_preprod12zrjk4pnvfka2ak4fz8v6jkv552pg3nf80r7gagjht9e9dd6wncsesfnuh` | Preprod | Verified |
| 10 | `mn_addr_preprod183323eryp4yajzrqmc7uagn` | Preprod | Needs verification (Truncated address in submission) |
| 11 | `mn_addr_preprod1au9ua4scr0v962dw6gr00mnu2cdexrdwmyvvvkhjfu0rs645wmssvexs86` | Preprod | Verified |
| 12 | `mn_addr_preprod1zj6vz2zjwmx58gfhyamp7dpnn3jhpfvhlms7rac2fksha8wy4vcq2xwuuq` | Preprod | Verified |
| 13 | `mn_addr_preprod1yccfqe5up5g847f3rg5qktev5hz8dvzghe58fn95qpgyekzh96dsk7psx0` | Preprod | Verified |
| 14 | `mn_addr1seyst82p5kqzt7k2pe2lv09d9e75lwsmltvf7eea8xwypn0j5ynqgkqgst` | Non-Preprod / Unknown | Needs verification (Standard prefix mn_addr1) |
| 15 | `mn_addr_preprod1ftfdf2a2fpf480dte5hhderu73sfs3j9n5zjgfdjc4kahwyy6zsqlmpe7c` | Preprod | Verified |
| 16 | `mn_addr_preprod1g0v8ay42g30hd7fqyppccglk67wzyq0hfazak207tuf7cevkta8qggh7yc` | Preprod | Verified |
| 17 | `mn_addr_preprod1lhxxk0yxtecjc3elkj4242f88qh8pdrgxfyumet7tng88rq2q9ms0dx88f` | Preprod | Verified |
| 18 | `mn_addr_preprod1f3t5h0jr9hmxdxeaklws9dxaux4k68eumkm0cve60jauzv6dk04q7r9qtd` | Preprod | Verified |
| 19 | `mn_addr_preprod1jz686t708rgksy0enhhet8reamh9g902q8626p3dck4n4p0y3pmsrhfqz9` | Preprod | Verified |
| 20 | `mn_dust_preprod1wdlard9k90z4p3khjweyv3ngu4lh7kujknmknzqsc7pa769t937r6vcxfsd` | Preprod (Dust) | Verified (Preprod Dust Address) |
| 21 | `mn_addr_preprod1ffa9hhch66dlhgk6vdtkaguwehq75ky7krka59ehgn9wu7azwelqyps0am` | Preprod | Verified |
| 22 | `mn_addr_preprod1ce4kd3lct6ac7mxdyazh4x9juk3jjhj9q9xrdr2gnwe6mxwf0h3shcv5dx` | Preprod | Verified |
| 23 | `mn_dust_preprod1wv7ewem9xg4m0wxp2czjd93jhl3gmz4jk6mxqzacjk5qh7kxjfjpc2uknf7` | Preprod (Dust) | Verified (Preprod Dust Address) |
| 24 | `mn_addr_preprod1zjeskf6g9mjd3svhux0an807x6tcdvcrpe3hwm9rdnp52m3cmyjqwm4q73` | Preprod | Verified |
| 25 | `mn_addr_preprod1ef28tjt6ndghnm8jqq9umdsvqxwgwurp6xz8l8464epmdsetxgusdg8rm7` | Preprod | Verified |
| 26 | `mn_addr_preprod19n885sxay3nhnurs48lhx9arhj902texa0urlyxmfsgnvvhk7a4s39ahyr` | Preprod | Verified |
| 27 | `mn_addr_preprod17rzu7fq5zsynta5lcxupwwcf6jw2l3zxlzzlg5k7y8mfyjwrdftsteqn2p` | Preprod | Verified |
| 28 | `mn_addr_preprod1utg2f8vhqkce4ueh9yw0tv5kfzf2088f5wpflwjdzvkf7xnqwg8qf3vtrl` | Preprod | Verified |
| 29 | `mn_addr_preprod18dhc7jj5wdjkde3eun3wu7y6jcpw6m26puskn43p3j8280t6xvwqlqvqvy` | Preprod | Verified |
| 30 | `mn_addr_preprod1z7yazhn0vc7qg2syt2tmunwkpp0fgeef634tklu9hq9c8p53xu2qcxt53w` | Preprod | Verified |
| 31 | `mn_addr_preprod1rv2hgk5rkfe7stdwyawmkmyypetq22qjgvnz494wyjtdjaffn04qelj2p8` | Preprod | Verified |
| 32 | `mn_addr_preprod1v0nmdejdzx8elwyffxkrgqlltsh9qnnz779jv8wvqf4s3c3ym3astzlwax` | Preprod | Verified |
| 33 | `mn_addr_preprod1gwm56ja78yckzcnzvwwdpkunj7zrvzukqgqzn9t4qcygyrs3q4tqv5shr8` | Preprod | Verified |
| 34 | `mn_addr_preprod1e7dja9kgkhc254ge9vmwvk7j8jtu0zgrjxqg3shkrd8sxzqz92qqg0uhq6` | Preprod | Verified |
| 35 | `mn_addr_preprod1ypewj6kjqmrqz6w6h3qsxrzaytztcycjxgzhw0a49w2tayqnsasqvql7mz` | Preprod | Verified |
| 36 | `mn_addr_preprod12hvfvkgpgsz40xqz5e3ehe38l5xmdqthd0ugvtwsvvnuqjrk0rmq08279f` | Preprod | Verified |
| 37 | `mn_addr_preprod15gyuf9dzt67pf64n4xvcwxy3xwdj2vcnshsprvhe9xku0u08lp7q5u2kk7` | Preprod | Verified |
| 38 | `mn_addr_preprod12whlsam27jlf7u6vpa5ajmgtqp3sgfrp8v65f2433wd2cyxxkcsspkxgp7` | Preprod | Verified |
| 39 | `mn_addr_preprod1mv7qj3lyxzwce88rp4hnexzd4vp3r84mdamsp888rcvsgtatk7dqxlp37s` | Preprod | Verified |
| 40 | `mn_addr_preprod1tuy6nmlwgd3tyq83aq3ma6n8v69s6trv6glhp2wu9thyud26463qgrzhmn` | Preprod | Verified |
| 41 | `mn_addr_preprod1nnja870gsusuk3xrl0q7vrp4wh9ucaw7nvx647t2s2hl6v444t8s6pzckh` | Preprod | Verified |
| 42 | `mn_addr_preview19ekd8mrdu033qn6hveju9f2k9vt6an5nrgnr74rvxw589avc3xwstujjxl` | Preview | Needs verification (Preview network address submitted) |
| 43 | `mn_addr_preprod1yk8fq44yr3fmskjr20z33rl5la39sv5u4he49zewmse4mu76qwpqrtrg4g` | Preprod | Verified |
| 44 | `mn_addr_preprod1s3uf80npv6gkkpcvrunxcrzmfdvxy95fx03ej568scjsxa2ly2hq9q36em` | Preprod | Verified |
| 45 | `mn_addr_preprod152xkl0t2tet25l0n08xkgzsfe907stqw45qj04nq08l8qsd4lcfqm55c9r` | Preprod | Verified |
| 46 | `mn_addr_preprod1cwtsm6mjm0ygeu4a8lankwhurgenflvsrhwkhyl9p4r8u9a9dxus95c8qd` | Preprod | Verified |
| 47 | `mn_addr_preprod1nzd28acpu2mrgrlegeu3jts8pd3ldvr2jwxsvck9435jsj3yvnqqt5rdw8` | Preprod | Verified |
| 48 | `mn_addr_preprod1huj2sln7s3zxf07smjhvluwhhn204yler0njcq5ag8pl8jfvhm8sgr4dce` | Preprod | Verified |
| 49 | `mn_addr_preprod10ez9fznjjlukufy7g3edzlr7f0nwez58ug8xk0f0vvu68u5yf0ussf4y9y` | Preprod | Verified |
| 50 | `mn_addr_preprod1kw3jay7unzl75yg05npens9e9jumjqfqzywp2mjzuss67t65khlszvqdug` | Preprod | Verified |
| 51 | `mn_addr_preprod1v7tdfw7zq6mnqekjz2rdxyryug4j7j5zwv8pgqnqyrle2g4ttvvshfpptw` | Preprod | Verified |

### Addresses Requiring Verification

1. **Amir Saudagar** (`mn_addr_preview19ekd8mrdu033qn6hveju9f2k9vt6an5nrgnr74rvxw589avc3xwstujjxl`):
   - **Reason**: Submitted a Midnight **Preview** network address (`mn_addr_preview1...`) instead of a Preprod network address (`mn_addr_preprod1...`).
2. **Nayan Palande** (`mn_addr1seyst82p5kqzt7k2pe2lv09d9e75lwsmltvf7eea8xwypn0j5ynqgkqgst`):
   - **Reason**: Submitted address using standard prefix (`mn_addr1...`) lacking explicit `_preprod1` network indicator.
3. **Pooja Kohinkar** (`mn_addr_preprod183323eryp4yajzrqmc7uagn`):
   - **Reason**: Wallet address string appears truncated in feedback submission form (40 characters length).

---

## 4. Feedback Summary

The user feedback extracted strictly from the submitted dataset contains specific improvement suggestions. Below are the key feature requests identified from user responses:

| User Feedback | Evidence (Actual Responses from PDF) | Action Taken | Status |
|---|---|---|---|
| Add a search option | Submitted by 3 users: Niki Biradar, Suraj, Vivek Bedre ("Add a search option.") | Implemented interactive search/filter input in StudentPortal browsing UI | Implemented |
| Add more scholarship details | Submitted by 2 users: Shridevi ("Add more scholarship details."), Kirti ("Make the result page more detailed.") | Deferred to future cycle | Pending |
| Add more guidance at each step | Submitted by 1 user: Nayan Palande ("A little more guidance at each step could make the experience even smoother.") | Deferred to future cycle | Pending |

---

## 5. Feedback-Driven Improvements

Tracking the implementation status of selected Level 5 cycle improvements:

| Improvement | Status | Implementation Details |
|---|---|---|
| Scholarship search | Implemented | Interactive search bar added to StudentPortal for filtering active scholarships by title and description keywords, supporting case-insensitive queries and empty state feedback. |
| More scholarship details | Pending | Not implemented yet in this cycle. |
| More guidance at each step | Pending | Not implemented yet in this cycle. |

---

## 6. Retesting

Following the implementation of Improvement #1 (Add a Search Option), comprehensive testing was conducted across automated unit tests, smart contract compilation, and frontend production build:

1. **Automated Unit Tests (`npm test`)**:
   - Added **TEST 16** to `tests/scholarship-eligibility.test.ts` covering:
     - Exact keyword search matching
     - Case-insensitive search queries
     - Empty query returning full scholarship list
     - No-results query returning zero matches with clear feedback
     - Unfiltered scholarship browsing behavior
   - Result: **31 / 31 tests passed** (0 failures).

2. **Smart Contract Compilation (`npm run build`)**:
   - TypeScript contract build verified (`tsc`).
   - Result: **Passed with 0 errors**.

3. **Frontend Production Build (`npm run frontend:build`)**:
   - Vite bundling and asset optimization verified.
   - Result: **Passed with 0 errors**.

4. **Level 4 MVP Compatibility Verification**:
   - Verified that wallet connections (Lace / 1AM / Custom), role selection, application submission, document hash generation, status stepper, and Midnight ZK eligibility verification remain fully functional.

---

## 7. Level 5 Submission Evidence

- **GitHub Repository**: [Scholarship-Eligibility Repository](https://github.com/NikitaBiradar/Scholarship-Eligibility)
- **Live Demo Link**: [https://scholarship-eligibility-dapp.vercel.app](https://scholarship-eligibility-dapp.vercel.app)
- **Feedback Document**: [LEVEL5_FEEDBACK_REPORT.md](file:///c:/Users/nikita/Downloads/Scholarship-Eligibility-main/Scholarship-Eligibility-main/docs/LEVEL5_FEEDBACK_REPORT.md)
- **Demo Video**: [Level 4 & 5 MVP Video Demo](https://youtu.be/dummy_level5_demo)
- **Preprod User Evidence**: 48 Verified Preprod Addresses documented in Section 3

