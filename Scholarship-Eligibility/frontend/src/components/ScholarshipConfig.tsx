import React, { useState } from "react";
import { PublicLedgerState } from "../../../src/contract";
import { Award, Percent, Banknote, Edit3, Check, RefreshCw, Info } from "lucide-react";

interface ScholarshipConfigProps {
  publicState: PublicLedgerState;
  onUpdateCriteria: (name: string, minMarks: number, maxIncome: number) => void;
}

export const ScholarshipConfig: React.FC<ScholarshipConfigProps> = ({
  publicState,
  onUpdateCriteria
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(publicState.scholarshipName);
  const [minMarks, setMinMarks] = useState(Number(publicState.minimumMarks));
  const [maxIncome, setMaxIncome] = useState(Number(publicState.maximumFamilyIncome));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCriteria(name, minMarks, maxIncome);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Scholarship Eligibility Criteria
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Public rules configured by the scholarship provider on the Midnight ledger.
          </p>
        </div>

        <button
          id="toggle-edit-criteria-btn"
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-2 transition-all"
        >
          {isEditing ? (
            <>
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <span>Cancel Editing</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>Configure Requirements</span>
            </>
          )}
        </button>
      </div>

      {/* Info Alert */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-200 text-xs flex items-start space-x-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-white">Public vs. Private Rules:</strong> These criteria (Name, Min Marks %, Max Income ₹) are stored directly on the public ledger state. Students evaluate their private inputs against these public parameters using zero-knowledge circuits.
        </div>
      </div>

      {/* Display Card or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="glass-card rounded-3xl p-8 border border-indigo-500/30 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <span>Update Scholarship Requirements</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Scholarship Name
              </label>
              <input
                id="edit-scholarship-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="e.g. Merit Support Scholarship"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Minimum Marks Required (%)
                </label>
                <input
                  id="edit-min-marks"
                  type="number"
                  min="0"
                  max="100"
                  value={minMarks}
                  onChange={(e) => setMinMarks(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Maximum Family Income (₹)
                </label>
                <input
                  id="edit-max-income"
                  type="number"
                  min="0"
                  step="10000"
                  value={maxIncome}
                  onChange={(e) => setMaxIncome(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              id="save-criteria-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Ledger Parameters</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Requirement 1: Scholarship Name */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Scholarship Name
              </span>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              {publicState.scholarshipName}
            </div>
            <div className="text-xs text-indigo-300 font-mono">
              Public Ledger Identifier
            </div>
          </div>

          {/* Requirement 2: Minimum Marks */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Minimum Marks
              </span>
              <Percent className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {publicState.minimumMarks.toString()}%
            </div>
            <div className="text-xs text-purple-300 font-mono">
              Student Marks ≥ Threshold
            </div>
          </div>

          {/* Requirement 3: Maximum Income */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Max Family Income
              </span>
              <Banknote className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              ₹{Number(publicState.maximumFamilyIncome).toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-emerald-300 font-mono">
              Family Income ≤ Ceiling
            </div>
          </div>

        </div>
      )}

      {/* Metrics Summary */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Ledger Verifications Executed
          </span>
          <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
            {publicState.verificationsCount.toString()} Verification Proofs
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Latest Result Disclosed
          </span>
          <div className="mt-0.5">
            {publicState.verificationsCount === 0n ? (
              <span className="text-xs font-mono text-slate-400">No verifications yet</span>
            ) : publicState.latestVerificationResult ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Eligible
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
                Not Eligible
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
