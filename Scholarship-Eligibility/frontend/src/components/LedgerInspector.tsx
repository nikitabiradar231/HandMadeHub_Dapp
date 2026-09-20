import React, { useState } from "react";
import { PublicLedgerState } from "../../../src/contract";
import { Cpu, Shield, Database, Lock, CheckCircle2, Code2, Terminal, Eye, EyeOff } from "lucide-react";

interface LedgerInspectorProps {
  publicState: PublicLedgerState;
  contractAddress: string;
}

export const LedgerInspector: React.FC<LedgerInspectorProps> = ({
  publicState,
  contractAddress
}) => {
  const [activeView, setActiveView] = useState<"visual" | "json">("visual");

  const formattedState = JSON.stringify(
    publicState,
    (key, value) => (typeof value === "bigint" ? value.toString() : value),
    2
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Cpu className="w-8 h-8 text-indigo-400" />
            <span>Public Ledger & Privacy Inspector</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time inspection of Midnight blockchain ledger state vs off-chain private student witnesses.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            id="view-visual-tab"
            onClick={() => setActiveView("visual")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === "visual"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Visual Comparison
          </button>
          <button
            id="view-json-tab"
            onClick={() => setActiveView("json")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === "json"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Raw Ledger JSON
          </button>
        </div>
      </div>

      {/* Contract Address Banner */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>Contract Address:</span>
          <code className="font-mono text-indigo-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 select-all">
            {contractAddress}
          </code>
        </div>
        <div className="flex items-center space-x-2 text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Midnight VM Runtime Active</span>
        </div>
      </div>

      {activeView === "visual" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Public Ledger State Panel */}
          <div className="glass-card rounded-3xl p-6 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <span>Public Ledger State</span>
              </h3>
              <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 flex items-center space-x-1">
                <Eye className="w-3 h-3 text-indigo-400" />
                <span>Visible On-Chain</span>
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">scholarshipName</span>
                <span className="text-indigo-300 font-bold">"{publicState.scholarshipName}"</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">minimumMarks</span>
                <span className="text-indigo-300 font-bold">{publicState.minimumMarks.toString()}%</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">maximumFamilyIncome</span>
                <span className="text-indigo-300 font-bold">₹{Number(publicState.maximumFamilyIncome).toLocaleString()}</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">credentialVerificationStatus</span>
                <span className="text-purple-300 font-bold">"{publicState.credentialVerificationStatus}"</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">verificationsCount</span>
                <span className="text-indigo-300 font-bold">{publicState.verificationsCount.toString()}</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">latestVerificationResult</span>
                <span className={`font-bold ${publicState.latestVerificationResult ? "text-emerald-400" : "text-rose-400"}`}>
                  {publicState.latestVerificationResult ? "true (Eligible)" : "false (Not Eligible)"}
                </span>
              </div>
            </div>
          </div>

          {/* Private Witness & Document Engine Panel */}
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span>Private Witness & Documents</span>
              </h3>
              <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 flex items-center space-x-1">
                <EyeOff className="w-3 h-3 text-emerald-400" />
                <span>100% Unexposed</span>
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-950 flex justify-between items-center">
                <span className="text-slate-400">witness studentMarks()</span>
                <span className="text-emerald-400 font-bold">🔒 Local Client Memory Only</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-950 flex justify-between items-center">
                <span className="text-slate-400">witness studentIncome()</span>
                <span className="text-emerald-400 font-bold">🔒 Local Client Memory Only</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-950 flex justify-between items-center">
                <span className="text-slate-400">Academic Marksheet PDF</span>
                <span className="text-emerald-400 font-bold">🔒 Never Stored On-Chain</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-950 flex justify-between items-center">
                <span className="text-slate-400">Income Certificate PDF</span>
                <span className="text-emerald-400 font-bold">🔒 Never Stored On-Chain</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-950 flex justify-between items-center">
                <span className="text-slate-400">ZK Proof Generation</span>
                <span className="text-indigo-400 font-bold">Local Prover Circuit</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span className="flex items-center space-x-1.5 font-mono">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Public State JSON Payload</span>
            </span>
            <span className="font-mono text-[10px]">utf-8</span>
          </div>
          <pre id="raw-ledger-json" className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-indigo-300 overflow-x-auto border border-slate-800">
            {formattedState}
          </pre>
        </div>
      )}

    </div>
  );
};
