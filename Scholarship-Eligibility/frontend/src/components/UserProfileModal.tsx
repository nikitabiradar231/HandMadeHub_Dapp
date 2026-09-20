import React, { useState, useEffect } from "react";
import { User, Wallet, Shield, Check, Copy, X, GraduationCap, Building2 } from "lucide-react";
import { UserRole } from "./RoleSelector";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: {
    isConnected: boolean;
    address: string | null;
    shieldedAddress: string | null;
    unshieldedAddress: string | null;
    dustAddress: string | null;
    networkId: string;
    walletName: string | null;
  };
  currentRole: UserRole;
  userName: string;
  onSaveUserName: (newName: string) => void;
  onDisconnect: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  walletState,
  currentRole,
  userName,
  onSaveUserName,
  onDisconnect
}) => {
  const [nameInput, setNameInput] = useState(userName || "");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setNameInput(userName || "");
  }, [userName, isOpen]);

  if (!isOpen || !walletState.address) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onSaveUserName(nameInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              {userName || "User Profile"}
            </h3>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border flex items-center space-x-1 ${
                currentRole === "student"
                  ? "bg-indigo-950 text-indigo-300 border-indigo-800"
                  : "bg-purple-950 text-purple-300 border-purple-800"
              }`}>
                {currentRole === "student" ? <GraduationCap className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                <span>{currentRole || "Unassigned"}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {walletState.walletName || "Midnight Wallet"} • <span className="text-emerald-400 font-bold uppercase">{walletState.networkId || "preprod"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Address Types Section */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Connected Address Types
          </h4>

          {/* 1. Shielded Address */}
          {walletState.shieldedAddress && (
            <div className="p-3 bg-slate-950 border border-indigo-900/60 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-indigo-400 font-bold uppercase">Shielded address</span>
                <button
                  onClick={() => handleCopy(walletState.shieldedAddress!, "shielded")}
                  className="text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  {copiedKey === "shielded" ? (
                    <span className="text-emerald-400 text-[10px]">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-white truncate">{walletState.shieldedAddress}</p>
            </div>
          )}

          {/* 2. Unshielded Address */}
          {walletState.unshieldedAddress && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-amber-400 font-bold uppercase">Unshielded address</span>
                <button
                  onClick={() => handleCopy(walletState.unshieldedAddress!, "unshielded")}
                  className="text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  {copiedKey === "unshielded" ? (
                    <span className="text-emerald-400 text-[10px]">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-300 truncate">{walletState.unshieldedAddress}</p>
            </div>
          )}

          {/* 3. DUST Address */}
          {walletState.dustAddress && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-purple-400 font-bold uppercase">DUST address</span>
                <button
                  onClick={() => handleCopy(walletState.dustAddress!, "dust")}
                  className="text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  {copiedKey === "dust" ? (
                    <span className="text-emerald-400 text-[10px]">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-300 truncate">{walletState.dustAddress}</p>
            </div>
          )}
        </div>

        {/* Edit Username Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Display User Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name or organization"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/60 rounded-xl transition-all cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
