import React, { useState, useEffect } from "react";
import {
  ScholarshipEligibilityContract,
  VerificationProofResult,
  ScholarshipItem,
  StudentApplication,
  ApplicationStatus
} from "../../src/contract";
import { MidnightWalletAdapter } from "../../src/wallet";
import { MidnightIndexerService } from "../../src/indexer";
import { Header } from "./components/Header";
import { RoleSelector, UserRole } from "./components/RoleSelector";
import { StudentPortal } from "./components/StudentPortal";
import { ProviderPortal } from "./components/ProviderPortal";
import { LedgerInspector } from "./components/LedgerInspector";
import { PrivacyModal } from "./components/PrivacyModal";
import { WalletConnectModal } from "./components/WalletConnectModal";
import { UserProfileModal } from "./components/UserProfileModal";
import { Wallet } from "lucide-react";

const walletAdapter = new MidnightWalletAdapter();
const indexerService = new MidnightIndexerService();

const contractAddress = (import.meta as any).env?.VITE_CONTRACT_ADDRESS || "";

export function App() {
  const [contract, setContract] = useState<ScholarshipEligibilityContract>(
    () => new ScholarshipEligibilityContract(contractAddress)
  );

  const [walletState, setWalletState] = useState(() => walletAdapter.getState());
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState<"student" | "provider" | "inspector">("student");
  
  const [userName, setUserName] = useState<string>("");

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deployResult, setDeployResult] = useState<{ contractAddress: string; txHash: string } | null>(null);

  const [publicState, setPublicState] = useState(() => contract.getLedgerState());
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>(() => contract.getScholarships());
  const [applications, setApplications] = useState<StudentApplication[]>(() => contract.getApplicationsForProvider());

  const handleDeployContractVia1AM = async () => {
    if (!walletState.isConnected || !walletAdapter.getConnectedApi()) {
      setIsWalletModalOpen(true);
      alert("Please connect your 1AM / Lace Midnight Wallet before deploying.");
      return;
    }

    setIsDeploying(true);
    setDeployError(null);
    setDeployResult(null);

    try {
      const { deployScholarshipContractOnMidnight } = await import("../../src/deploy.js");
      const creatorAddr = walletState.address || "0".repeat(64);
      const res = await deployScholarshipContractOnMidnight(
        {
          scholarshipName: "Global Merit & Need-Based Scholarship 2026",
          minimumMarks: 75n,
          maximumFamilyIncome: 500000n,
          creatorAddress: creatorAddr
        },
        walletAdapter
      );

      setDeployResult({
        contractAddress: res.contractAddress,
        txHash: res.txHash
      });

      const newContractInstance = new ScholarshipEligibilityContract(res.contractAddress);
      setContract(newContractInstance);
      refreshState();
    } catch (err: any) {
      console.error("[1AM Deploy Error]", err);
      setDeployError(err?.message || "Contract deployment failed via 1AM Wallet.");
    } finally {
      setIsDeploying(false);
    }
  };

  const refreshState = async () => {
    try {
      const indexerState = await indexerService.fetchContractState(contract.getContractAddress());
      if (indexerState) {
        setPublicState(indexerState);
      } else {
        setPublicState(contract.getLedgerState());
      }
    } catch (e) {
      setPublicState(contract.getLedgerState());
    }
    setScholarships(contract.getScholarships());
    setApplications(contract.getApplicationsForProvider());
  };

  useEffect(() => {
    refreshState();
  }, [activeTab, currentRole, walletState.address]);

  // Sync role and user name whenever wallet address changes
  useEffect(() => {
    const address = walletState.address;
    if (!address) {
      setCurrentRole(null);
      setUserName("");
      return;
    }

    const registeredContractRole = contract.getUserRole(address);
    if (registeredContractRole) {
      setCurrentRole(registeredContractRole);
      setActiveTab(registeredContractRole === "student" ? "student" : "provider");
    } else {
      setCurrentRole(null);
    }
  }, [walletState.address, contract]);

  const handleSaveUserName = (newName: string) => {
    setUserName(newName);
  };

  const handleSelectRole = (role: "student" | "provider") => {
    const address = walletState.address;
    if (!address) {
      alert("Please connect a valid Midnight Wallet before selecting a role.");
      return;
    }
    try {
      contract.registerRole(address, role);
      setCurrentRole(role);
      setActiveTab(role === "student" ? "student" : "provider");
    } catch (err: any) {
      alert(err.message || "Failed to register role for this account.");
    }
  };

  const handleCreateScholarship = (
    name: string,
    description: string,
    minMarks: number,
    maxIncome: number
  ) => {
    const address = walletState.address;
    if (!address) {
      alert("Please connect a valid Midnight Wallet before creating a scholarship.");
      return;
    }
    const displayName = userName || "Provider Admin Org";
    contract.createScholarship(name, description, minMarks, maxIncome, ["Academic Marksheet", "Family Income Certificate"], displayName, address);
    refreshState();
  };

  const handleDeleteScholarship = (scholarshipId: string) => {
    const address = walletState.address;
    if (!address) {
      alert("Please connect a valid Midnight Wallet before deleting a scholarship.");
      return;
    }
    try {
      contract.deleteScholarship(scholarshipId, address);
      refreshState();
    } catch (err: any) {
      alert(err.message || "Unauthorized deletion attempt.");
    }
  };

  const handleSubmitApplication = (
    scholarshipId: string,
    marksheetFileName: string,
    incomeCertFileName: string
  ): boolean => {
    const address = walletState.address;
    if (!address) {
      alert("Please connect a valid Midnight Wallet before submitting an application.");
      return false;
    }
    const displayName = userName ? `${userName} (Student)` : `Student (${address.slice(0, 8)})`;
    try {
      contract.submitApplication(
        scholarshipId,
        address,
        displayName,
        marksheetFileName,
        incomeCertFileName
      );
      refreshState();
      return true;
    } catch (err: any) {
      alert(err.message || "Failed to submit application.");
      return false;
    }
  };

  const handleUpdateApplicationStatus = (
    applicationId: string,
    status: ApplicationStatus,
    reason?: string
  ) => {
    const address = walletState.address;
    if (!address) {
      alert("Please connect a valid Midnight Wallet before reviewing applications.");
      return;
    }
    try {
      contract.updateApplicationStatus(applicationId, status, address, reason);
      refreshState();
    } catch (err: any) {
      alert(err.message || "Unauthorized review attempt.");
    }
  };

  const handleRunVerification = async (
    applicationId: string,
    marks: number,
    income: number
  ): Promise<VerificationProofResult> => {
    const address = walletState.address;
    if (!address) {
      throw new Error("Please connect a valid Midnight Wallet before running eligibility verification.");
    }
    const result = await contract.verifyEligibilityAsync(
      {
        studentMarks: BigInt(marks),
        studentIncome: BigInt(income),
        isCredentialVerified: true,
        callerAddress: address,
        callerRole: "student"
      },
      applicationId,
      walletAdapter.getConnectedApi() ? walletAdapter : undefined
    );
    refreshState();
    return result;
  };

  const handleConnectWallet = async (walletId?: string) => {
    console.log("[App] Connecting Midnight Wallet via DApp Connector...");
    const updated = await walletAdapter.connect(walletId);
    setWalletState(updated);
  };

  const handleConnectCustomAddress = (address: string) => {
    console.log("[App] Connecting custom wallet address:", address);
    const updated = walletAdapter.connectCustomAddress(address);
    setWalletState(updated);
  };

  const handleDisconnectWallet = () => {
    const updated = walletAdapter.disconnect();
    setWalletState(updated);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100">
      
      {/* Header */}
      <Header
        currentRole={currentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        userName={userName}
        walletState={walletState}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={handleDisconnectWallet}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Deployment Loading Modal */}
        {isDeploying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-4 shadow-2xl animate-pulse">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-xl font-bold text-white">Deploying Smart Contract via 1AM Wallet</h3>
              <p className="text-slate-300 text-sm">
                Please check your 1AM Browser Wallet extension popup to authorize fee balancing and sign the deployment transaction using Account 1 tDUST...
              </p>
            </div>
          </div>
        )}

        {/* Deployment Success Banner */}
        {deployResult && (
          <div className="max-w-4xl mx-auto mb-6 p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <h4 className="font-bold text-emerald-300 text-lg">✅ Smart Contract Successfully Deployed on Midnight Preview!</h4>
              </div>
              <button onClick={() => setDeployResult(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-900/50">
                <span className="text-emerald-400 font-semibold block">Contract Address:</span>
                <span className="text-slate-200 select-all break-all">{deployResult.contractAddress}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-900/50">
                <span className="text-emerald-400 font-semibold block">Deployment Tx ID:</span>
                <a
                  href={`https://explorer.preview.midnight.network/tx/${deployResult.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 underline hover:text-indigo-300 break-all"
                >
                  {deployResult.txHash}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Deployment Error Banner */}
        {deployError && (
          <div className="max-w-4xl mx-auto mb-6 p-6 bg-rose-950/60 border border-rose-500/40 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-rose-300 text-lg">❌ 1AM Wallet Deployment Failed</h4>
              <button onClick={() => setDeployError(null)} className="text-slate-400 hover:text-white font-bold text-sm">✕ Close</button>
            </div>
            <p className="text-rose-200 text-xs font-mono bg-slate-900/80 p-3 rounded-xl border border-rose-900/50 break-words">
              {deployError}
            </p>
          </div>
        )}

        {/* If Wallet is not connected, show Connect Wallet prompt */}
        {!walletState.isConnected || !walletState.address ? (
          <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Wallet className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Connect Midnight Wallet</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Connect your Midnight Lace Wallet extension or 1AM Wallet via DApp Connector to submit applications and execute Zero-Knowledge eligibility proofs.
              </p>
            </div>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center space-x-2 border border-indigo-500/30 active:scale-95 cursor-pointer"
            >
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet</span>
            </button>
          </div>
        ) : !currentRole ? (
          <RoleSelector onSelectRole={handleSelectRole} />
        ) : (
          <>
            {activeTab === "student" && (
              <StudentPortal
                scholarships={scholarships}
                applications={applications.filter((a) => a.studentId === walletState.address)}
                onSubmitApplication={handleSubmitApplication}
                onRunVerification={handleRunVerification}
                onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
              />
            )}

            {activeTab === "provider" && (
              <ProviderPortal
                scholarships={scholarships}
                applications={applications}
                currentWalletAddress={walletState.address || ""}
                onCreateScholarship={handleCreateScholarship}
                onDeleteScholarship={handleDeleteScholarship}
                onUpdateStatus={handleUpdateApplicationStatus}
                onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
                onDeployContract={handleDeployContractVia1AM}
              />
            )}

            {activeTab === "inspector" && (
              <LedgerInspector
                publicState={publicState}
                contractAddress={contract.getContractAddress()}
              />
            )}
          </>
        )}

      </main>

      {/* Wallet Connection Modal */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectOneAm={() => handleConnectWallet("1am")}
        onConnectLace={() => handleConnectWallet("lace")}
        onConnectCustomAddress={(addr) => handleConnectCustomAddress(addr)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        walletState={walletState}
        currentRole={currentRole}
        userName={userName}
        onSaveUserName={handleSaveUserName}
        onDisconnect={handleDisconnectWallet}
      />

      {/* Privacy & Technology Explanation Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        Private Scholarship Eligibility Verification &copy; 2026 Powered by Midnight Network ZK Smart Contracts.
      </footer>

    </div>
  );
}

export default App;
