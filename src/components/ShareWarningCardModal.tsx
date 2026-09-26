import React, { useState } from 'react';
import { AnalysisResult } from '../types/threat';
import { X, Copy, Check, Share2, ShieldAlert, AlertOctagon } from 'lucide-react';

interface ShareWarningCardModalProps {
  result: AnalysisResult;
  onClose: () => void;
}

export const ShareWarningCardModal: React.FC<ShareWarningCardModalProps> = ({ result, onClose }) => {
  const [copiedText, setCopiedText] = useState(false);

  const mainIndicator =
    result.indicators.upiIds[0] ||
    result.indicators.phoneNumbers[0] ||
    result.indicators.urls[0] ||
    result.indicators.bankAccounts[0] ||
    'Suspicious Threat Actor';

  const indicatorType =
    result.indicators.upiIds.length > 0
      ? 'UPI ID'
      : result.indicators.phoneNumbers.length > 0
      ? 'PHONE NUMBER'
      : result.indicators.urls.length > 0
      ? 'MALICIOUS WEBSITE'
      : result.indicators.bankAccounts.length > 0
      ? 'BANK ACCOUNT'
      : 'THREAT ACTOR';

  const shareableText = `🚨 *CYBER FRAUD SCAM ALERT* 🚨
⚠️ *DO NOT TRANSFER MONEY OR CLICK LINKS!*

The following ${indicatorType} has been confirmed as a *${result.threatLevel} RISK* cyber scam by ScamBait Threat Intelligence:

📍 *Targeted Entity:* ${mainIndicator}
🏷️ *Scam Category:* ${result.categoryLabel}
📊 *Fraud Confidence Score:* ${result.riskScore}/100
🛡️ *What Scammers Say:* "${result.triggeredPhrases[0]?.phrase || 'Urgent payment required'}"

*Security Advice:* Do NOT send money, do NOT share OTPs, and warn your family members! Report this to 1930 or local cyber police.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0b1019] border border-cyan-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-4">
          <Share2 className="w-4 h-4" />
          <span>SHAREABLE COMMUNITY SECURITY ADVISORY</span>
        </div>

        {/* Warning Card Preview */}
        <div className="rounded-2xl border-2 border-red-500/80 bg-gradient-to-b from-red-950/60 to-black p-5 text-center shadow-xl relative">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-600/30 border border-red-500 text-red-400 mb-3 shadow-lg shadow-red-600/30">
            <AlertOctagon className="w-8 h-8 animate-pulse" />
          </div>

          <div className="text-[11px] font-mono tracking-widest uppercase font-bold text-red-400">
            ⚠️ OFFICIAL SCAMBAIT CYBER ALERT ⚠️
          </div>

          <h2 className="text-xl font-black text-slate-100 font-mono mt-1">
            DO NOT INTERACT OR TRANSFER FUNDS
          </h2>

          <div className="my-4 p-3 rounded-xl bg-black/80 border border-red-500/40 font-mono text-center">
            <span className="text-xs text-slate-400 block uppercase">{indicatorType} FLAGGED</span>
            <span className="text-base sm:text-lg font-bold text-red-300 break-all select-all">
              {mainIndicator}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-left mb-3">
            <div className="bg-red-950/40 p-2 rounded-lg border border-red-900/50">
              <span className="text-[10px] text-slate-400 block">CATEGORY</span>
              <span className="font-semibold text-slate-200">{result.categoryLabel}</span>
            </div>
            <div className="bg-red-950/40 p-2 rounded-lg border border-red-900/50">
              <span className="text-[10px] text-slate-400 block">RISK RATING</span>
              <span className="font-bold text-red-400">{result.riskScore}/100 ({result.threatLevel})</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-normal">
            Extracted from active baiting session. Forward to family and WhatsApp groups to prevent financial fraud.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4" />
                <span>COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPY WHATSAPP ADVISORY TEXT</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
