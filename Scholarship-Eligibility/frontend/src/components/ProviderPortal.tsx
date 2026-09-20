import React, { useState } from "react";
import {
  ScholarshipItem,
  StudentApplication,
  ApplicationStatus
} from "../../../src/contract";
import {
  Building2,
  PlusCircle,
  Clock,
  FileText,
  Award,
  Users,
  Check,
  X,
  ChevronRight,
  HelpCircle,
  Trash2,
  AlertTriangle
} from "lucide-react";

interface ProviderPortalProps {
  scholarships: ScholarshipItem[];
  applications: StudentApplication[];
  currentWalletAddress: string;
  onCreateScholarship: (
    name: string,
    description: string,
    minMarks: number,
    maxIncome: number
  ) => void;
  onDeleteScholarship: (scholarshipId: string) => void;
  onUpdateStatus: (
    applicationId: string,
    status: ApplicationStatus,
    reason?: string
  ) => void;
  onOpenPrivacyModal: () => void;
  onDeployContract?: () => void;
}

export const ProviderPortal: React.FC<ProviderPortalProps> = ({
  scholarships,
  applications,
  currentWalletAddress,
  onCreateScholarship,
  onDeleteScholarship,
  onUpdateStatus,
  onOpenPrivacyModal,
  onDeployContract
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"applications" | "scholarships">("applications");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);

  // Deletion state
  const [deletingScholarshipId, setDeletingScholarshipId] = useState<string | null>(null);

  // Form states for scholarship creation
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minMarks, setMinMarks] = useState<number>(75);
  const [maxIncome, setMaxIncome] = useState<number>(450000);

  // Filter state
  const [selectedGrantFilter, setSelectedGrantFilter] = useState<string>("all");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{
    title: string;
    type: string;
    fileName: string;
    studentName: string;
    uploadedAt: string;
    hash: string;
  } | null>(null);

  // Filter ONLY scholarships created by current provider wallet address
  const ownedScholarships = scholarships.filter((s) => s.creatorAddress === currentWalletAddress);
  const ownedScholarshipIds = new Set(ownedScholarships.map((s) => s.id));
  const ownedApplications = applications.filter((a) => ownedScholarshipIds.has(a.scholarshipId));

  const filteredApplications =
    selectedGrantFilter === "all"
      ? ownedApplications
      : ownedApplications.filter((a) => a.scholarshipId === selectedGrantFilter);

  const pendingCount = ownedApplications.filter(
    (a) => a.status === "Documents Submitted" || a.status === "Under Review"
  ).length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    onCreateScholarship(name, description, minMarks, maxIncome);
    setName("");
    setDescription("");
    setShowCreateModal(false);
  };

  const handleConfirmDelete = (id: string) => {
    onDeleteScholarship(id);
    setDeletingScholarshipId(null);
  };

  const handleVerify = (appId: string) => {
    onUpdateStatus(appId, "Verified");
    setSelectedApp(null);
  };

  const handleReject = (appId: string) => {
    onUpdateStatus(appId, "Rejected", rejectionReason || "Incomplete credentials");
    setSelectedApp(null);
    setIsRejecting(false);
    setRejectionReason("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span>Scholarship Provider Dashboard</span>
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {onDeployContract && (
            <button
              onClick={onDeployContract}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 shrink-0 transition-all border border-indigo-500/30"
            >
              <Award className="w-4 h-4 text-indigo-200" />
              <span>CLI Deployment Info</span>
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center space-x-1.5 shrink-0 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Scholarship</span>
          </button>
        </div>
      </div>

      {/* Summary Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveSubTab("scholarships")}
          className={`glass-card rounded-2xl p-4 border transition-all cursor-pointer ${
            activeSubTab === "scholarships"
              ? "border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-950/40"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">My Scholarships</span>
              <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{ownedScholarships.length}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab("applications")}
          className={`glass-card rounded-2xl p-4 border transition-all cursor-pointer ${
            activeSubTab === "applications"
              ? "border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-950/40"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Applications</span>
              <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{ownedApplications.length}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab("applications")}
          className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Pending Reviews</span>
            <div className="text-2xl font-extrabold text-amber-300 font-mono mt-0.5">{pendingCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Sub Tab Controls */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab("applications")}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === "applications"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Applications Review ({ownedApplications.length})
        </button>

        <button
          onClick={() => setActiveSubTab("scholarships")}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === "scholarships"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Manage Scholarships ({ownedScholarships.length})
        </button>
      </div>

      {/* SUB-TAB 1: APPLICATIONS REVIEW */}
      {activeSubTab === "applications" && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Applications for Review</span>
            </h3>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium">Filter Grant:</span>
              <select
                value={selectedGrantFilter}
                onChange={(e) => setSelectedGrantFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Managed Grants ({ownedApplications.length})</option>
                {ownedScholarships.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Applications List / Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            {filteredApplications.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-600" />
                <p>No student applications found for review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                    <tr>
                      <th className="p-3.5">App ID</th>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Scholarship</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5 font-bold text-indigo-300">#{app.id}</td>
                        <td className="p-3.5 font-semibold text-white">{app.studentName}</td>
                        <td className="p-3.5 text-purple-200">{app.scholarshipName}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            app.status === "Verified"
                              ? "bg-purple-950 text-purple-300 border border-purple-800"
                              : app.status === "Eligible"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : app.status === "Not Eligible" || app.status === "Rejected"
                              ? "bg-rose-950 text-rose-300 border border-rose-800"
                              : "bg-amber-950 text-amber-300 border border-amber-800"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setIsRejecting(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all inline-flex items-center space-x-1"
                          >
                            <span>Review</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: MANAGE & DELETE SCHOLARSHIPS */}
      {activeSubTab === "scholarships" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Active & Completed Grants ({ownedScholarships.length})</span>
            </h3>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Grant</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownedScholarships.map((s) => {
              const count = ownedApplications.filter((a) => a.scholarshipId === s.id).length;

              return (
                <div
                  key={s.id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-white">{s.name}</h4>
                      <span className="text-[10px] font-mono uppercase bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        {count} Applicants
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{s.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 text-[9px] uppercase block">Min Marks</span>
                        <strong className="text-indigo-300">{s.minimumMarks.toString()}%</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 text-[9px] uppercase block">Max Income</span>
                        <strong className="text-emerald-300">₹{Number(s.maximumFamilyIncome).toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Created: {new Date(s.createdAt).toLocaleDateString()}
                    </span>

                    {/* Delete Option - strictly available for owned scholarship */}
                    <button
                      onClick={() => setDeletingScholarshipId(s.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-800 hover:border-rose-800 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Grant</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR SCHOLARSHIP DELETION */}
      {deletingScholarshipId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-sm w-full border border-rose-500/40 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Delete Scholarship Program?</h4>
              <p className="text-xs text-slate-400 mt-1">
                This will remove the grant and all associated student applications. This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2">
              <button
                onClick={() => setDeletingScholarshipId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(deletingScholarshipId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION REVIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-purple-500/40 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">Review Application</span>
                <h3 className="text-lg font-bold text-white mt-0.5">#{selectedApp.id} — {selectedApp.studentName}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Scholarship</span>
                <strong className="text-purple-300 text-xs">{selectedApp.scholarshipName}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Date</span>
                <strong className="text-slate-300 text-xs">{new Date(selectedApp.submittedAt).toLocaleDateString()}</strong>
              </div>
            </div>

            {/* Submitted Documents Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Submitted Documents & Credentials
              </h4>
              <div className="space-y-2 text-xs font-mono">
                
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="text-slate-200 font-bold">{selectedApp.marksheet?.fileName || "Academic_Marksheet.pdf"}</div>
                      <div className="text-[10px] text-slate-500">Official Marksheet • {selectedApp.marksheet?.fileSize || "1.2 MB"}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewDocument({
                      title: "Official Academic Marksheet",
                      type: "Academic Marksheet Record",
                      fileName: selectedApp.marksheet?.fileName || "Academic_Marksheet.pdf",
                      studentName: selectedApp.studentName,
                      uploadedAt: selectedApp.marksheet?.uploadedAt || selectedApp.submittedAt,
                      hash: selectedApp.marksheet?.docHash || "0xhash_marksheet_98412"
                    })}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>View Document</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-slate-200 font-bold">{selectedApp.incomeCertificate?.fileName || "Income_Certificate.pdf"}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Income Certificate • {selectedApp.incomeCertificate?.fileSize || "750 KB"}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewDocument({
                      title: "Family Income Certificate",
                      type: "Income Tax Statement Record",
                      fileName: selectedApp.incomeCertificate?.fileName || "Income_Certificate.pdf",
                      studentName: selectedApp.studentName,
                      uploadedAt: selectedApp.incomeCertificate?.uploadedAt || selectedApp.submittedAt,
                      hash: selectedApp.incomeCertificate?.docHash || "0xhash_income_43291"
                    })}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>View Document</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Rejection Form or Action Buttons */}
            {isRejecting ? (
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-700 text-white font-mono text-xs focus:outline-none"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setIsRejecting(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-800 hover:border-rose-800 text-xs font-semibold transition-all"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleVerify(selectedApp.id)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center space-x-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify Credentials</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CREATE SCHOLARSHIP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-purple-500/40 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-purple-400" />
                <span>Create Scholarship Grant</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Scholarship Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Merit Support Scholarship 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={2}
                  placeholder="Short description of target applicants..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Min Marks (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={minMarks}
                    onChange={(e) => setMinMarks(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Income (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={maxIncome}
                    onChange={(e) => setMaxIncome(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                >
                  Publish Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDocument && (
        <div className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-indigo-500/50 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">{previewDocument.title}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Student: {previewDocument.studentName}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDocument(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Certificate Viewer Card */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <span className="text-indigo-400 font-bold uppercase text-[10px] tracking-wider">OFFICIAL SUBMITTED DOCUMENT</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  ✓ VERIFIED FORMAT
                </span>
              </div>

              <div className="space-y-2.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Type:</span>
                  <span className="font-bold text-white">{previewDocument.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">File Name:</span>
                  <span className="font-bold text-indigo-300">{previewDocument.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant Name:</span>
                  <span className="font-bold text-white">{previewDocument.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uploaded Timestamp:</span>
                  <span className="text-slate-300">{new Date(previewDocument.uploadedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                  <span className="text-slate-500">Cryptographic Digest:</span>
                  <span className="text-[10px] text-purple-300 truncate max-w-[210px] font-mono">{previewDocument.hash}</span>
                </div>
              </div>

              {/* Watermark / Document Stamp */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-center space-y-1">
                <div className="text-xs font-bold text-indigo-200">MIDNIGHT NETWORK CREDENTIAL SEAL</div>
                <div className="text-[10px] text-slate-400">Off-Chain Private Document Witness Verified</div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                onClick={() => setPreviewDocument(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Close Document Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
