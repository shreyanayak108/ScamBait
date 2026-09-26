import React from 'react';
import { PatternFingerprint } from '../types/threat';
import { Fingerprint, Network, Users, History, Layers } from 'lucide-react';

interface FingerprintCardProps {
  fingerprint: PatternFingerprint;
}

export const FingerprintCard: React.FC<FingerprintCardProps> = ({ fingerprint }) => {
  return (
    <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative cluster node background */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100 font-mono tracking-wide">
            SCAM PATTERN FINGERPRINT & SYNDICATE CLUSTER
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
          {fingerprint.similarityMatchPercent}% Match
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cluster identity */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>IDENTIFIED THREAT SYNDICATE</span>
          </div>
          <div className="text-sm font-bold text-slate-100 font-mono">
            {fingerprint.clusterName}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Cluster ID: <span className="text-cyan-300">{fingerprint.clusterId}</span>
          </div>
        </div>

        {/* Victim cross-correlation */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1.5">
            <Users className="w-4 h-4 text-amber-400" />
            <span>COMMUNITY CROSS-CORRELATION</span>
          </div>
          <div className="text-sm font-bold text-amber-300 font-mono">
            {fingerprint.knownVictimsTargeted}+ Users Targeted by this Script
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Reused boilerplate script across multiple spoofed numbers
          </div>
        </div>

        {/* Script Variant Family */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>VARIANT TEMPLATE FAMILY</span>
          </div>
          <div className="text-xs font-bold text-slate-200 font-mono">
            {fingerprint.variantFamily}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            First Indexed: <span className="text-slate-300">{fingerprint.firstSeenDaysAgo} days ago</span>
          </div>
        </div>

        {/* Attacker Playbook Tactics */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1.5">
            <History className="w-4 h-4 text-purple-400" />
            <span>MODUS OPERANDI (TTP)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {fingerprint.behaviorTactic}
          </p>
        </div>
      </div>
    </div>
  );
};
