import React from "react";
import { ShieldCheck, Wallet, GraduationCap, Building2, Lock, LogOut, User } from "lucide-react";
import { UserRole } from "./RoleSelector";

interface HeaderProps {
  currentRole: UserRole;
  activeTab: "student" | "provider" | "inspector";
  setActiveTab: (tab: "student" | "provider" | "inspector") => void;
  onOpenPrivacyModal: () => void;
  onOpenProfileModal: () => void;
  userName: string;
  walletState: {
    isConnected: boolean;
    address: string | null;
    balance: bigint;
    networkId: string;
  };
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  activeTab,
  setActiveTab,
  onOpenPrivacyModal,
  onOpenProfileModal,
  userName,
  walletState,
  onConnectWallet,
  onDisconnectWallet
}) => {
  const formatAddress = (addr: string | null) => {
    if (!addr) return "";
    if (addr.length > 16) {
      return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
    }
    return addr;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  Scholarship Portal
                </span>
                <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  Private Verification
                </span>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          {currentRole && (
            <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
              <button
                onClick={() => setActiveTab("student")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === "student"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Portal</span>
              </button>

              <button
                onClick={() => setActiveTab("provider")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === "provider"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Provider Dashboard</span>
              </button>

              <button
                onClick={onOpenPrivacyModal}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>How Privacy Works</span>
              </button>
            </nav>
          )}

          {/* Account Status / Connect Wallet */}
          <div className="flex items-center space-x-3">
            
            {currentRole && (
              <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 ${
                currentRole === "student"
                  ? "bg-indigo-950/80 text-indigo-300 border-indigo-800"
                  : "bg-purple-950/80 text-purple-300 border-purple-800"
              }`}>
                {currentRole === "student" ? <GraduationCap className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                <span className="capitalize">{currentRole} Account</span>
              </span>
            )}

            {/* Connect Wallet / Connected State Pill with User Profile */}
            {!walletState.isConnected || !walletState.address ? (
              <button
                onClick={onConnectWallet}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 border border-indigo-500/30 active:scale-95 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenProfileModal}
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 transition-all cursor-pointer"
                  title="View User Profile"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white max-w-[120px] truncate">{userName || "User"}</span>
                  <span className="font-mono text-slate-400 text-[11px]">({formatAddress(walletState.address)})</span>
                  <User className="w-3.5 h-3.5 text-indigo-400 ml-0.5" />
                </button>

                <button
                  onClick={onDisconnectWallet}
                  className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 rounded-xl transition-all cursor-pointer"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
