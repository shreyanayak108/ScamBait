import React from 'react';
import { TriggeredPhrase } from '../types/threat';
import { Eye, AlertCircle, Brain, Zap } from 'lucide-react';

interface ExplainabilityCardProps {
  triggeredPhrases: TriggeredPhrase[];
  psychologicalTriggers: string[];
  urgencyTactics: string[];
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({
  triggeredPhrases,
  psychologicalTriggers,
  urgencyTactics,
}) => {
  return (
    <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100 font-mono tracking-wide">
            TRANSPARENCY & EXPLAINABILITY REASONING
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
          Whitebox Threat Audit
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Triggered phrases breakdown */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>EXACT PHRASES TRIGGERING RISK EVALUATION</span>
          </div>

          <div className="space-y-2">
            {triggeredPhrases.map((tp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-red-300 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/60 select-all">
                    "{tp.phrase}"
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      tp.severity === 'high'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {tp.severity} flag
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans mt-1">
                  {tp.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Psychological & Urgency Manipulation Framework */}
        <div className="space-y-4">
          {/* Psychological Triggers */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>COGNITIVE MANIPULATION VECTORS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {psychologicalTriggers.map((trig, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/80 text-purple-200 text-xs font-mono"
                >
                  ⚠️ {trig}
                </span>
              ))}
            </div>
          </div>

          {/* Urgency & Pressure Tactics */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>MANUFACTURED URGENCY TACTICS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {urgencyTactics.map((urg, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs font-mono"
                >
                  ⏳ {urg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
