import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  BrainCircuit, 
  Network, 
  Lock, 
  Terminal, 
  PlusCircle, 
  RefreshCw,
  TrendingUp,
  Brain,
  Smile,
  User,
  Key
} from 'lucide-react';
import { VaultMetadata } from '../types';

export type AppTab = 
  | 'dashboard' 
  | 'inputs' 
  | 'visualizations' 
  | 'psychology' 
  | 'synthesis' 
  | 'mapping' 
  | 'vault' 
  | 'architecture';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  vaultMeta: VaultMetadata;
  onToggleLock: () => void;
  onOpenLogger: () => void;
  onResetSeedData: () => void;
  onOpenProfile: () => void;
  userDisplayName?: string;
  isLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  vaultMeta,
  onToggleLock,
  onOpenLogger,
  onResetSeedData,
  onOpenProfile,
  userDisplayName = 'Abhi',
  isLoggedIn = true,
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-950/40">
              <Activity className="w-5 h-5 text-stone-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg tracking-tight text-white">AuraSync</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  E2EE v2.4
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Behavioral &amp; Lifecycle Synthesizer
              </p>
            </div>
          </div>

          {/* Primary Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              id="nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-inputs"
              onClick={() => setActiveTab('inputs')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'inputs'
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Smile className="w-3.5 h-3.5 text-emerald-400" />
              <span>Data Input</span>
            </button>

            <button
              id="nav-visualizations"
              onClick={() => setActiveTab('visualizations')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'visualizations'
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Visualizations</span>
            </button>

            <button
              id="nav-psychology"
              onClick={() => setActiveTab('psychology')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'psychology'
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>Life Eras &amp; Psychology</span>
            </button>

            <button
              id="nav-synthesis"
              onClick={() => setActiveTab('synthesis')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'synthesis'
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Synthesis</span>
            </button>

            <button
              id="nav-mapping"
              onClick={() => setActiveTab('mapping')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'mapping'
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-rose-400" />
              <span>Mapping</span>
            </button>

            <button
              id="nav-vault"
              onClick={() => setActiveTab('vault')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Vault</span>
            </button>

            <button
              id="nav-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-300" />
              <span>Architecture</span>
            </button>
          </nav>

          {/* Action Tools, Profile & Vault Status */}
          <div className="flex items-center space-x-2">
            {/* User Profile / Auth Button */}
            <button
              id="btn-user-profile"
              onClick={onOpenProfile}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px]">
                {userDisplayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline">{userDisplayName}</span>
            </button>

            {/* Vault Status Pill */}
            <button
              id="vault-status-toggle"
              onClick={onToggleLock}
              title={vaultMeta.isLocked ? "Vault is Locked - Click to unlock with passphrase" : "Vault is Unlocked with AES-256 key active in memory"}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                vaultMeta.isLocked
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              {vaultMeta.isLocked ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden md:inline">Locked</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">E2EE Active</span>
                </>
              )}
            </button>

            {/* Quick Log Entry Button */}
            <button
              id="btn-quick-log"
              onClick={onOpenLogger}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Snapshot</span>
            </button>

            {/* Reset Data Button */}
            <button
              id="btn-reset-seed"
              onClick={onResetSeedData}
              title="Reset sample longitudinal dataset"
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Navigation */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 border-t border-stone-800 space-x-1 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('inputs')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'inputs' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400'
            }`}
          >
            Data Input
          </button>
          <button
            onClick={() => setActiveTab('visualizations')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'visualizations' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400'
            }`}
          >
            Charts &amp; Visuals
          </button>
          <button
            onClick={() => setActiveTab('psychology')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'psychology' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400'
            }`}
          >
            Life Eras &amp; Psychology
          </button>
          <button
            onClick={() => setActiveTab('synthesis')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'synthesis' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400'
            }`}
          >
            AI Synthesis
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'mapping' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400'
            }`}
          >
            Data Mapping
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'vault' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400'
            }`}
          >
            E2EE Vault
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture' ? 'bg-stone-800 text-white font-medium' : 'text-stone-400'
            }`}
          >
            Architecture
          </button>
        </div>
      </div>
    </header>
  );
};
