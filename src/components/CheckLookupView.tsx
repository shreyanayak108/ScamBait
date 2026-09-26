import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';
import { BlocklistEntry } from '../types/threat';

interface CheckLookupViewProps {
  blocklist: BlocklistEntry[];
}

export const CheckLookupView: React.FC<CheckLookupViewProps> = ({ blocklist }) => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedEntries, setMatchedEntries] = useState<BlocklistEntry[]>([]);

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const q = query.trim().toLowerCase();
    const results = blocklist.filter((b) =>
      b.value.toLowerCase().includes(q) ||
      (b.impersonatedBrand && b.impersonatedBrand.toLowerCase().includes(q))
    );

    setMatchedEntries(results);
    setHasSearched(true);
  };

  const sampleLookups = [
    'sbi.nodaldesk@ybl',
    '+91 98762 14389',
    'sbi-kyc-portal-update24.live',
    '+1 888-492-3104',
    'TX9rW7uM4VbEq81xPnK28yL45jZq11v9B7',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Console Card */}
      <div className="bg-[#0d131f]/90 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/20">
          <Search className="w-8 h-8" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-100 font-mono tracking-wide">
          CHECK-BEFORE-YOU-TRUST LOOKUP ENGINE
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          Enter any suspicious UPI ID, phone number, website link, or bank account to instantly verify against our community threat database.
        </p>

        {/* Search input form */}
        <form onSubmit={handleLookup} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste UPI (e.g. sbi.nodaldesk@ybl), phone (+91...), or domain..."
              className="w-full bg-black/60 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 shrink-0"
          >
            <span>VERIFY SAFETY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Sample Queries */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Quick Samples:</span>
          {sampleLookups.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(sample);
                const results = blocklist.filter((b) =>
                  b.value.toLowerCase().includes(sample.toLowerCase())
                );
                setMatchedEntries(results);
                setHasSearched(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Results Card */}
      {hasSearched && (
        <div className="transition-all duration-300">
          {matchedEntries.length > 0 ? (
            /* Warning Result */
            <div className="bg-[#12080a] border-2 border-red-500/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden cyber-glow-red">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-700 text-red-400">
                    <AlertOctagon className="w-7 h-7 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                      CRITICAL WARNING: THREAT RECORD CONFIRMED
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 font-mono">
                      FLAGGED {matchedEntries.reduce((acc, m) => acc + m.flagCount, 0)} TIMES IN THREAT NETWORK
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-lg bg-red-600/30 text-red-400 border border-red-500 font-mono text-xs font-bold w-fit">
                  HIGH-RISK SCAM DETECTED
                </span>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                {matchedEntries.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-black/60 border border-red-900/60">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-bold text-red-300 select-all">{m.value}</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">
                        {m.categoryLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 text-[11px] mb-2">
                      <div>Type: <span className="text-slate-200 uppercase">{m.type}</span></div>
                      <div>Impersonating: <span className="text-cyan-300">{m.impersonatedBrand || 'N/A'}</span></div>
                      <div>Last Active: <span className="text-slate-200">{m.lastSeen}</span></div>
                    </div>

                    {m.notes && (
                      <p className="text-slate-300 text-xs font-sans bg-red-950/30 p-2.5 rounded-lg border border-red-900/40">
                        {m.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-200 font-sans">
                <strong>Advisory:</strong> Do NOT transfer any money, enter UPI PINs, or share OTPs with this recipient. Report to cybercrime.gov.in / 1930 immediately.
              </div>
            </div>
          ) : (
            /* Safe / Not Flagged Result */
            <div className="bg-[#08120c] border border-emerald-500/50 rounded-2xl p-6 shadow-2xl text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-400 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-mono">
                NO PRIOR MALICIOUS REPORTS FOUND FOR "{query}"
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1">
                This indicator is not currently flagged in our shared community threat database. However, newly created scam accounts appear daily. Always verify recipient identity through official bank portals.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
