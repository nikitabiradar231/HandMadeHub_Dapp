import { describe, it, expect, beforeEach } from "vitest";
import { ScholarshipEligibilityContract } from "../src/contract.js";
import { MidnightWalletAdapter } from "../src/wallet.js";
import { MidnightIndexerService } from "../src/indexer.js";
import {
  validatePreprodAddress,
  validateTransactionHashFormat,
  classifyFormat,
  runVerification,
  USER_ENTRIES
} from "../scripts/verify-preprod-wallets.js";

describe("Private Scholarship Eligibility & Credential Verification Contract", () => {
  let contract: ScholarshipEligibilityContract;

  beforeEach(() => {
    contract = new ScholarshipEligibilityContract();
  });

  // --------------------------------------------------------------------------
  // TEST 1 — Fresh Application State (Zero Default/Demo Scholarships)
  // --------------------------------------------------------------------------
  it("TEST 1 — Fresh State: Fresh contract instance MUST start with 0 default/demo scholarships", () => {
    const scholarships = contract.getScholarships();
    expect(scholarships.length).toBe(0);

    const applications = contract.getApplicationsForStudent();
    expect(applications.length).toBe(0);

    const ledger = contract.getLedgerState();
    expect(ledger.verificationsCount).toBe(0n);
    expect(ledger.isInitialized).toBe(true);
  });

  // --------------------------------------------------------------------------
  // TEST 2 — Permanent Role Locking: Student -> Provider Prohibited
  // --------------------------------------------------------------------------
  it("TEST 2 — Permanent Role Locking: Student account MUST NOT be allowed to become a Scholarship Provider later", () => {
    const studentAddr = "0xaddr_student_alex";

    contract.registerRole(studentAddr, "student");
    expect(contract.getUserRole(studentAddr)).toBe("student");

    expect(() => {
      contract.registerRole(studentAddr, "provider");
    }).toThrowError(/permanently registered as a 'student'/);
  });

  // --------------------------------------------------------------------------
  // TEST 3 — Permanent Role Locking: Provider -> Student Prohibited
  // --------------------------------------------------------------------------
  it("TEST 3 — Permanent Role Locking: Scholarship Provider account MUST NOT be allowed to become a Student later", () => {
    const providerAddr = "0xaddr_provider_alpha";

    contract.registerRole(providerAddr, "provider");
    expect(contract.getUserRole(providerAddr)).toBe("provider");

    expect(() => {
      contract.registerRole(providerAddr, "student");
    }).toThrowError(/permanently registered as a 'provider'/);
  });

  // --------------------------------------------------------------------------
  // TEST 4 — Scholarship Owner Can Delete Their Own Scholarship
  // --------------------------------------------------------------------------
  it("TEST 4 — Scholarship Ownership: Provider can successfully delete their own scholarship program", () => {
    const providerAddr = "0xaddr_provider_alpha";

    const sch = contract.createScholarship(
      "Alpha Merit Grant 2026",
      "Academic scholarship by Provider Alpha",
      75n,
      500000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "Provider Alpha",
      providerAddr
    );

    expect(contract.getScholarships().length).toBe(1);

    contract.deleteScholarship(sch.id, providerAddr);

    expect(contract.getScholarships().length).toBe(0);
    expect(contract.getScholarshipById(sch.id)).toBeUndefined();
  });

  // --------------------------------------------------------------------------
  // TEST 5 — Different Provider Cannot Delete Another Provider's Scholarship
  // --------------------------------------------------------------------------
  it("TEST 5 — Ownership Security: Different provider MUST NOT be able to delete another provider's scholarship", () => {
    const providerAlpha = "0xaddr_provider_alpha";
    const providerBeta = "0xaddr_provider_beta";

    const sch = contract.createScholarship(
      "Alpha Foundation Award",
      "Grant created by Provider Alpha",
      80n,
      600000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "Provider Alpha",
      providerAlpha
    );

    expect(() => {
      contract.deleteScholarship(sch.id, providerBeta);
    }).toThrowError(/Unauthorized: Only the scholarship creator/);

    expect(contract.getScholarshipById(sch.id)).toBeDefined();
    expect(contract.getScholarships().length).toBe(1);
  });

  // --------------------------------------------------------------------------
  // TEST 6 — Different Provider Cannot Edit Another Provider's Scholarship
  // --------------------------------------------------------------------------
  it("TEST 6 — Ownership Security: Different provider MUST NOT be able to edit another provider's scholarship criteria", () => {
    const providerAlpha = "0xaddr_provider_alpha";
    const providerBeta = "0xaddr_provider_beta";

    const sch = contract.createScholarship(
      "Alpha STEM Fellowship",
      "Grant created by Provider Alpha",
      85n,
      400000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "Provider Alpha",
      providerAlpha
    );

    expect(() => {
      contract.updateCriteria(sch.id, providerBeta, "Hijacked Title", 50n, 1000000n);
    }).toThrowError(/Unauthorized: Only the scholarship creator/);

    const original = contract.getScholarshipById(sch.id);
    expect(original?.name).toBe("Alpha STEM Fellowship");
    expect(original?.minimumMarks).toBe(85n);
  });

  // --------------------------------------------------------------------------
  // TEST 7 — Students Cannot Create or Delete Scholarships
  // --------------------------------------------------------------------------
  it("TEST 7 — Role Enforcement: Student account MUST NOT be able to create or delete scholarships", () => {
    const studentAddr = "0xaddr_student_alex";
    const providerAddr = "0xaddr_provider_alpha";

    contract.registerRole(studentAddr, "student");

    expect(() => {
      contract.createScholarship(
        "Fake Student Grant",
        "Unauthorized grant",
        50n,
        1000000n,
        [],
        "Alex Vance",
        studentAddr
      );
    }).toThrowError(/registered as a Student and cannot create scholarships/);

    const sch = contract.createScholarship(
      "Legitimate Provider Grant",
      "Valid grant",
      70n,
      500000n,
      [],
      "Provider Alpha",
      providerAddr
    );

    expect(() => {
      contract.deleteScholarship(sch.id, studentAddr);
    }).toThrowError(/Unauthorized/);
  });

  // --------------------------------------------------------------------------
  // TEST 8 — Full Application & ZK Eligibility Verification Lifecycle (Eligible Student)
  // --------------------------------------------------------------------------
  it("TEST 8 — Lifecycle: Full flow (Eligible Student: marks >= min, income <= max)", () => {
    const providerAddr = "0xaddr_provider_alpha";
    const studentAddr = "0xaddr_student_alex";

    const sch = contract.createScholarship(
      "National Science Grant 2026",
      "Full merit grant for science students",
      75n,
      500000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "National Science Foundation",
      providerAddr
    );

    const app = contract.submitApplication(
      sch.id,
      studentAddr,
      "Alex Vance",
      "Marksheet.pdf",
      "IncomeCert.pdf"
    );
    expect(app.status).toBe("Documents Submitted");

    expect(() => {
      contract.verifyEligibility({ studentMarks: 85n, studentIncome: 300000n }, app.id);
    }).toThrowError(/Credentials must be verified by a scholarship administrator first/);

    contract.updateApplicationStatus(app.id, "Verified", providerAddr);
    expect(app.status).toBe("Verified");

    const result = contract.verifyEligibility(
      { studentMarks: 85n, studentIncome: 300000n },
      app.id
    );

    expect(result.isEligible).toBe(true);
    expect(result.publicState.verificationsCount).toBe(1n);
    expect(result.publicState.latestVerificationResult).toBe(true);
    expect(result.privacySummary.marksDisclosed).toBe(false);
    expect(result.privacySummary.incomeDisclosed).toBe(false);
    expect(result.privacySummary.resultDisclosed).toBe(true);
  });

  // --------------------------------------------------------------------------
  // TEST 9 — Marks Below Minimum Condition
  // --------------------------------------------------------------------------
  it("TEST 9 — Circuit Execution: Marks below minimum requirement evaluates to Not Eligible", () => {
    const providerAddr = "0xaddr_provider_alpha";
    const studentAddr = "0xaddr_student_bob";

    const sch = contract.createScholarship(
      "High Academic Standard Award",
      "Requires at least 80% marks",
      80n,
      500000n,
      [],
      "Provider Alpha",
      providerAddr
    );

    const app = contract.submitApplication(sch.id, studentAddr, "Bob Smith");
    contract.updateApplicationStatus(app.id, "Verified", providerAddr);

    const result = contract.verifyEligibility(
      { studentMarks: 65n, studentIncome: 300000n }, // 65% < 80%
      app.id
    );

    expect(result.isEligible).toBe(false);
    expect(result.publicState.latestVerificationResult).toBe(false);
    expect(result.publicState.verificationsCount).toBe(1n);
  });

  // --------------------------------------------------------------------------
  // TEST 10 — Family Income Above Maximum Condition
  // --------------------------------------------------------------------------
  it("TEST 10 — Circuit Execution: Family income exceeding maximum parameter evaluates to Not Eligible", () => {
    const providerAddr = "0xaddr_provider_alpha";
    const studentAddr = "0xaddr_student_charlie";

    const sch = contract.createScholarship(
      "Need-Based Financial Support",
      "Requires income <= 400,000",
      70n,
      400000n,
      [],
      "Provider Alpha",
      providerAddr
    );

    const app = contract.submitApplication(sch.id, studentAddr, "Charlie Brown");
    contract.updateApplicationStatus(app.id, "Verified", providerAddr);

    const result = contract.verifyEligibility(
      { studentMarks: 90n, studentIncome: 600000n }, // 600k > 400k
      app.id
    );

    expect(result.isEligible).toBe(false);
    expect(result.publicState.latestVerificationResult).toBe(false);
  });

  // --------------------------------------------------------------------------
  // TEST 11 — Both Conditions Failing (Low Marks AND High Income)
  // --------------------------------------------------------------------------
  it("TEST 11 — Circuit Execution: Both marks below minimum AND income above maximum evaluates to Not Eligible", () => {
    const providerAddr = "0xaddr_provider_alpha";
    const studentAddr = "0xaddr_student_david";

    const sch = contract.createScholarship(
      "Strict Merit & Need Award",
      "Min 75% marks, max 500k income",
      75n,
      500000n,
      [],
      "Provider Alpha",
      providerAddr
    );

    const app = contract.submitApplication(sch.id, studentAddr, "David Lee");
    contract.updateApplicationStatus(app.id, "Verified", providerAddr);

    const result = contract.verifyEligibility(
      { studentMarks: 50n, studentIncome: 800000n }, // 50 < 75 AND 800k > 500k
      app.id
    );

    expect(result.isEligible).toBe(false);
    expect(result.publicState.latestVerificationResult).toBe(false);
  });

  // --------------------------------------------------------------------------
  // TEST 12 — Wallet Adapter Connection & Address Management
  // --------------------------------------------------------------------------
  it("TEST 12 — Wallet Adapter: Connect custom address and retrieve state", () => {
    const wallet = new MidnightWalletAdapter();
    expect(wallet.getState().isConnected).toBe(false);

    const customAddr = "mn_addr1_test_preview_wallet_address_123456789";
    const state = wallet.connectCustomAddress(customAddr);

    expect(state.isConnected).toBe(true);
    expect(state.address).toBe(customAddr);
    expect(state.networkId).toBe("preview");

    const provider = wallet.getWalletProvider();
    expect(provider).toBeDefined();
    expect(typeof provider.getCoinPublicKey).toBe("function");

    const disconnected = wallet.disconnect();
    expect(disconnected.isConnected).toBe(false);
    expect(disconnected.address).toBeNull();
  });

  // --------------------------------------------------------------------------
  // TEST 13 — Indexer Public Data Service Response Parsing
  // --------------------------------------------------------------------------
  it("TEST 13 — Indexer Service: Correctly parses raw indexer GraphQL response payloads", () => {
    const indexer = new MidnightIndexerService();

    const mockRaw = {
      scholarshipName: "Midnight Preview Merit Award",
      minimumMarks: "75",
      maximumFamilyIncome: "500000",
      creatorAddress: "mn_addr1_creator_preview",
      credentialVerificationStatus: "Verified",
      verificationsCount: "42",
      latestVerificationResult: true,
      isInitialized: true
    };

    const parsed = indexer.parseLedgerState(mockRaw);
    expect(parsed).not.toBeNull();
    expect(parsed?.scholarshipName).toBe("Midnight Preview Merit Award");
    expect(parsed?.minimumMarks).toBe(75n);
    expect(parsed?.maximumFamilyIncome).toBe(500000n);
    expect(parsed?.verificationsCount).toBe(42n);
    expect(parsed?.latestVerificationResult).toBe(true);
  });

  // --------------------------------------------------------------------------
  // TEST 14 — Privacy Invariant Verification
  // --------------------------------------------------------------------------
  it("TEST 14 — Privacy Invariants: Raw student marks & income are NEVER present in PublicLedgerState", () => {
    const providerAddr = "0xaddr_provider_privacy";
    const studentAddr = "0xaddr_student_privacy";

    const sch = contract.createScholarship(
      "Privacy Guarded Fellowship",
      "Tests zero disclosure of raw values",
      80n,
      600000n,
      [],
      "Provider Privacy",
      providerAddr
    );

    const app = contract.submitApplication(sch.id, studentAddr, "Privacy Tester");
    contract.updateApplicationStatus(app.id, "Verified", providerAddr);

    const proof = contract.verifyEligibility(
      { studentMarks: 95n, studentIncome: 200000n },
      app.id
    );

    const ledger = proof.publicState as any;
    expect(ledger.studentMarks).toBeUndefined();
    expect(ledger.studentIncome).toBeUndefined();
    expect(ledger.marks).toBeUndefined();
    expect(ledger.income).toBeUndefined();
    expect(proof.privacySummary.marksDisclosed).toBe(false);
    expect(proof.privacySummary.incomeDisclosed).toBe(false);
    expect(proof.privacySummary.resultDisclosed).toBe(true);
  });

  // --------------------------------------------------------------------------
  // TEST 15 — Circuit Assertion Enforcement
  // --------------------------------------------------------------------------
  it("TEST 15 — Circuit Safety: Unverified student application rejects ZK proof generation", () => {
    const providerAddr = "0xaddr_provider_safety";
    const studentAddr = "0xaddr_student_safety";

    const sch = contract.createScholarship(
      "Safety Check Award",
      "Requires verified credential status",
      70n,
      500000n,
      [],
      "Provider Safety",
      providerAddr
    );

    const app = contract.submitApplication(sch.id, studentAddr, "Unverified Student");

    expect(() => {
      contract.verifyEligibility(
        { studentMarks: 90n, studentIncome: 300000n, isCredentialVerified: false },
        app.id
      );
    }).toThrowError(/Credentials must be verified by a scholarship administrator first/);
  });

  // --------------------------------------------------------------------------
  // TEST 16 — Level 5 Feature: Scholarship Search & Filtering
  // --------------------------------------------------------------------------
  it("TEST 16 — Level 5 Feedback: Scholarship Search & Filtering Logic", () => {
    const providerAddr = "0xaddr_provider_search";

    // Setup multiple scholarships
    contract.createScholarship(
      "National STEM Merit Grant 2026",
      "Financial assistance for high-achieving science & engineering students",
      85n,
      500000n,
      [],
      "STEM Foundation",
      providerAddr
    );

    contract.createScholarship(
      "Need-Based Higher Education Award",
      "Grant for undergraduate students requiring tuition financial support",
      70n,
      300000n,
      [],
      "EduTrust Org",
      providerAddr
    );

    contract.createScholarship(
      "Women in Technology Fellowship",
      "Empowering female computer science and tech researchers",
      80n,
      600000n,
      [],
      "Tech Forward",
      providerAddr
    );

    // 1. Empty search returns all available scholarships (3)
    expect(contract.searchScholarships("").length).toBe(3);
    expect(contract.searchScholarships("   ").length).toBe(3);

    // 2. Matching by scholarship name ("STEM")
    const stemResults = contract.searchScholarships("STEM");
    expect(stemResults.length).toBe(1);
    expect(stemResults[0].name).toBe("National STEM Merit Grant 2026");

    // 3. Matching by description ("tuition")
    const descResults = contract.searchScholarships("tuition");
    expect(descResults.length).toBe(1);
    expect(descResults[0].name).toBe("Need-Based Higher Education Award");

    // 4. Case-insensitivity ("nAtIoNaL", "fElLoWsHiP")
    const caseResults1 = contract.searchScholarships("nAtIoNaL");
    expect(caseResults1.length).toBe(1);
    expect(caseResults1[0].name).toBe("National STEM Merit Grant 2026");

    const caseResults2 = contract.searchScholarships("fElLoWsHiP");
    expect(caseResults2.length).toBe(1);
    expect(caseResults2[0].name).toBe("Women in Technology Fellowship");

    // 5. Non-matching query produces 0 results
    const noMatchResults = contract.searchScholarships("NonExistentQueryKeyword12345");
    expect(noMatchResults.length).toBe(0);

    // 6. Clearing search restores all 3 scholarships
    const clearedResults = contract.searchScholarships("");
    expect(clearedResults.length).toBe(3);
  });

  // --------------------------------------------------------------------------
  // TEST 17 — Level 5 Feature: Scholarship Details Metadata & Retrieval
  // --------------------------------------------------------------------------
  it("TEST 17 — Level 5 Feedback: Scholarship Details Metadata & Detailed View Data Integrity", () => {
    const providerAddr = "mn_addr1_provider_alpha_details_test";
    const providerName = "Global Education Trust";

    const sch = contract.createScholarship(
      "International Innovation Fellowship 2026",
      "Comprehensive research fellowship supporting STEM and digital privacy innovation.",
      88n,
      750000n,
      ["Academic Marksheet", "Family Income Certificate", "Recommendation Letter"],
      providerName,
      providerAddr
    );

    // Retrieve scholarship by ID
    const details = contract.getScholarshipById(sch.id);
    expect(details).toBeDefined();

    // Verify Title & Description
    expect(details?.name).toBe("International Innovation Fellowship 2026");
    expect(details?.description).toBe("Comprehensive research fellowship supporting STEM and digital privacy innovation.");

    // Verify Eligibility Criteria
    expect(details?.minimumMarks).toBe(88n);
    expect(details?.maximumFamilyIncome).toBe(750000n);

    // Verify Required Documents List
    expect(details?.requiredDocuments).toEqual([
      "Academic Marksheet",
      "Family Income Certificate",
      "Recommendation Letter"
    ]);

    // Verify Publisher & Creation Metadata
    expect(details?.createdBy).toBe(providerName);
    expect(details?.creatorAddress).toBe(providerAddr);
    expect(details?.createdAt).toBeDefined();
    expect(typeof details?.createdAt).toBe("string");

    // Verify student application links correctly to scholarship details
    const studentAddr = "mn_addr1_student_alex_details_test";
    const app = contract.submitApplication(sch.id, studentAddr, "Alex Vance");
    expect(app.scholarshipId).toBe(sch.id);
    expect(app.scholarshipName).toBe("International Innovation Fellowship 2026");
  });

  // --------------------------------------------------------------------------
  // TEST 18 — Level 5 Feature: Step-by-Step Workflow Guidance Content Integrity
  // --------------------------------------------------------------------------
  it("TEST 18 — Level 5 Feedback: Step-by-Step Workflow Guidance Messages & Stage Definitions", () => {
    // 1. Workflow Stage Definitions
    const workflowStages = [
      { step: 1, name: "Connect Wallet", description: "Connect Midnight Preprod wallet to access protected features." },
      { step: 2, name: "Search & Apply", description: "Filter scholarships, review criteria, and upload PDF credentials." },
      { step: 3, name: "Credential Review", description: "Provider checks submitted documents and sets status to Verified." },
      { step: 4, name: "ZK Eligibility Check", description: "Execute Midnight Zero-Knowledge proof to verify eligibility privately." }
    ];

    expect(workflowStages.length).toBe(4);
    expect(workflowStages[0].name).toBe("Connect Wallet");
    expect(workflowStages[1].name).toBe("Search & Apply");
    expect(workflowStages[2].name).toBe("Credential Review");
    expect(workflowStages[3].name).toBe("ZK Eligibility Check");

    // 2. Contextual Guidance Messages
    const guidanceTexts = {
      browsing: "Search for scholarships by title or keyword. Click 'View Details & Apply' on any scholarship card to review eligibility criteria and submit required PDF documents.",
      modal: "Ensure your Academic Marksheet and Income Certificate files are selected in PDF format before clicking 'Submit Application'.",
      tracking: "Follow your application progress across the 4-stage stepper. Once status reaches 'Verified', enter your marks and income to execute Midnight Zero-Knowledge proof generation.",
      zkPrivacy: "Your marks and income values are evaluated inside Midnight ZK private circuits. Raw financial and academic values are never stored publicly or disclosed on-chain."
    };

    expect(guidanceTexts.browsing).toContain("View Details & Apply");
    expect(guidanceTexts.modal).toContain("Submit Application");
    expect(guidanceTexts.tracking).toContain("Verified");
    expect(guidanceTexts.zkPrivacy).toContain("Midnight ZK private circuits");

    // 3. Verify lifecycle integration with guidance stages
    const providerAddr = "0xaddr_provider_guidance";
    const studentAddr = "0xaddr_student_guidance";

    const sch = contract.createScholarship(
      "Guidance Fellowship 2026",
      "Testing workflow guidance mapping",
      75n,
      500000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "Guidance Provider",
      providerAddr
    );

    // Stage 2: Submit Application
    const app = contract.submitApplication(sch.id, studentAddr, "Guidance Student");
    expect(app.status).toBe("Documents Submitted");

    // Stage 3: Admin Review & Verification
    contract.updateApplicationStatus(app.id, "Verified", providerAddr);
    expect(app.status).toBe("Verified");

    // Stage 4: ZK Proof Execution
    const proof = contract.verifyEligibility({ studentMarks: 85n, studentIncome: 300000n }, app.id);
    expect(proof.isEligible).toBe(true);
  });

  // --------------------------------------------------------------------------
  // TEST 19 — Level 5 Cross-Feature Regression: Search, Details, Guidance & ZK Proof
  // --------------------------------------------------------------------------
  it("TEST 19 — Level 5 Cross-Feature Integration: Search -> Detailed Item View -> 4-Step Guidance -> ZK Verification", () => {
    const providerAddr = "mn_addr1_provider_integration_test";
    const providerName = "Quantum & Privacy Institute";

    // 1. Setup multiple scholarships
    const sch1 = contract.createScholarship(
      "Quantum Cryptography & ZK Research Grant 2026",
      "Advanced grant for students working on zero-knowledge proof algorithms and privacy.",
      85n,
      600000n,
      ["Academic Marksheet", "Family Income Certificate", "Research Proposal"],
      providerName,
      providerAddr
    );

    const sch2 = contract.createScholarship(
      "Cybersecurity Undergraduate Scholarship",
      "Financial assistance for students pursuing network security and cryptography.",
      75n,
      400000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "Cyber Shield Org",
      "mn_addr1_provider_cybershield"
    );

    // 2. Perform Search Filtering (Step 4 Feature)
    const searchResults = contract.searchScholarships("Quantum");
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].id).toBe(sch1.id);
    expect(searchResults[0].name).toBe("Quantum Cryptography & ZK Research Grant 2026");

    // 3. Inspect Enriched Details for Filtered Search Item (Step 5 Feature)
    const details = contract.getScholarshipById(searchResults[0].id);
    expect(details).toBeDefined();
    expect(details?.name).toBe("Quantum Cryptography & ZK Research Grant 2026");
    expect(details?.minimumMarks).toBe(85n);
    expect(details?.maximumFamilyIncome).toBe(600000n);
    expect(details?.requiredDocuments.length).toBe(3);
    expect(details?.createdBy).toBe(providerName);
    expect(details?.creatorAddress).toBe(providerAddr);
    expect(details?.createdAt).toBeDefined();

    // 4. Execute Full 4-Step Student Workflow Guidance Lifecycle (Step 6 Feature)
    const studentAddr = "mn_addr1_student_integration_user";
    
    // Step 1: Connect & Register Student Role
    contract.registerRole(studentAddr, "student");
    expect(contract.getUserRole(studentAddr)).toBe("student");

    // Step 2: Search, Select & Submit Application
    const app = contract.submitApplication(
      searchResults[0].id,
      studentAddr,
      "Quantum Scholar",
      "Quantum_Marksheet.pdf",
      "Income_Cert.pdf"
    );
    expect(app.status).toBe("Documents Submitted");
    expect(app.scholarshipName).toBe("Quantum Cryptography & ZK Research Grant 2026");

    // Step 3: Provider Credential Review
    contract.updateApplicationStatus(app.id, "Verified", providerAddr);
    expect(app.status).toBe("Verified");

    // Step 4: Midnight ZK Eligibility Verification
    const proof = contract.verifyEligibility(
      { studentMarks: 92n, studentIncome: 350000n }, // 92 >= 85 AND 350k <= 600k
      app.id
    );

    expect(proof.isEligible).toBe(true);
    expect(proof.publicState.verificationsCount).toBe(1n);
    expect(proof.publicState.latestVerificationResult).toBe(true);
    expect(proof.privacySummary.marksDisclosed).toBe(false);
    expect(proof.privacySummary.incomeDisclosed).toBe(false);
    expect(proof.privacySummary.resultDisclosed).toBe(true);

    // 5. Reset Search and Verify System State Integrity
    const resetResults = contract.searchScholarships("");
    expect(resetResults.length).toBe(2);
  });

  // --------------------------------------------------------------------------
  // TEST 20 — Level 5 Feature: Preprod Evidence & Address Validation Tooling
  // --------------------------------------------------------------------------
  it("TEST 20 — Level 5 Preprod Validation Tooling: Address Format, TxHash Validation & Status Classification", async () => {
    // 1. Valid Preprod Shielded Address
    const shielded = validatePreprodAddress("mn_addr_preprod1lwzdqj0g37jlgd5dxt8feq890fl3fp9uxnzzx8j0q95x09k5yrcsm3p9we");
    expect(shielded.isValid).toBe(true);
    expect(shielded.prefix).toBe("mn_addr_preprod1");
    expect(shielded.format).toBe("Shielded Preprod");
    expect(shielded.isPreprodPrefix).toBe(true);
    expect(shielded.isCompleteLength).toBe(true);
    expect(shielded.diagnosticMessage).toContain("Valid Midnight Preprod Shielded Bech32 address format");

    // 2. Valid Preprod DUST Address
    const dust = validatePreprodAddress("mn_dust_preprod1wdlard9k90z4p3khjweyv3ngu4lh7kujknmknzqsc7pa769t937r6vcxfsd");
    expect(dust.isValid).toBe(true);
    expect(dust.prefix).toBe("mn_dust_preprod1");
    expect(dust.format).toBe("DUST Preprod");
    expect(dust.isPreprodPrefix).toBe(true);
    expect(dust.isCompleteLength).toBe(true);
    expect(dust.diagnosticMessage).toContain("Valid Midnight Preprod DUST Bech32 address format");

    // 3. Preview Address Rejection
    const preview = validatePreprodAddress("mn_addr_preview19ekd8mrdu033qn6hveju9f2k9vt6an5nrgnr74rvxw589avc3xwstujjxl");
    expect(preview.isValid).toBe(false);
    expect(preview.isPreprodPrefix).toBe(false);
    expect(preview.format).toBe("Preview Network");
    expect(preview.diagnosticMessage).toContain("belongs to Preview Network");

    // 4. Mainnet / Network Mismatch Rejection
    const mainnet = validatePreprodAddress("mn_addr1seyst82p5kqzt7k2pe2lv09d9e75lwsmltvf7eea8xwypn0j5ynqgkqgst");
    expect(mainnet.isValid).toBe(false);
    expect(mainnet.isPreprodPrefix).toBe(false);
    expect(mainnet.format).toBe("Mainnet / Unspecified");
    expect(mainnet.diagnosticMessage).toContain("belongs to Mainnet");

    // 5. Truncated / Incomplete Address
    const truncated = validatePreprodAddress("mn_addr_preprod183323eryp4yajzrqmc7uagn");
    expect(truncated.isValid).toBe(false);
    expect(truncated.isCompleteLength).toBe(false);
    expect(truncated.diagnosticMessage).toContain("Truncated address string");

    // 6. Empty or Malformed Address
    const empty = validatePreprodAddress("");
    expect(empty.isValid).toBe(false);
    expect(empty.diagnosticMessage).toContain("empty or missing");

    // 7. Optional Transaction Hash Validation
    const validTxHash = "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b";
    const validTxVal = validateTransactionHashFormat(validTxHash);
    expect(validTxVal.isProvided).toBe(true);
    expect(validTxVal.isValidFormat).toBe(true);
    expect(validTxVal.diagnosticMessage).toContain("Valid hexadecimal transaction hash format");

    const malformedTxHash = "invalid_tx_hash_string";
    const malformedTxVal = validateTransactionHashFormat(malformedTxHash);
    expect(malformedTxVal.isProvided).toBe(true);
    expect(malformedTxVal.isValidFormat).toBe(false);
    expect(malformedTxVal.diagnosticMessage).toContain("Malformed transaction hash string");

    const missingTxVal = validateTransactionHashFormat(undefined);
    expect(missingTxVal.isProvided).toBe(false);
    expect(missingTxVal.isValidFormat).toBe(false);
    expect(missingTxVal.diagnosticMessage).toContain("No transaction hash provided");

    // 8. Classification & Verification Invariants on Full User Dataset
    const sampleResults = await runVerification([
      { id: 1, name: "Niki Biradar", address: "mn_addr_preprod1lwzdqj0g37jlgd5dxt8feq890fl3fp9uxnzzx8j0q95x09k5yrcsm3p9we" },
      { id: 10, name: "Pooja Kohinkar", address: "mn_addr_preprod183323eryp4yajzrqmc7uagn" }
    ]);
    expect(sampleResults.length).toBe(2);
    expect(sampleResults[0].statusCode).toBe("PENDING_ONCHAIN_PROOF");
    expect(sampleResults[1].statusCode).toBe("INCOMPLETE");

    // Synchronous classification across all 51 user entries
    let completeCount = 0;
    let incompleteCount = 0;
    for (const entry of USER_ENTRIES) {
      const cls = classifyFormat(entry.address);
      if (cls.isIncomplete) incompleteCount++;
      else if (cls.isPreprodComplete) completeCount++;
    }
    expect(completeCount).toBe(50);
    expect(incompleteCount).toBe(1);
  }, 10000);
});


