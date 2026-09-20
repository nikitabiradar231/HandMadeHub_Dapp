import React from "react";
import { Shield, Lock, CheckCircle2, X } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-indigo-500/30 space-y-5 shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>How Privacy Works</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simple Steps */}
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-indigo-300 text-xs flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>1. Secure Document Verification</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your uploaded marksheets and income certificates are verified securely by the scholarship provider to confirm authenticity.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-purple-300 text-xs flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>2. Private Eligibility Check</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your marks and income are checked directly on your device. Only your final result (Eligible or Not Eligible) is shared, keeping your exact figures private.
            </p>
          </div>
        </div>

        {/* Protection Summary Table */}
        <div className="space-y-1.5 text-xs">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Protection Summary
          </h4>
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs">
            <table className="w-full text-left font-mono">
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-2.5">Marks & Income Figures</td>
                  <td className="p-2.5 text-emerald-400 font-semibold text-right">🔒 Private to Your Device</td>
                </tr>
                <tr>
                  <td className="p-2.5">Uploaded Documents</td>
                  <td className="p-2.5 text-emerald-400 font-semibold text-right">🔒 Private & Protected</td>
                </tr>
                <tr>
                  <td className="p-2.5">Final Status</td>
                  <td className="p-2.5 text-purple-300 font-semibold text-right">Eligible / Not Eligible</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
