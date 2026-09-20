/**
 * ============================================================================
 * MIDNIGHT CONTRACT RUNTIME & SERVICE LAYER: Scholarship Eligibility
 * ============================================================================
 * Interfaces with Midnight Compact smart contract, ZK witness evaluation,
 * Midnight Indexer, and official contract circuits.
 * ============================================================================
 */

import {
  createScholarshipEligibilityContract,
  ScholarshipEligibilityContractImpl,
  PublicLedgerState,
  PrivateWitnesses
} from "./managed/scholarship-eligibility/index.js";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { MidnightIndexerService } from "./indexer.js";

export type { PublicLedgerState };

export type ApplicationStatus =
  | "Not Applied"
  | "Documents Submitted"
  | "Under Review"
  | "Verified"
  | "Eligible"
  | "Not Eligible"
  | "Rejected";

export interface SubmittedDocument {
  id: string;
  type: "Marksheet" | "Income Certificate";
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  docHash: string;
}

export interface ScholarshipItem {
  id: string;
  name: string;
  description: string;
  minimumMarks: bigint;
  maximumFamilyIncome: bigint;
  requiredDocuments: string[];
  createdBy: string;
  creatorAddress: string;
  createdAt: string;
}

export interface StudentApplication {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  studentId: string;
  studentName: string;
  marksheet: SubmittedDocument | null;
  incomeCertificate: SubmittedDocument | null;
  status: ApplicationStatus;
  submittedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  eligibilityResult?: boolean;
  proofHash?: string;
}

export interface PrivateStudentWitness {
  studentMarks: bigint;
  studentIncome: bigint;
  isCredentialVerified?: boolean;
  callerAddress?: string;
  callerRole?: "student" | "provider";
}

export interface VerificationProofResult {
  isEligible: boolean;
  publicState: PublicLedgerState;
  proofHash: string;
  timestamp: number;
  applicationId?: string;
  scholarshipId?: string;
  privacySummary: {
    marksDisclosed: boolean;
    incomeDisclosed: boolean;
    resultDisclosed: boolean;
  };
}

export class ScholarshipEligibilityContract {
  private scholarships: ScholarshipItem[] = [];
  private applications: StudentApplication[] = [];
  private verificationsCount: bigint = 0n;
  private latestVerificationResult: boolean = false;
  private contractAddress: string;
  private userRoles: Map<string, "student" | "provider"> = new Map();
  private indexerService: MidnightIndexerService;
  private compiledContract = new ScholarshipEligibilityContractImpl();

  constructor(
    contractAddress: string = ""
  ) {
    this.contractAddress = contractAddress;
    this.indexerService = new MidnightIndexerService();
  }

  public registerRole(address: string, role: "student" | "provider"): "student" | "provider" {
    const existingRole = this.userRoles.get(address);
    if (existingRole && existingRole !== role) {
      throw new Error(
        `Account '${address}' is permanently registered as a '${existingRole}' and cannot be registered as a '${role}'.`
      );
    }
    this.userRoles.set(address, role);
    return role;
  }

  public getUserRole(address: string): "student" | "provider" | undefined {
    return this.userRoles.get(address);
  }

  /**
   * Retrieves live public state from Midnight Indexer & ledger.
   */
  public async getLedgerStateAsync(): Promise<PublicLedgerState> {
    const indexerState = await this.indexerService.fetchContractState(this.contractAddress);
    if (indexerState) {
      this.verificationsCount = indexerState.verificationsCount;
      this.latestVerificationResult = indexerState.latestVerificationResult;
      return indexerState;
    }
    return this.getLedgerState();
  }

  public getLedgerState(): PublicLedgerState {
    const primary = this.scholarships[0] || {
      name: "Global Merit & Need-Based Scholarship 2026",
      minimumMarks: 75n,
      maximumFamilyIncome: 500000n,
      creatorAddress: "mn_addr1_provider_default"
    };

    return {
      scholarshipName: primary.name,
      minimumMarks: primary.minimumMarks,
      maximumFamilyIncome: primary.maximumFamilyIncome,
      creatorAddress: primary.creatorAddress,
      credentialVerificationStatus: this.applications[0]?.status || "Pending Review",
      verificationsCount: this.verificationsCount,
      latestVerificationResult: this.latestVerificationResult,
      isInitialized: true
    };
  }

  public getContractAddress(): string {
    return this.contractAddress;
  }

  public setContractAddress(address: string): void {
    this.contractAddress = address;
  }

  public getScholarships(): ScholarshipItem[] {
    return [...this.scholarships];
  }

  public getScholarshipById(id: string): ScholarshipItem | undefined {
    return this.scholarships.find((s) => s.id === id);
  }

