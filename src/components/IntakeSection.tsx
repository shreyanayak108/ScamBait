import React, { useState } from 'react';
import { DEMO_CASES } from '../data/demoCases';
import { DemoCase } from '../types/threat';
import { Sparkles, Shield, AlertTriangle, UserCheck, Clipboard, Trash2, ArrowRight } from 'lucide-react';

interface IntakeSectionProps {
  message: string;
  setMessage: (msg: string) => void;
  selectedPersonaId: string;
  setSelectedPersonaId: (id: string) => void;
  selectedDemoCaseId: string | null;
  onSelectDemoCase: (demoCase: DemoCase) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const PERSONAS = [
  {
    id: 'martha',
    name: 'Grandma Martha (73 yrs)',
    role: 'Confused, polite grandmother',
    description: 'Distracts with knitting, tea, and cookies; mistakes phone for microwave',
    avatar: '👵',
    badge: 'High Time-Waster',
  },
  {
    id: 'clueless_intern',
    name: 'Rohan - Clueless Applicant',
    role: 'Over-enthusiastic fresher candidate',
    description: 'Asks endless questions about PF/taxes, sends corrupted screenshots',
    avatar: '🧑‍💻',
    badge: 'Mule Exposure',
  },
  {
    id: 'retiree',
    name: 'Balwant Singh (Retiree)',
    role: 'Excited lottery winner',
    description: 'Asks scammer to deduct fees from the 25 Lakh prize directly',
    avatar: '👴🏽',
    badge: 'Reverse Logic Trap',
  },
  {
    id: 'compliance_officer',
    name: 'Agent Vance',
    role: 'Bureaucratic compliance auditor',
    description: 'Dangles $850k inheritance while demanding 42-page IRS/AML forms',
    avatar: '🕵️‍♂️',
    badge: 'Legal Paralysis',
  },
];

export const IntakeSection: React.FC<IntakeSectionProps> = ({
  message,
  setMessage,
  selectedPersonaId,
  setSelectedPersonaId,
  selectedDemoCaseId,
  onSelectDemoCase,
  onAnalyze,
  isLoading,
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text);
      }
    } catch {
      // Ignore if permission denied
    }
  };

  const handleClear = () => {
    setMessage('');
  };

  const selectedPersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];

  return (
    <div className="bg-[#0d131f]/90 border border-cyan-900/50 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative cyber corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/70"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/70"></div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-wide">
              THREAT INTAKE & BAITING CONSOLE
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste suspicious SMS, WhatsApp, or phishing email to trap the scammer and extract threat indicators.
          </p>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Zero-Trust Sandbox
          </span>
        </div>
      </div>

      {/* Demo Cases Dropdown / Quick Select Buttons (Requirement 6) */}
      <div className="mt-4 pt-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-medium text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            HACKATHON DEMO CASES (Tested End-to-End):
          </span>
          <span className="text-[11px] text-slate-400">
            Click to auto-populate instant realistic threat
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {DEMO_CASES.map((demo) => {
            const isSelected = selectedDemoCaseId === demo.id;
            return (
              <button
                key={demo.id}
                onClick={() => onSelectDemoCase(demo)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all relative group ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-md shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${demo.badgeColor}`}>
                    {demo.categoryLabel}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  )}
                </div>
                <div className="font-semibold text-slate-200 line-clamp-1 group-hover:text-cyan-300">
                  {demo.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                  {demo.previewText}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea Input */}
      <div className="mt-4 relative">
        <div className="relative rounded-xl border border-slate-700/80 bg-[#070a0f] focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-500/40 transition-all">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 4000))}
            placeholder="Paste suspicious SMS, Telegram, WhatsApp chat, or phishing email here... (e.g. 'Dear customer your SBI account is blocked, update KYC at http://...', or 'Earn Rs 5000/day by liking videos...')"
            rows={5}
            className="w-full bg-transparent p-4 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none font-mono"
          />

          {/* Quick Tools Inside Textarea */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/80 bg-slate-900/40 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePaste}
                type="button"
                className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
              {message && (
                <button
                  onClick={handleClear}
                  type="button"
                  className="hover:text-red-400 flex items-center gap-1 transition-colors"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[11px] ${message.length > 3800 ? 'text-amber-400' : 'text-slate-400'}`}>
                {message.length} / 4,000 chars
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Persona Selection & Action Button */}
      <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Active Persona Info */}
        <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl p-1.5 bg-slate-800 rounded-lg">
              {selectedPersona.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-200 font-mono">
                  Active Persona: {selectedPersona.name}
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.2 rounded font-mono">
                  {selectedPersona.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {selectedPersona.description}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change</span>
            </button>

            {/* Persona Popover */}
            {showPersonaMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-72 bg-[#0c111a] border border-cyan-900/80 rounded-xl shadow-2xl p-2 z-50">
                <div className="text-[11px] font-mono text-cyan-400 px-2 py-1 border-b border-slate-800 mb-1">
                  SELECT SCAM-BAITING PERSONA
                </div>
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPersonaId(p.id);
                      setShowPersonaMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                      selectedPersonaId === p.id
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <span className="text-xl">{p.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold flex items-center justify-between">
                        <span>{p.name}</span>
                        <span className="text-[9px] text-cyan-400 font-mono">{p.badge}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{p.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={onAnalyze}
          disabled={isLoading || !message.trim()}
          className={`px-6 py-3.5 rounded-xl font-mono text-sm font-bold tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-lg ${
            isLoading || !message.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] border border-cyan-300/40'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-900 border-t-cyan-400 rounded-full animate-spin"></div>
              <span>ANALYZING & ENGAGING...</span>
            </>
          ) : (
            <>
              <span>⚡ ANALYZE & DEPLOY BAIT</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
