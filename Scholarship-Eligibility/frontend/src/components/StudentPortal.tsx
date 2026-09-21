import React, { useState } from "react";
import {
  ScholarshipItem,
  StudentApplication,
  ApplicationStatus,
  VerificationProofResult
} from "../../../src/contract";
import {
  GraduationCap,
  Award,
  FileText,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Check,
  FileCheck,
  ChevronRight,
  X,
  HelpCircle,
  Search,
  Building2,
  Calendar,
  ShieldCheck,
  Hash,
  Info
} from "lucide-react";

interface StudentPortalProps {
  scholarships: ScholarshipItem[];
  applications: StudentApplication[];
  onSubmitApplication: (
    scholarshipId: string,
    marksheetFileName: string,
    incomeCertFileName: string
  ) => void;
  onRunVerification: (
    applicationId: string,
    marks: number,
    income: number
  ) => VerificationProofResult | Promise<VerificationProofResult>;
  onOpenPrivacyModal: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  scholarships,
  applications,
  onSubmitApplication,
  onRunVerification,
  onOpenPrivacyModal
}) => {
  const [activeTab, setActiveTab] = useState<"browse" | "my_applications">("browse");
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Application / Verification modal states
  const [marksheetName, setMarksheetName] = useState("");
  const [incomeCertName, setIncomeCertName] = useState("");
  const [marksInput, setMarksInput] = useState<number | "">("");
  const [incomeInput, setIncomeInput] = useState<number | "">("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationProofResult | null>(null);

  const filteredScholarships = scholarships.filter((s) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    );
  });

  const getApplicationForScholarship = (scholarshipId: string) => {
    return applications.find((a) => a.scholarshipId === scholarshipId);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScholarship) return;
    const mName = marksheetName.trim() || "Academic_Marksheet.pdf";
    const iName = incomeCertName.trim() || "Income_Certificate.pdf";
    const result = onSubmitApplication(selectedScholarship.id, mName, iName);
    if ((result as any) !== false) {
      setSelectedScholarship(null);
      setMarksheetName("");
      setIncomeCertName("");
      setActiveTab("my_applications");
    }
  };

  const handleVerifySubmit = async (applicationId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (marksInput === "" || incomeInput === "") return;

    setIsEvaluating(true);
    try {
      const res = await onRunVerification(applicationId, Number(marksInput), Number(incomeInput));
      setVerificationResult(res);
    } catch (err: any) {
      alert(`Proof Generation Failed: ${err?.message || err}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "Verified":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Verified</span>
          </span>
        );
      case "Eligible":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Eligible</span>
          </span>
        );
      case "Not Eligible":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Not Eligible</span>
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Rejected</span>
          </span>
        );
      case "Under Review":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Under Review</span>
          </span>
        );
      case "Documents Submitted":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800 flex items-center space-x-1">
            <FileCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Submitted</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-800">
            Not Applied
          </span>
        );
    }
  };

  const renderStatusStepper = (status: ApplicationStatus) => {
    const steps = [
      { key: "submitted", label: "Applied & Submitted" },
      { key: "review", label: "Under Review" },
      { key: "verified", label: "Credentials Verified" },
      { key: "checked", label: "Eligibility Checked" }
    ];

    let currentStep = 0;
    if (status === "Documents Submitted") currentStep = 1;
    if (status === "Under Review") currentStep = 2;
    if (status === "Verified") currentStep = 3;
    if (status === "Eligible" || status === "Not Eligible") currentStep = 4;

    return (
      <div className="w-full space-y-2">
        <div className="grid grid-cols-4 gap-2 text-[11px] font-mono text-center">
          {steps.map((s, idx) => {
            const isPassed = currentStep > idx;
            const isCurrent = currentStep === idx + 1;
            return (
              <div
                key={s.key}
                className={`py-1.5 px-1 rounded-lg border font-medium ${
                  isPassed
                    ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                    : isCurrent
                    ? "bg-indigo-950/80 border-indigo-500 text-indigo-200"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
              >
                {s.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Student Portal</span>
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "browse"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Available Scholarships ({scholarships.length})
          </button>

          <button
            onClick={() => setActiveTab("my_applications")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === "my_applications"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>My Applications</span>
            {applications.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] flex items-center justify-center border border-indigo-800">
                {applications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: AVAILABLE SCHOLARSHIPS */}
      {activeTab === "browse" && (
        <div className="space-y-4">
          {/* Search Input Bar */}
          {scholarships.length > 0 && (
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scholarships by name or description..."
                  aria-label="Search scholarships"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="text-[11px] text-slate-400 mt-1.5 font-mono flex items-center justify-between px-1">
                  <span>Showing {filteredScholarships.length} of {scholarships.length} scholarships</span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-indigo-400 hover:underline text-[11px]"
                  >
                    Reset filter
                  </button>
                </div>
              )}
            </div>
          )}

          {scholarships.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-3 border border-slate-800">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Scholarships Available</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are currently no active scholarships published by scholarship providers. Please check back later.
              </p>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-3 border border-slate-800">
              <Search className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Scholarships Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No scholarships matched your search query "{searchQuery}". Try searching with different keywords.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScholarships.map((s) => {
                const app = getApplicationForScholarship(s.id);
                const status = app ? app.status : "Not Applied";

                return (
                  <div
                    key={s.id}
                    className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 text-[10px] font-mono border border-indigo-800/60 flex items-center space-x-1">
                              <Building2 className="w-3 h-3 text-indigo-400" />
                              <span>{s.createdBy || "Scholarship Provider"}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-[10px] font-mono border border-slate-800">
                              #{s.id}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white tracking-tight">{s.name}</h3>
                        </div>
                        {getStatusBadge(status)}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {s.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 text-[10px] uppercase block">Min Marks</span>
                          <strong className="text-indigo-300 text-sm">{s.minimumMarks.toString()}%</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 text-[10px] uppercase block">Max Income</span>
                          <strong className="text-emerald-300 text-sm">₹{Number(s.maximumFamilyIncome).toLocaleString("en-IN")}</strong>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                        {s.requiredDocuments && s.requiredDocuments.length > 0 ? (
                          s.requiredDocuments.map((doc, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 flex items-center space-x-1">
                              <FileText className="w-3 h-3 text-indigo-400" />
                              <span>{doc}</span>
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 flex items-center space-x-1">
                            <FileText className="w-3 h-3 text-slate-500" />
                            <span>Marksheet & Income Cert</span>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/60 flex items-center space-x-1 ml-auto">
                          <ShieldCheck className="w-3 h-3 text-purple-400" />
                          <span>ZK Verified</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Active Program"}</span>
                      </div>
                      <button
                        onClick={() => setSelectedScholarship(s)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-1 transition-all"
                      >
                        <span>View Details & Apply</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}


      {/* TAB 2: MY APPLICATIONS & STATUS TRACKER */}
      {activeTab === "my_applications" && (
        <div className="space-y-6">
          {applications.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Applications Submitted</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have not applied for any scholarships yet. Click Available Scholarships to get started.
              </p>
              <button
                onClick={() => setActiveTab("browse")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
              >
                Browse Scholarships
              </button>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5 shadow-xl"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                      Application #{app.id}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">{app.scholarshipName}</h3>
                  </div>
                  <div>{getStatusBadge(app.status)}</div>
                </div>

                {/* Progress Stepper */}
                {renderStatusStepper(app.status)}

                {/* Short Status Explanation */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>
                    {app.status === "Documents Submitted" && "Your documents have been submitted and are waiting for review."}
                    {app.status === "Under Review" && "Your documents are currently being reviewed."}
                    {app.status === "Verified" && "Credentials verified. Enter your information below to check eligibility."}
                    {app.status === "Eligible" && "Your verified credentials meet this scholarship's requirements."}
                    {app.status === "Not Eligible" && "Your verified credentials do not meet the minimum marks or maximum income criteria."}
                    {app.status === "Rejected" && `Application rejected: ${app.rejectionReason || "Incomplete credentials."}`}
                  </span>
                </div>

                {/* Check Eligibility Form (When Verified) */}
                {app.status === "Verified" && (
                  <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <Lock className="w-4 h-4 text-indigo-400" />
                        <span>Check Scholarship Eligibility</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        🔒 Your personal information remains private.
                      </span>
                    </div>

                    <form onSubmit={(e) => handleVerifySubmit(app.id, e)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">
                            Academic Marks (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={marksInput}
                            onChange={(e) => setMarksInput(e.target.value === "" ? "" : Number(e.target.value))}
                            required
                            placeholder="e.g. 85"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">
                            Annual Family Income (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="5000"
                            value={incomeInput}
                            onChange={(e) => setIncomeInput(e.target.value === "" ? "" : Number(e.target.value))}
                            required
                            placeholder="e.g. 250000"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isEvaluating}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                      >
                        {isEvaluating ? (
                          <span>Checking eligibility...</span>
                        ) : (
                          <>
                            <span>Check Eligibility</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Clean Result Display */}
                {(app.status === "Eligible" || app.status === "Not Eligible") && (
                  <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                    app.status === "Eligible"
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                      : "bg-rose-950/40 border-rose-500/50 text-rose-200"
                  }`}>
                    <div className="flex items-center space-x-3">
                      {app.status === "Eligible" ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <div className="text-xl font-extrabold text-white">
                          {app.status === "Eligible" ? "✓ Eligible" : "✕ Not Eligible"}
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {app.status === "Eligible"
                            ? "Your verified credentials meet this scholarship's requirements."
                            : "Your verified credentials do not meet the minimum marks or maximum income requirement."}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={onOpenPrivacyModal}
                      className="text-xs text-indigo-300 hover:text-white underline shrink-0 font-mono"
                    >
                      How is my privacy protected?
                    </button>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      )}

      {/* SCHOLARSHIP DETAILS & APPLICATION MODAL */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-indigo-500/40 space-y-6 shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 text-xs font-mono border border-indigo-800 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{selectedScholarship.createdBy || "Scholarship Provider"}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-xs font-mono border border-slate-800">
                    #{selectedScholarship.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedScholarship.name}</h3>
              </div>
              <button
                onClick={() => setSelectedScholarship(null)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-indigo-400" />
                <span>Scholarship Overview</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                {selectedScholarship.description}
              </p>
            </div>

            {/* Section 2: Eligibility Criteria */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Eligibility Requirements</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Minimum Academic Marks</span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <strong className="text-indigo-300 text-base">{selectedScholarship.minimumMarks.toString()}%</strong>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Required in marksheet</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Maximum Family Income</span>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <strong className="text-emerald-300 text-base">₹{Number(selectedScholarship.maximumFamilyIncome).toLocaleString("en-IN")}</strong>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Annual income limit</span>
                </div>
              </div>
            </div>

            {/* Section 3: Required Documents */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Required Verification Documents</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(selectedScholarship.requiredDocuments && selectedScholarship.requiredDocuments.length > 0
                  ? selectedScholarship.requiredDocuments
                  : ["Academic Marksheet", "Family Income Certificate"]
                ).map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2 text-slate-200">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-medium text-xs">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Publisher Metadata & ZK Privacy Note */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between text-indigo-300 font-medium">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Zero-Knowledge Privacy Guarantee</span>
                </span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-700/50">
                  Midnight Network
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Your marks and income values are evaluated inside Midnight ZK private circuits. Raw financial and academic values are never stored publicly or disclosed on-chain.
              </p>
              {selectedScholarship.creatorAddress && (
                <div className="pt-1.5 border-t border-indigo-900/50 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Publisher: {selectedScholarship.createdBy}</span>
                  <span>Address: {selectedScholarship.creatorAddress.slice(0, 12)}...{selectedScholarship.creatorAddress.slice(-6)}</span>
                </div>
              )}
            </div>

            {/* Section 5: Application Form Upload */}
            <form onSubmit={handleApply} className="space-y-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload Academic Marksheet (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setMarksheetName(e.target.files[0].name);
                    }
                  }}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-900 file:text-indigo-200 hover:file:bg-indigo-800 cursor-pointer"
                />
                {marksheetName && (
                  <div className="mt-1 text-[11px] text-emerald-400 font-mono">
                    ✓ Selected File: {marksheetName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload Family Income Certificate (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setIncomeCertName(e.target.files[0].name);
                    }
                  }}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-900 file:text-indigo-200 hover:file:bg-indigo-800 cursor-pointer"
                />
                {incomeCertName && (
                  <div className="mt-1 text-[11px] text-emerald-400 font-mono">
                    ✓ Selected File: {incomeCertName}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedScholarship(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
                >
                  Submit Application
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
