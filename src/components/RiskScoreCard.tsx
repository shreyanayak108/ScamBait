import React from 'react';
import { AnalysisResult } from '../types/threat';
import { AlertOctagon, AlertTriangle, ShieldCheck, Share2, ShieldAlert } from 'lucide-react';

interface RiskScoreCardProps {
  result: AnalysisResult;
  onOpenShareModal: () => void;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ result, onOpenShareModal }) => {
  const { riskScore, threatLevel, categoryLabel, justification, recommendedAction } = result;

  // Determine color scheme
  let colorClass = 'text-red-400 border-red-500/40 bg-red-950/20';
  let ringColor = '#ef4444';
  let glowClass = 'cyber-glow-red';

  if (riskScore < 40) {
    colorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    ringColor = '#22c55e';
    glowClass = '';
  } else if (riskScore < 75) {
    colorClass = 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    ringColor = '#f59e0b';
    glowClass = 'cyber-glow-amber';
  }

  // Circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className={`bg-[#0d131f]/90 border rounded-2xl p-6 shadow-2xl relative overflow-hidden ${colorClass.split(' ')[1]} ${glowClass}`}>
      {/* Background cyber watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
        <ShieldAlert className="w-64 h-64 text-slate-100" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Risk Score Ring Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={ringColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center text */}
          <div className="absolute flex flex-col items-center justify-center text-center font-mono">
            <span className="text-3xl font-black text-slate-100 tracking-tight">
              {riskScore}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              / 100 RISK
            </span>
          </div>
        </div>

        {/* Text Details & Justification */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 ${colorClass}`}>
              {threatLevel === 'CRITICAL' && <AlertOctagon className="w-3.5 h-3.5" />}
              {threatLevel === 'HIGH' && <AlertTriangle className="w-3.5 h-3.5" />}
              {threatLevel === 'MEDIUM' && <AlertTriangle className="w-3.5 h-3.5" />}
              {threatLevel === 'LOW' && <ShieldCheck className="w-3.5 h-3.5" />}
              {threatLevel} THREAT LEVEL
            </span>

            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-slate-800 text-cyan-300 border border-slate-700">
              {categoryLabel}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-100 font-mono tracking-wide mb-1.5">
            Threat Intelligence Verdict
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {justification}
          </p>

          {/* Recommended Action & Share Warning Card Button */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="text-cyan-400 font-bold">Action:</span>
              <span className="text-slate-300 line-clamp-1">{recommendedAction}</span>
            </div>

            <button
              onClick={onOpenShareModal}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
              title="Create high-contrast warning card for WhatsApp family groups"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Generate Warning Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
