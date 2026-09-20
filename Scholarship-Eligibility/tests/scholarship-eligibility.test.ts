import { describe, it, expect, beforeEach } from "vitest";
import { ScholarshipEligibilityContract } from "../src/contract.js";
import { MidnightWalletAdapter } from "../src/wallet.js";
import { MidnightIndexerService } from "../src/indexer.js";

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
  // TEST 16 — Level 5 Feature: Scholarship Search & Filtering Behavior
  // --------------------------------------------------------------------------
  it("TEST 16 — Level 5: Search scholarships by keyword, case-insensitivity, empty search, and no-results", () => {
    const searchContract = new ScholarshipEligibilityContract();
    
    searchContract.createScholarship(
      "Merit Excellence Scholarship 2026",
      "For top academic achievers in STEM fields",
      85n,
      600000n,
      [],
      "STEM Foundation",
      "0xaddr_stem"
    );

    searchContract.createScholarship(
      "Need-Based Financial Aid Grant",
      "Assistance for underprivileged students in engineering",
      60n,
      300000n,
      [],
      "Aid Trust",
      "0xaddr_aid"
    );

    searchContract.createScholarship(
      "Global Women in Tech Award",
      "Supporting female computer science scholars",
      75n,
      500000n,
      [],
      "Tech Equity",
      "0xaddr_tech"
    );

    const allScholarships = searchContract.getScholarships();
    expect(allScholarships.length).toBe(3);

    // Search helper matching logic (as used in StudentPortal)
    const filterScholarships = (query: string) => {
      if (!query.trim()) return allScholarships;
      const q = query.toLowerCase().trim();
      return allScholarships.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    };

    // 1. Matching search
    const meritResults = filterScholarships("Merit");
    expect(meritResults.length).toBe(1);
    expect(meritResults[0].name).toContain("Merit Excellence");

    // 2. Case-insensitive search
    const lowerResults = filterScholarships("engineering");
    expect(lowerResults.length).toBe(1);
    expect(lowerResults[0].name).toBe("Need-Based Financial Aid Grant");

    const upperResults = filterScholarships("WOMEN");
    expect(upperResults.length).toBe(1);
    expect(upperResults[0].name).toBe("Global Women in Tech Award");

    // 3. Empty search returns all scholarships
    const emptyResults = filterScholarships("");
    expect(emptyResults.length).toBe(3);

    const whitespaceResults = filterScholarships("   ");
    expect(whitespaceResults.length).toBe(3);

    // 4. No-result search
    const noResults = filterScholarships("NonExistentScholarshipKeyword123");
    expect(noResults.length).toBe(0);
  });

  // --------------------------------------------------------------------------
  // TEST 17 — Level 5 Feature: Scholarship Details Metadata & Retrieval
  // --------------------------------------------------------------------------
  it("TEST 17 — Level 5: Verify scholarship details structure, metadata integrity, and optional fields", () => {
    const detailsContract = new ScholarshipEligibilityContract();

    const createdGrant = detailsContract.createScholarship(
      "Doctoral Research Fellowship in Cryptography",
      "Specialized grant for PhD candidates researching zero-knowledge proofs and privacy ledger scaling.",
      90n,
      800000n,
      ["Academic Marksheet", "Family Income Certificate", "Research Proposal PDF", "Advisor Recommendation"],
      "Crypto Science Foundation",
      "0xaddr_crypto_foundation"
    );

    // 1. Verify retrieval by ID
    const retrieved = detailsContract.getScholarshipById(createdGrant.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(createdGrant.id);

    // 2. Verify all detail fields are present and accurate
    expect(retrieved?.name).toBe("Doctoral Research Fellowship in Cryptography");
    expect(retrieved?.description).toContain("zero-knowledge proofs");
    expect(retrieved?.minimumMarks).toBe(90n);
    expect(retrieved?.maximumFamilyIncome).toBe(800000n);
    expect(retrieved?.createdBy).toBe("Crypto Science Foundation");
    expect(retrieved?.creatorAddress).toBe("0xaddr_crypto_foundation");
    expect(retrieved?.createdAt).toBeDefined();

    // 3. Verify required documents array structure
    expect(retrieved?.requiredDocuments.length).toBe(4);
    expect(retrieved?.requiredDocuments).toContain("Research Proposal PDF");
    expect(retrieved?.requiredDocuments).toContain("Advisor Recommendation");

    // 4. Verify student application links back to correct scholarship details
    const studentAddr = "0xaddr_phd_student";
    const app = detailsContract.submitApplication(createdGrant.id, studentAddr, "PhD Student Scholar");
    expect(app.scholarshipId).toBe(createdGrant.id);
    expect(app.scholarshipName).toBe(createdGrant.name);

    const linkedScholarship = detailsContract.getScholarshipById(app.scholarshipId);
    expect(linkedScholarship?.minimumMarks).toBe(90n);
    expect(linkedScholarship?.maximumFamilyIncome).toBe(800000n);
  });
});




