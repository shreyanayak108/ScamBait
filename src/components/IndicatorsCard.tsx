import React, { useState } from 'react';
import { Indicators } from '../types/threat';
import { CreditCard, Phone, Globe, Building2, ShieldAlert, Coins, Copy, Check, ExternalLink } from 'lucide-react';

interface IndicatorsCardProps {
  indicators: Indicators;
  threatLevel: string;
}

export const IndicatorsCard: React.FC<IndicatorsCardProps> = ({ indicators, threatLevel }) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(text);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const hasAnyIndicators =
    indicators.upiIds.length > 0 ||
    indicators.phoneNumbers.length > 0 ||
    indicators.urls.length > 0 ||
    indicators.bankAccounts.length > 0 ||
    indicators.brandsImpersonated.length > 0 ||
    indicators.cryptoWallets.length > 0;

  const totalCount =
    indicators.upiIds.length +
    indicators.phoneNumbers.length +
    indicators.urls.length +
    indicators.bankAccounts.length +
    indicators.brandsImpersonated.length +
    indicators.cryptoWallets.length;

  return (
    <div className="bg-[#0d131f]/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100 font-mono tracking-wide">
            ACTIONABLE INDICATORS OF COMPROMISE (IOCs)
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
          {totalCount} IOCs Neutralized
        </span>
      </div>

      {!hasAnyIndicators ? (
        <div className="py-8 text-center text-slate-400 font-mono text-xs">
          No specific machine-readable indicators detected in this sample.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* UPI IDs */}
          {indicators.upiIds.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  FRAUDULENT UPI IDENTIFIERS
                </span>
                <span className="text-[10px] bg-red-950/80 text-red-400 px-1.5 py-0.2 rounded border border-red-800">
                  CRITICAL TRAP
                </span>
              </div>
              <div className="space-y-1.5">
                {indicators.upiIds.map((upi, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-black/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono group"
                  >
                    <span className="text-red-300 font-semibold select-all truncate">{upi}</span>
                    <button
                      onClick={() => handleCopy(upi)}
                      className="text-slate-400 hover:text-cyan-300 p-1 transition-colors"
                      title="Copy UPI ID"
                    >
                      {copiedValue === upi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phone Numbers */}
          {indicators.phoneNumbers.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  VISHING / SENDER PHONE NUMBERS
                </span>
                <span className="text-[10px] bg-amber-950/80 text-amber-400 px-1.5 py-0.2 rounded border border-amber-800">
                  SPOOFED SIM
                </span>
              </div>
              <div className="space-y-1.5">
                {indicators.phoneNumbers.map((phone, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-black/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono group"
                  >
                    <span className="text-amber-300 font-semibold select-all truncate">{phone}</span>
                    <button
                      onClick={() => handleCopy(phone)}
                      className="text-slate-400 hover:text-cyan-300 p-1 transition-colors"
                      title="Copy Phone Number"
                    >
                      {copiedValue === phone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phishing URLs */}
          {indicators.urls.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  PHISHING & MALICIOUS DOMAINS
                </span>
                <span className="text-[10px] bg-red-950/80 text-red-400 px-1.5 py-0.2 rounded border border-red-800">
                  CREDENTIAL HARVESTER
                </span>
              </div>
              <div className="space-y-1.5">
                {indicators.urls.map((url, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-black/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono group"
                  >
                    <span className="text-red-300 font-semibold select-all truncate max-w-[240px] sm:max-w-xs">{url}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(url)}
                        className="text-slate-400 hover:text-cyan-300 p-1 transition-colors"
                        title="Copy URL"
                      >
                        {copiedValue === url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank Accounts / IFSC */}
          {indicators.bankAccounts.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  MULE BANK ACCOUNTS / IFSC
                </span>
                <span className="text-[10px] bg-purple-950/80 text-purple-400 px-1.5 py-0.2 rounded border border-purple-800">
                  FUNNEL RECEPTACLE
                </span>
              </div>
              <div className="space-y-1.5">
                {indicators.bankAccounts.map((ac, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-black/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono group"
                  >
                    <span className="text-purple-300 font-semibold select-all truncate">{ac}</span>
                    <button
                      onClick={() => handleCopy(ac)}
                      className="text-slate-400 hover:text-cyan-300 p-1 transition-colors"
                      title="Copy Account Information"
                    >
                      {copiedValue === ac ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impersonated Brands */}
          {indicators.brandsImpersonated.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  IMPERSONATED BRANDS & AGENCIES
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                  AUTHORITY HIJACK
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {indicators.brandsImpersonated.map((brand, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-200"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Crypto Wallets */}
          {indicators.cryptoWallets.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  CRYPTOCURRENCY DEPOSIT WALLETS
                </span>
                <span className="text-[10px] bg-amber-950/80 text-amber-400 px-1.5 py-0.2 rounded border border-amber-800">
                  ANONYMOUS DRAIN
                </span>
              </div>
              <div className="space-y-1.5">
                {indicators.cryptoWallets.map((wallet, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-black/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono group"
                  >
                    <span className="text-amber-300 font-semibold select-all truncate">{wallet}</span>
                    <button
                      onClick={() => handleCopy(wallet)}
                      className="text-slate-400 hover:text-cyan-300 p-1 transition-colors"
                      title="Copy Wallet Address"
                    >
                      {copiedValue === wallet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
