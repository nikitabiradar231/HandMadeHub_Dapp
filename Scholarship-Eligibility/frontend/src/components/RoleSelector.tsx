import React from "react";
import { GraduationCap, Building2, ArrowRight, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export type UserRole = "student" | "provider" | null;

interface RoleSelectorProps {
  onSelectRole: (role: "student" | "provider") => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        
        {/* Header Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Select your portal to <span className="gradient-text">get started</span>
          </h1>

          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Simple, secure, and private scholarship verification. Role selection is permanently linked to your wallet identity.
          </p>
        </div>

        {/* Permanent Role Notice */}
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-3 text-xs text-amber-300 max-w-xl mx-auto font-medium">
          ⚠️ <strong>Permanent Account Role Binding:</strong> Selecting a role permanently registers your active wallet address. A Student account cannot later become a Scholarship Provider, and vice versa.
        </div>

        {/* Two Simple Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* Option 1: Student */}
          <div
            onClick={() => onSelectRole("student")}
            className="group relative cursor-pointer glass-card rounded-3xl p-6 border border-indigo-500/30 hover:border-indigo-400 transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <GraduationCap className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                  For Students
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5 group-hover:text-indigo-200 transition-colors">
                  I am a Student
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Browse available scholarships, upload your documents, and check your eligibility privately.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Browse scholarships & requirements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Upload required documents</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Check eligibility securely</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-white">
              <span>Enter Student Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Option 2: Scholarship Provider */}
          <div
            onClick={() => onSelectRole("provider")}
            className="group relative cursor-pointer glass-card rounded-3xl p-6 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Building2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">
                  For Organizations
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5 group-hover:text-purple-200 transition-colors">
                  I am a Scholarship Provider
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Create scholarship programs, set criteria, and review applicant documents.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Create new scholarship programs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Set marks & income criteria</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Review & verify applicant credentials</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-white">
              <span>Enter Provider Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Security Banner */}
        <div className="glass-card rounded-2xl p-3 border border-slate-800 flex items-center justify-center space-x-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>🔒 Your personal information remains private and protected at all times.</span>
        </div>

      </div>
    </div>
  );
};