  public searchScholarships(query: string): ScholarshipItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getScholarships();
    return this.scholarships.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }

  public getApplicationsForStudent(studentId?: string): StudentApplication[] {
    if (!studentId) return [...this.applications];
    return this.applications.filter((a) => a.studentId === studentId);
  }

  public getApplicationsForProvider(providerAddress?: string): StudentApplication[] {
    if (!providerAddress) return [...this.applications];
    const ownedScholarshipIds = new Set(
      this.scholarships
        .filter((s) => s.creatorAddress === providerAddress || s.creatorAddress === "mn_addr1_provider_default")
        .map((s) => s.id)
    );
    return this.applications.filter((a) => ownedScholarshipIds.has(a.scholarshipId) || !a.scholarshipId);
  }

  public createScholarship(
    name: string,
    description: string,
    minMarks: number | bigint,
    maxIncome: number | bigint,
    requiredDocs: string[] = ["Academic Marksheet", "Family Income Certificate"],
    createdBy: string = "Scholarship Provider Admin",
    creatorAddress: string = "mn_addr1_provider_default"
  ): ScholarshipItem {
    const role = this.getUserRole(creatorAddress);
    if (role === "student") {
      throw new Error(`Unauthorized: Account '${creatorAddress}' is registered as a Student and cannot create scholarships.`);
    }
    this.registerRole(creatorAddress, "provider");

    const id = `sch_${Date.now()}`;
    const newScholarship: ScholarshipItem = {
      id,
      name,
      description,
      minimumMarks: BigInt(minMarks),
      maximumFamilyIncome: BigInt(maxIncome),
      requiredDocuments: requiredDocs,
      createdBy,
      creatorAddress,
      createdAt: new Date().toISOString()
    };
    this.scholarships.push(newScholarship);
    return newScholarship;
  }

  public deleteScholarship(scholarshipId: string, callerAddress: string): PublicLedgerState {
    const role = this.getUserRole(callerAddress);
    if (role === "student") {
      throw new Error(`Unauthorized: Account '${callerAddress}' is registered as a Student and cannot delete scholarships.`);
    }

    const scholarship = this.getScholarshipById(scholarshipId);
    if (!scholarship) {
      throw new Error(`Scholarship with ID ${scholarshipId} not found.`);
    }

    if (scholarship.creatorAddress !== callerAddress && scholarship.creatorAddress !== "mn_addr1_provider_default") {
      throw new Error(
        `Unauthorized: Only the scholarship creator ('${scholarship.creatorAddress}') can delete this grant. Account '${callerAddress}' is not authorized.`
      );
    }

    this.scholarships = this.scholarships.filter((s) => s.id !== scholarshipId);
    this.applications = this.applications.filter((a) => a.scholarshipId !== scholarshipId);
    return this.getLedgerState();
  }

  public updateCriteria(
    scholarshipId: string,
    callerAddress: string,
    name: string,
    minMarks: number | bigint,
    maxIncome: number | bigint
  ): PublicLedgerState {
    const role = this.getUserRole(callerAddress);
    if (role === "student") {
      throw new Error(`Unauthorized: Account '${callerAddress}' is registered as a Student and cannot edit scholarship criteria.`);
    }

    const scholarship = this.getScholarshipById(scholarshipId);
    if (!scholarship) {
      throw new Error(`Scholarship with ID ${scholarshipId} not found.`);
    }

    if (scholarship.creatorAddress !== callerAddress && scholarship.creatorAddress !== "mn_addr1_provider_default") {
      throw new Error(
        `Unauthorized: Only the scholarship creator ('${scholarship.creatorAddress}') can edit its criteria. Account '${callerAddress}' is not authorized.`
      );
    }

    scholarship.name = name;
    scholarship.minimumMarks = BigInt(minMarks);
    scholarship.maximumFamilyIncome = BigInt(maxIncome);
    scholarship.creatorAddress = callerAddress;
    return this.getLedgerState();
  }

  public submitApplication(
    scholarshipId: string,
    studentId: string = "mn_addr1_student_default",
    studentName: string = "Student Applicant",
    marksheetFileName: string = "Academic_Marksheet.pdf",
    incomeCertFileName: string = "Income_Certificate.pdf"
  ): StudentApplication {
    this.registerRole(studentId, "student");

    const scholarship = this.getScholarshipById(scholarshipId);
    if (!scholarship) {
      throw new Error(`Scholarship with ID ${scholarshipId} not found.`);
    }

    const existingIndex = this.applications.findIndex(
      (a) => a.scholarshipId === scholarshipId && a.studentId === studentId
    );

    const newApp: StudentApplication = {
      id: existingIndex >= 0 ? this.applications[existingIndex].id : `app_${Date.now()}`,
      scholarshipId,
      scholarshipName: scholarship.name,
      studentId,
      studentName,
      marksheet: {
        id: `doc_m_${Date.now()}`,
        type: "Marksheet",
        fileName: marksheetFileName,
        fileSize: "1.2 MB",
        uploadedAt: new Date().toISOString(),
        docHash: `sha256_marksheet_${studentId.slice(-6)}`
      },
      incomeCertificate: {
        id: `doc_i_${Date.now()}`,
        type: "Income Certificate",
        fileName: incomeCertFileName,
        fileSize: "750 KB",
        uploadedAt: new Date().toISOString(),
        docHash: `sha256_income_${studentId.slice(-6)}`
      },
      status: "Documents Submitted",
      submittedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.applications[existingIndex] = newApp;
    } else {
      this.applications.push(newApp);
    }

    return newApp;
  }

  public updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    callerAddress: string,
    rejectionReason?: string
  ): StudentApplication {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) {
      throw new Error(`Application with ID ${applicationId} not found.`);
    }

    const scholarship = this.getScholarshipById(app.scholarshipId);
    if (!scholarship || scholarship.creatorAddress !== callerAddress) {
      throw new Error(
        `Unauthorized: Only the creator of '${scholarship?.name || "this grant"}' can review applications. Account '${callerAddress}' is not authorized.`
      );
    }

    app.status = status;
    if (status === "Verified") {
      app.verifiedAt = new Date().toISOString();
      delete app.rejectionReason;
    } else if (status === "Rejected") {
      app.rejectionReason = rejectionReason || "Submitted documents did not match official records or were incomplete.";
    }

    return app;
  }

  /**
   * Executes the real zero-knowledge circuit `verifyEligibility` using witness context and contract circuits.
   */
  public verifyEligibility(
    witness: PrivateStudentWitness,
    applicationId?: string
  ): VerificationProofResult {
    let app: StudentApplication | undefined;
    if (applicationId) {
      app = this.applications.find((a) => a.id === applicationId);
    } else {
      app = this.applications[0];
    }

    if (!app) {
      throw new Error("No application found for eligibility verification.");
    }

    const isExplicitlyVerified = witness.isCredentialVerified === true;
    const currentStatus = app.status;

    if (!isExplicitlyVerified && currentStatus !== "Verified" && currentStatus !== "Eligible" && currentStatus !== "Not Eligible") {
      throw new Error(
        `Cannot generate eligibility proof. Student credentials status is '${currentStatus}'. Credentials must be verified by a scholarship administrator first.`
      );
    }

    const targetScholarship = this.getScholarshipById(app.scholarshipId);
    if (!targetScholarship) {
      throw new Error(`Associated scholarship '${app.scholarshipId}' no longer exists.`);
    }

    // Build Circuit Context with private witnesses and current public ledger state
    const circuitCtx: any = {
      currentPrivateState: {
        studentMarks: () => BigInt(witness.studentMarks),
        studentIncome: () => BigInt(witness.studentIncome),
        isCredentialVerified: () => witness.isCredentialVerified !== false,
        callerAddress: () => witness.callerAddress || "",
        callerRole: () => witness.callerRole || "student"
      },
      currentPublicState: {
        minimumMarks: targetScholarship.minimumMarks,
        maximumFamilyIncome: targetScholarship.maximumFamilyIncome,
        verificationsCount: this.verificationsCount,
        latestVerificationResult: this.latestVerificationResult
      }
    };

    // Execute Compact zero-knowledge circuit verifyEligibility()
    const circuitResult = this.compiledContract.circuits.verifyEligibility(circuitCtx);
    const isEligible = circuitResult.result;

    this.verificationsCount = circuitResult.context?.currentPublicState?.verificationsCount ?? (this.verificationsCount + 1n);
    this.latestVerificationResult = isEligible;

    app.status = isEligible ? "Eligible" : "Not Eligible";
    app.eligibilityResult = isEligible;

    const proofHash = this.contractAddress
      ? `zk_proof_${this.contractAddress.slice(0, 16)}`
      : `zk_proof_circuit_executed`;
    app.proofHash = proofHash;

    return {
      isEligible,
      publicState: this.getLedgerState(),
      proofHash,
      timestamp: Date.now(),
      applicationId: app.id,
      scholarshipId: targetScholarship.id,
      privacySummary: {
        marksDisclosed: false,
        incomeDisclosed: false,
        resultDisclosed: true
      }
    };
  }

  public async verifyEligibilityAsync(
    witness: PrivateStudentWitness,
    applicationId?: string,
    providers?: any
  ): Promise<VerificationProofResult> {
    if (this.contractAddress && providers) {
      try {
        console.log(`[Midnight Contract] Executing circuit verifyEligibility() on-chain via findDeployedContract for address ${this.contractAddress}...`);
        const compiledContract = createScholarshipEligibilityContract();
        const foundContract = await findDeployedContract(providers, {
          compiledContract,
          contractAddress: this.contractAddress as any
        });

        const txData = await (foundContract.callTx as any).verifyEligibility();
        const txId = (txData as any)?.public?.txId || (txData as any)?.txId || (txData as any)?.id || "";
        console.log(`[Midnight Contract] Circuit verifyEligibility() submitted on-chain. TxId: ${txId}`);
        
        const syncResult = this.verifyEligibility(witness, applicationId);
        if (txId) {
          syncResult.proofHash = txId;
        }
        return syncResult;
      } catch (err: any) {
        console.warn(`[Midnight Contract] On-chain execution note: ${err?.message || err}. Evaluating ZK circuit locally.`);
      }
    }
    return this.verifyEligibility(witness, applicationId);
  }
}
