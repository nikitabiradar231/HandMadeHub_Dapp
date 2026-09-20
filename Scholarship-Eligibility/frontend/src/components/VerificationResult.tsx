import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { VerificationProofResult } from "../../../src/contract";
import { CheckCircle2, XCircle, ShieldCheck, Lock, Hash, ArrowLeft, Cpu, ExternalLink } from "lucide-react";

interface VerificationResultProps {
  result: VerificationProofResult;
  onReset: () => void;
  onViewInspector: () => void;
}

export const VerificationResult: React.FC<VerificationResultProps> = ({
  result,
  onReset,
  onViewInspector
}) => {
  useEffect(() => {
    if (result.isEligible) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore confetti errors if canvas fails
      }
    }
  }, [result]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      
      {/* Main Result Card */}
      <div
        className={`glass-card rounded-3xl p-8 sm:p-10 border text-center space-y-6 relative overflow-hidden ${
          result.isEligible
            ? "border-emerald-500/40 shadow-2xl shadow-emerald-950/40"
            : "border-rose-500/40 shadow-2xl shadow-rose-950/40"
        }`}
      >
        <div
          className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
            result.isEligible
              ? "bg-emerald-950/90 border border-emerald-500/40 text-emerald-400"
              : "bg-rose-950/90 border border-rose-500/40 text-rose-400"
          }`}
        >
          {result.isEligible ? (
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          ) : (
            <XCircle className="w-10 h-10" />
          )}
        </div>

        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            PUBLIC VERIFICATION RESULT
          </span>
          <h2 className="text-4xl font-black tracking-tight text-white mt-1">
            {result.isEligible ? (
              <span className="text-emerald-400">Eligible</span>
            ) : (
              <span className="text-rose-400">Not Eligible</span>
            )}
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
            {result.isEligible
              ? "Your student profile satisfies all scholarship requirements according to the verified Midnight ZK proof circuit."
              : "Your student profile does not meet the specified minimum marks or maximum income parameters."}
          </p>
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 mt-3 max-w-lg mx-auto">
            🔒 <strong>Privacy Guarantee:</strong> Your exact marks and family income are used privately during proof generation and are not revealed in the public eligibility result.
          </div>
        </div>

        {/* Proof Hash & Cryptographic Digest */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-left space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center space-x-1">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              <span>Compact ZK Proof / Transaction Hash</span>
            </span>
            <span className="font-mono text-[10px] text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
              Midnight Preview
            </span>
          </div>
          <div id="proof-hash-display" className="font-mono text-xs text-slate-200 break-all select-all bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span>{result.proofHash}</span>
            {result.proofHash && !result.proofHash.startsWith("zk_proof_") && (
              <a
                href={`https://explorer.preview.midnight.network/transaction/${result.proofHash}`}
                target="_blank"
                rel="noreferrer"
                className="ml-2 inline-flex items-center space-x-1 text-[11px] text-indigo-400 hover:text-indigo-300 underline"
              >
                <span>Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Information Visibility Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          
          {/* Public Data Column */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Public Information</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400">✓</span>
                <span>Scholarship: {result.publicState.scholarshipName}</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400">✓</span>
                <span>Status: {result.isEligible ? "Eligible" : "Not Eligible"}</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400">✓</span>
                <span>Verifications Count: {result.publicState.verificationsCount.toString()}</span>
              </li>
            </ul>
          </div>

          {/* Private Data Column */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Protected Private Data</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400">🔒</span>
                <span>Academic Marks: <strong className="text-slate-400">Private (Unexposed)</strong></span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400">🔒</span>
                <span>Family Income: <strong className="text-slate-400">Private (Unexposed)</strong></span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400">🔒</span>
                <span>Witness Location: <strong className="text-slate-400">Local Browser Only</strong></span>
              </li>
            </ul>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="reset-verification-btn"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Verify Another Student</span>
          </button>
          
          <button
            id="view-inspector-btn"
            onClick={onViewInspector}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            <Cpu className="w-4 h-4" />
            <span>Open Public Ledger Inspector</span>
          </button>
        </div>

      </div>

    </div>
  );
};
