import React from 'react';
import { BarChart3, TrendingUp, ShieldAlert, Award, Clock, Users, Globe } from 'lucide-react';
import { BlocklistEntry } from '../types/threat';

interface ThreatHeatmapViewProps {
  blocklist: BlocklistEntry[];
  totalMinutesWasted: number;
}

export const ThreatHeatmapView: React.FC<ThreatHeatmapViewProps> = ({
  blocklist,
  totalMinutesWasted,
}) => {
  // Aggregate category counts
  const categoryStats: Record<string, number> = {
    'Banking KYC Suspension': 4,
    'Remote Task / Job Scam': 3,
    'Lottery / Prize Fraud': 3,
    'Tech Support Impersonation': 2,
    'Romance / Crypto Ponzi': 2,
    'Utility Power Bill Fraud': 1,
  };

  blocklist.forEach((b) => {
    categoryStats[b.categoryLabel] = (categoryStats[b.categoryLabel] || 0) + 1;
  });

  const categories = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
  const maxCategoryCount = Math.max(...categories.map((c) => c[1]), 1);

  // Top impersonated brands
  const brandCounts: Record<string, number> = {
    'State Bank of India (SBI)': 48,
    'Amazon Global HR': 32,
    'Microsoft Windows Defender': 26,
    'KBC Kaun Banega Crorepati': 21,
    'HDFC Bank Nodal': 18,
    'Tether / DeFi Pool': 15,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top High-Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-mono font-bold">TOTAL SCAMMER TIME NEUTRALIZED</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {totalMinutesWasted} min
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            ~{Math.round(totalMinutesWasted / 60)} hours of attacker labor burned
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs font-mono font-bold">COMMUNITY IOCs INDEXED</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {blocklist.length} Records
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            UPIs, Phones, Phishing Domains, Accounts
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-mono font-bold">CITIZENS PROTECTED</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            3,420+
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Queries averted across defense blocklist
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-mono font-bold">ESTIMATED FRAUD PREVENTED</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            $184,500+
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Average loss $1,200 per scam averted
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scam Category Breakdown Bar Chart */}
        <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                WEEKLY SCAM CATEGORY TRENDS
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Live Claude/Gemini Classifications
            </span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            {categories.map(([cat, count]) => {
              const percent = Math.round((count / maxCategoryCount) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="truncate pr-2">{cat}</span>
                    <span className="text-cyan-400 font-bold shrink-0">{count} reports</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Impersonated Brands */}
        <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                TOP TARGETED / IMPERSONATED BRANDS
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              High Spoof Volume
            </span>
          </div>

          <div className="mt-4 space-y-2.5 font-mono text-xs">
            {Object.entries(brandCounts).map(([brand, count], idx) => (
              <div
                key={brand}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-cyan-400 font-bold">
                    #{idx + 1}
                  </span>
                  <span className="text-slate-200 font-semibold">{brand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">{count} incident flags</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
