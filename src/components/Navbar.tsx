import React from 'react';
import { ShieldAlert, Terminal, Database, Search, BarChart3, Clock, Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'blocklist' | 'lookup' | 'trends';
  setActiveTab: (tab: 'analyzer' | 'blocklist' | 'lookup' | 'trends') => void;
  minutesWasted: number;
  threatsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  minutesWasted,
  threatsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-cyan-900/40 bg-[#0a0e14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-slate-100 font-mono">
                  SCAM<span className="text-cyan-400">BAIT</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                  Cyber Defense v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Threat Intelligence & Countermeasure Engine
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Analyzer & Bait</span>
            </button>

            <button
              onClick={() => setActiveTab('blocklist')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'blocklist'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Threat Blocklist</span>
              {threatsCount > 0 && (
                <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                  {threatsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'lookup'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Check Lookup</span>
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'trends'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Threat Heatmap</span>
            </button>
          </nav>

          {/* Gamified Live Counter Badge */}
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Clock className="w-4 h-4 animate-spin-slow" />
              <div className="text-left font-mono">
                <span className="text-xs font-bold">{minutesWasted} min</span>
                <span className="text-[10px] block text-emerald-400/80 -mt-0.5">Scammer Time Wasted</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400/90">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>DEFENSE ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
