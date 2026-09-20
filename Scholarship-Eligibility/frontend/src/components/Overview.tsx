import React from "react";
import { Shield, Lock, CheckCircle2, ArrowRight, GraduationCap, Building2 } from "lucide-react";

interface OverviewProps {
  onStartVerification: () => void;
}

export const Overview: React.FC<OverviewProps> = ({ onStartVerification }) => {
  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-card border border-indigo-500/20 p-8 sm:p-10 text-center">
        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Apply for Scholarships with <span className="gradient-text">Complete Privacy</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Verify scholarship eligibility without publicly revealing your exact academic marks or annual family income.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onStartVerification}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <span>Explore Scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Step Simple Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold text-sm">
            1
          </div>
          <h3 className="text-base font-bold text-white">Apply & Upload Documents</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Submit your marksheets and income certificate securely for provider verification.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400 font-bold text-sm">
            2
          </div>
          <h3 className="text-base font-bold text-white">Provider Verification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The scholarship provider confirms your credentials are authentic and valid.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold text-sm">
            3
          </div>
          <h3 className="text-base font-bold text-white">Private Eligibility Result</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Check your eligibility results privately without exposing raw financial or academic numbers.
          </p>
        </div>

      </div>

    </div>
  );
};
