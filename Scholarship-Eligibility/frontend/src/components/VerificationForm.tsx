import React, { useState } from "react";
import { Lock, Shield, Cpu, Sparkles, CheckCircle, AlertCircle, ArrowRight, KeyRound } from "lucide-react";
import { PublicLedgerState, VerificationProofResult } from "../../../src/contract";

interface VerificationFormProps {
  publicState: PublicLedgerState;
  onRunVerification: (marks: number, income: number) => VerificationProofResult | Promise<VerificationProofResult>;
  onVerificationComplete: (result: VerificationProofResult) => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  publicState,
  onRunVerification,
  onVerificationComplete
}) => {
  const [marks, setMarks] = useState<number | "">(82);
  const [income, setIncome] = useState<number | "">(250000);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (marks === "" || income === "") return;

    setIsEvaluating(true);

    try {
      const proofResult = await onRunVerification(Number(marks), Number(income));
      setIsEvaluating(false);
      onVerificationComplete(proofResult);
    } catch (err: any) {
      setIsEvaluating(false);
      alert(`Proof Generation Error: ${err?.message || err}`);
    }
  };

  const loadPreset = (presetMarks: number, presetIncome: number) => {
    setMarks(presetMarks);
    setIncome(presetIncome);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800/60 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Local Witness Context</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Private Eligibility Verification
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Enter your academic and financial information below. Your exact inputs are processed strictly inside your local browser ZK witness engine.
        </p>
      </div>

      {/* Quick Test Presets */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Test Presets (Standard Verification Scenarios)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            id="preset-eligible-btn"
            type="button"
            onClick={() => loadPreset(85, 250000)}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-white group-hover:text-indigo-300">
              1. Eligible Student
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Marks: 85% | ₹2.5L
            </div>
          </button>

          <button
            id="preset-lowmarks-btn"
            type="button"
            onClick={() => loadPreset(60, 250000)}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-white group-hover:text-indigo-300">
              2. Low Marks
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Marks: 60% | ₹2.5L
            </div>
          </button>

          <button
            id="preset-highincome-btn"
            type="button"
            onClick={() => loadPreset(85, 800000)}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-white group-hover:text-indigo-300">
              3. Income High
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Marks: 85% | ₹8.0L
            </div>
          </button>

          <button
            id="preset-boundary-btn"
            type="button"
            onClick={() => loadPreset(70, 500000)}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-white group-hover:text-indigo-300">
              4. Boundary
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Marks: 70% | ₹5.0L
            </div>
          </button>
        </div>
      </div>

      {/* Main Verification Form */}
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 border border-indigo-500/30 space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <Shield className="w-5 h-5" />
            <span>Target: {publicState.scholarshipName}</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Min {publicState.minimumMarks.toString()}% | Max ₹{Number(publicState.maximumFamilyIncome).toLocaleString()}
          </div>
        </div>

        {/* Private Student Inputs */}
        <div className="space-y-6">
          
          {/* Input 1: Marks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Academic Marks (%)</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                🔒 Private Input
              </span>
            </div>
            <input
              id="student-marks-input"
              type="number"
              min="0"
              max="100"
              value={marks}
              onChange={(e) => setMarks(e.target.value === "" ? "" : Number(e.target.value))}
              required
              placeholder="Enter your academic percentage e.g. 82"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Input 2: Income */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Annual Family Income (₹)</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                🔒 Private Input
              </span>
            </div>
            <input
              id="student-income-input"
              type="number"
              min="0"
              step="5000"
              value={income}
              onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
              required
              placeholder="Enter annual family income e.g. 250000"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

        </div>

        {/* Submit Execution Button */}
        <div className="pt-2">
          <button
            id="run-circuit-btn"
            type="submit"
            disabled={isEvaluating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-3 transition-all transform active:scale-98 disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <Cpu className="w-5 h-5 animate-spin text-cyan-200" />
                <span>Executing Compact ZK Circuit & Generating Proof...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-5 h-5" />
                <span>Verify Eligibility via Midnight ZK Circuit</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
