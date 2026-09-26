import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Terminal, Search, Lock } from 'lucide-react';

export const AnalysisSkeleton: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Parsing payload & calculating linguistic deception heuristics...',
    'Extracting Indicators of Compromise (UPI IDs, mule bank accounts, phishing URLs)...',
    'Correlating telemetry with Jamtara & Southeast Asia syndicate clusters...',
    'Generating psychological vulnerability resistance profile...',
    'Synthesizing autonomous scam-baiting counter-narrative...',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 bg-[#0d131f]/90 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top glowing bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/60 shadow-lg shadow-cyan-500/20">
            <Cpu className="w-7 h-7 text-cyan-400 animate-spin" />
            <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-ping"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ACTIVE PIPELINE
              </span>
              <span className="text-sm font-bold text-slate-100 font-mono">
                SCAMBAIT THREAT ANALYSIS ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Evaluating social engineering indicators and baiting vectors...
            </p>
          </div>
        </div>

        {/* Live step indicator */}
        <div className="w-full md:w-auto flex flex-col items-end">
          <span className="text-xs font-mono text-cyan-400 font-semibold mb-1">
            Step {stepIndex + 1} of {steps.length}
          </span>
          <div className="w-full md:w-64 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Terminal step logs */}
      <div className="mt-6 p-4 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs space-y-2">
        {steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 transition-opacity duration-300 ${
                isDone
                  ? 'text-cyan-400'
                  : isCurrent
                  ? 'text-slate-100 font-bold'
                  : 'text-slate-600'
              }`}
            >
              {isDone ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0"></div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"></div>
              )}
              <span className="line-clamp-1">{step}</span>
            </div>
          );
        })}
      </div>

      {/* Skeletons simulating threat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="h-32 rounded-xl bg-slate-900/60 border border-slate-800/80 animate-pulse p-4 flex flex-col justify-between">
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="h-10 bg-slate-800/60 rounded-full w-24 mx-auto"></div>
          <div className="h-3 bg-slate-800/40 rounded w-3/4"></div>
        </div>
        <div className="h-32 rounded-xl bg-slate-900/60 border border-slate-800/80 animate-pulse p-4 flex flex-col justify-between">
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-800/60 rounded w-full"></div>
            <div className="h-3 bg-slate-800/40 rounded w-5/6"></div>
          </div>
          <div className="h-3 bg-slate-800/30 rounded w-1/2"></div>
        </div>
        <div className="h-32 rounded-xl bg-slate-900/60 border border-slate-800/80 animate-pulse p-4 flex flex-col justify-between">
          <div className="h-4 bg-slate-800 rounded w-2/3"></div>
          <div className="h-8 bg-slate-800/60 rounded w-full"></div>
          <div className="h-3 bg-slate-800/40 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};
