import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { IntakeSection } from './components/IntakeSection';
import { AnalysisSkeleton } from './components/AnalysisSkeleton';
import { RiskScoreCard } from './components/RiskScoreCard';
import { IndicatorsCard } from './components/IndicatorsCard';
import { ConversationReplay } from './components/ConversationReplay';
import { FingerprintCard } from './components/FingerprintCard';
import { ExplainabilityCard } from './components/ExplainabilityCard';
import { ShareWarningCardModal } from './components/ShareWarningCardModal';
import { BlocklistTable } from './components/BlocklistTable';
import { CheckLookupView } from './components/CheckLookupView';
import { ThreatHeatmapView } from './components/ThreatHeatmapView';
import { DEMO_CASES, PRECOMPUTED_DEMO_RESULTS } from './data/demoCases';
import { INITIAL_BLOCKLIST } from './data/seedBlocklist';
import { AnalysisResult, BlocklistEntry, DemoCase } from './types/threat';
import { AlertTriangle, RefreshCw, Sparkles, Shield, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'blocklist' | 'lookup' | 'trends'>('analyzer');
  
  // Intake state
  const [message, setMessage] = useState<string>('');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('martha');
  const [selectedDemoCaseId, setSelectedDemoCaseId] = useState<string | null>(null);

  // Analysis status: 'idle' | 'loading' | 'error' | 'success'
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isContinuingBait, setIsContinuingBait] = useState<boolean>(false);

  // Community store state
  const [blocklist, setBlocklist] = useState<BlocklistEntry[]>(INITIAL_BLOCKLIST);
  const [totalMinutesWasted, setTotalMinutesWasted] = useState<number>(1842);

  // Modal state
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Fetch blocklist & stats on mount
  useEffect(() => {
    fetch('/api/blocklist')
      .then((res) => res.json())
      .then((data) => {
        if (data.blocklist && Array.isArray(data.blocklist)) {
          setBlocklist(data.blocklist);
        }
      })
      .catch(() => {
        // Fall back to seed blocklist
        setBlocklist(INITIAL_BLOCKLIST);
      });

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.totalScammerMinutesWasted) {
          setTotalMinutesWasted(data.totalScammerMinutesWasted);
        }
      })
      .catch(() => {});
  }, []);

  // Demo case selection
  const handleSelectDemoCase = (demo: DemoCase) => {
    setMessage(demo.fullMessage);
    setSelectedDemoCaseId(demo.id);
    setSelectedPersonaId(demo.suggestedPersonaId);
    setErrorMessage(null);
  };

  // Perform Analysis with 10-second client timeout and fallback
  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setAnalysisStatus('loading');
    setErrorMessage(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          personaId: selectedPersonaId,
          demoCaseId: selectedDemoCaseId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      setAnalysisStatus('success');
      setTotalMinutesWasted((prev) => prev + (data.estimatedTimeWastedMinutes || 15));

      // Refresh community blocklist
      fetch('/api/blocklist')
        .then((r) => r.json())
        .then((bData) => {
          if (bData.blocklist) setBlocklist(bData.blocklist);
        })
        .catch(() => {});
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('[ScamBait Frontend Error]:', err);

      // Check if we can fallback to precomputed demo result if available
      if (selectedDemoCaseId && PRECOMPUTED_DEMO_RESULTS[selectedDemoCaseId]) {
        console.warn('Using client-side precomputed demo case result.');
        const fallback = PRECOMPUTED_DEMO_RESULTS[selectedDemoCaseId];
        setAnalysisResult(fallback);
        setAnalysisStatus('success');
        return;
      }

      setErrorMessage(
        err.name === 'AbortError'
          ? 'Analysis timed out after 12 seconds. The server may be congested.'
          : err.message || 'An unexpected communication error occurred. Please click Retry.'
      );
      setAnalysisStatus('error');
    }
  };

  // Conversational next turn in scam-baiting thread
  const handleContinueBaiting = async (nextScammerMsg: string) => {
    if (!analysisResult || isContinuingBait) return;

    setIsContinuingBait(true);

    try {
      const response = await fetch('/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: analysisResult.selectedPersona,
          conversationHistory: analysisResult.baitConversation,
          nextMessage: nextScammerMsg,
        }),
      });

      const data = await response.json();
      const updatedConversation = [
        ...analysisResult.baitConversation,
        {
          speaker: 'scammer' as const,
          personaName: 'Scammer',
          avatar: '🚨',
          message: nextScammerMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        data.reply,
      ];

      setAnalysisResult({
        ...analysisResult,
        baitConversation: updatedConversation,
        estimatedTimeWastedMinutes:
          analysisResult.estimatedTimeWastedMinutes + (data.timeAddedMinutes || 6),
      });

      setTotalMinutesWasted((prev) => prev + (data.timeAddedMinutes || 6));
    } catch (err) {
      console.error('Interact error:', err);
    } finally {
      setIsContinuingBait(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-slate-100 cyber-grid flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        minutesWasted={totalMinutesWasted}
        threatsCount={blocklist.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* TAB 1: THREAT ANALYZER & SCAM-BAIT */}
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            {/* Intake Card */}
            <IntakeSection
              message={message}
              setMessage={setMessage}
              selectedPersonaId={selectedPersonaId}
              setSelectedPersonaId={setSelectedPersonaId}
              selectedDemoCaseId={selectedDemoCaseId}
              onSelectDemoCase={handleSelectDemoCase}
              onAnalyze={handleAnalyze}
              isLoading={analysisStatus === 'loading'}
            />

            {/* Explicit 3-State Async Handling: LOADING */}
            {analysisStatus === 'loading' && <AnalysisSkeleton />}

            {/* Explicit 3-State Async Handling: ERROR */}
            {analysisStatus === 'error' && (
              <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-6 text-center shadow-xl cyber-glow-red">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-900/60 text-red-400 mb-3 border border-red-700">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 font-mono">
                  ANALYSIS PIPELINE FAILURE
                </h3>
                <p className="text-xs text-red-300 mt-1 max-w-lg mx-auto font-mono">
                  {errorMessage || 'Failed to analyze threat message. The engine caught a network interrupt.'}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={handleAnalyze}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-600/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>RETRY ANALYSIS</span>
                  </button>
                  {selectedDemoCaseId && PRECOMPUTED_DEMO_RESULTS[selectedDemoCaseId] && (
                    <button
                      onClick={() => {
                        setAnalysisResult(PRECOMPUTED_DEMO_RESULTS[selectedDemoCaseId]);
                        setAnalysisStatus('success');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                    >
                      Use Verified Demo Cache
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Explicit 3-State Async Handling: SUCCESS */}
            {analysisStatus === 'success' && analysisResult && (
              <div className="space-y-8 animate-fadeIn">
                {/* 1. Risk Score Gauge Card */}
                <RiskScoreCard
                  result={analysisResult}
                  onOpenShareModal={() => setShowShareModal(true)}
                />

                {/* 2. Live Conversation Replay (Unique Feature #1) */}
                <ConversationReplay
                  conversation={analysisResult.baitConversation}
                  persona={analysisResult.selectedPersona}
                  estimatedTimeWastedMinutes={analysisResult.estimatedTimeWastedMinutes}
                  onContinueBaiting={handleContinueBaiting}
                  isContinuing={isContinuingBait}
                />

                {/* 3. Indicators of Compromise (IOCs) */}
                <IndicatorsCard
                  indicators={analysisResult.indicators}
                  threatLevel={analysisResult.threatLevel}
                />

                {/* 4. Scam Pattern Fingerprinting (Unique Feature #2) */}
                <FingerprintCard fingerprint={analysisResult.fingerprint} />

                {/* 5. Transparency & Explainability Reasoning */}
                <ExplainabilityCard
                  triggeredPhrases={analysisResult.triggeredPhrases}
                  psychologicalTriggers={analysisResult.psychologicalTriggers}
                  urgencyTactics={analysisResult.urgencyTactics}
                />
              </div>
            )}

            {/* Empty State Banner (Shown when no analysis run yet) */}
            {analysisStatus === 'idle' && (
              <div className="bg-[#0b1019]/60 border border-slate-800/80 rounded-2xl p-8 text-center max-w-3xl mx-auto">
                <div className="inline-flex p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 mb-3">
                  <Terminal className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-200 font-mono">
                  Autonomous Scam-Baiting & Threat Neutralization
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                  ScamBait engages cyber scammers with realistic, time-wasting conversational personas, extracts their UPI IDs, phone numbers, and mule bank accounts, and indexes them into a shared blocklist.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-mono text-cyan-400">Try clicking a Demo Case above:</span>
                  {DEMO_CASES.slice(0, 3).map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => handleSelectDemoCase(demo)}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-300 transition-colors"
                    >
                      {demo.categoryLabel}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: THREAT BLOCKLIST */}
        {activeTab === 'blocklist' && (
          <BlocklistTable
            entries={blocklist}
            onRefresh={() => {
              fetch('/api/blocklist')
                .then((r) => r.json())
                .then((d) => d.blocklist && setBlocklist(d.blocklist));
            }}
          />
        )}

        {/* TAB 3: CHECK-BEFORE-YOU-TRUST LOOKUP */}
        {activeTab === 'lookup' && <CheckLookupView blocklist={blocklist} />}

        {/* TAB 4: THREAT HEATMAP & TRENDS */}
        {activeTab === 'trends' && (
          <ThreatHeatmapView
            blocklist={blocklist}
            totalMinutesWasted={totalMinutesWasted}
          />
        )}
      </main>

      {/* Shareable Warning Card Modal */}
      {showShareModal && analysisResult && (
        <ShareWarningCardModal
          result={analysisResult}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b12] py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>ScamBait Threat Intel Node #a513 — Cybersecurity & Defense Edition</span>
          </div>
          <div>
            Built with Claude & Gemini AI Engines • Zero-Trust Threat Sandboxing
          </div>
        </div>
      </footer>
    </div>
  );
}
