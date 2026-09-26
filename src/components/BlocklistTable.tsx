import React, { useState } from 'react';
import { BlocklistEntry } from '../types/threat';
import { Search, Filter, ShieldAlert, ArrowUpDown, Copy, Check, ExternalLink } from 'lucide-react';

interface BlocklistTableProps {
  entries: BlocklistEntry[];
  onRefresh: () => void;
}

export const BlocklistTable: React.FC<BlocklistTableProps> = ({ entries, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.value.toLowerCase().includes(search.toLowerCase()) ||
      e.categoryLabel.toLowerCase().includes(search.toLowerCase()) ||
      (e.impersonatedBrand && e.impersonatedBrand.toLowerCase().includes(search.toLowerCase())) ||
      (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
              SHARED COMMUNITY THREAT BLOCKLIST
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Anonymized indicators extracted by ScamBait traps to protect citizens before transactions occur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search UPI, Phone, URL..."
              className="bg-black/60 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono w-48 sm:w-64"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-black/60 border border-slate-700 rounded-xl p-1 text-xs font-mono">
            {['all', 'upi', 'phone', 'url', 'bank', 'wallet'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-0.5 rounded-lg uppercase ${
                  typeFilter === t
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-3 px-3">TYPE</th>
              <th className="py-3 px-3">INDICATOR VALUE</th>
              <th className="py-3 px-3">CATEGORY / BRAND</th>
              <th className="py-3 px-3">THREAT LEVEL</th>
              <th className="py-3 px-3 text-center">FLAGGED</th>
              <th className="py-3 px-3">LAST SEEN</th>
              <th className="py-3 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No matching threat indicators found.
                </td>
              </tr>
            ) : (
              filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Type */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-cyan-400 border border-slate-700">
                      {entry.type}
                    </span>
                  </td>

                  {/* Value */}
                  <td className="py-3 px-3 font-semibold text-slate-200 select-all max-w-[220px] truncate">
                    {entry.value}
                  </td>

                  {/* Category & Brand */}
                  <td className="py-3 px-3">
                    <span className="text-slate-300 block">{entry.categoryLabel}</span>
                    {entry.impersonatedBrand && (
                      <span className="text-[10px] text-slate-500 block truncate">
                        Spoofing: {entry.impersonatedBrand}
                      </span>
                    )}
                  </td>

                  {/* Threat Level */}
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        entry.threatLevel === 'CRITICAL'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : entry.threatLevel === 'HIGH'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {entry.threatLevel}
                    </span>
                  </td>

                  {/* Flag Count */}
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 font-bold border border-cyan-800">
                      {entry.flagCount}x
                    </span>
                  </td>

                  {/* Last Seen */}
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {entry.lastSeen}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleCopy(entry.id, entry.value)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors inline-flex items-center gap-1"
                      title="Copy indicator"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
