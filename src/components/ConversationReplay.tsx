import React, { useState, useEffect } from 'react';
import { PersonaReply } from '../types/threat';
import { Play, Pause, RotateCcw, FastForward, Clock, Send, Bot, Shield, Sparkles } from 'lucide-react';

interface ConversationReplayProps {
  conversation: PersonaReply[];
  persona: {
    id: string;
    name: string;
    role: string;
    strategy: string;
    avatar: string;
  };
  estimatedTimeWastedMinutes: number;
  onContinueBaiting: (nextScammerMsg: string) => Promise<void>;
  isContinuing: boolean;
}

export const ConversationReplay: React.FC<ConversationReplayProps> = ({
  conversation,
  persona,
  estimatedTimeWastedMinutes,
  onContinueBaiting,
  isContinuing,
}) => {
  // Replay animation state
  const [displayedMessagesCount, setDisplayedMessagesCount] = useState<number>(conversation.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [customReply, setCustomReply] = useState<string>('');

  useEffect(() => {
    // When conversation changes, default to showing all messages
    setDisplayedMessagesCount(conversation.length);
  }, [conversation]);

  // Replay timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (displayedMessagesCount < conversation.length) {
        const delay = Math.max(1200 / playbackSpeed, 400);
        timer = setTimeout(() => {
          setDisplayedMessagesCount((prev) => prev + 1);
        }, delay);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, displayedMessagesCount, conversation.length, playbackSpeed]);

  const handleStartReplay = () => {
    setDisplayedMessagesCount(1);
    setIsPlaying(true);
  };

  const handleStepForward = () => {
    if (displayedMessagesCount < conversation.length) {
      setDisplayedMessagesCount((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setDisplayedMessagesCount(conversation.length);
  };

  const handleSimulateScammerPressure = () => {
    const angryScammerPrompts = [
      "WHY ARE YOU WASTING MY TIME?! Pay the amount immediately or police FIR is lodged!",
      "Madam, stop giving excuses! Open the app right now and enter your 6-digit MPIN!",
      "I am the Senior Manager! If you disconnect, your account balance will become zero permanently!",
      "Send the transaction receipt screenshot immediately on WhatsApp, only 2 minutes left!",
    ];
    const prompt = angryScammerPrompts[Math.floor(Math.random() * angryScammerPrompts.length)];
    onContinueBaiting(prompt);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReply.trim() || isContinuing) return;
    onContinueBaiting(customReply.trim());
    setCustomReply('');
  };

  const displayedList = conversation.slice(0, displayedMessagesCount);

  return (
    <div className="bg-[#0d131f]/90 border border-cyan-900/60 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{persona.avatar}</span>
            <h3 className="text-base font-bold text-slate-100 font-mono tracking-wide">
              LIVE CONVERSATION REPLAY: {persona.name.toUpperCase()}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Strategy: <span className="text-cyan-300 font-mono">{persona.strategy}</span>
          </p>
        </div>

        {/* Gamified Time Wasted Counter for this session */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
          <Clock className="w-4 h-4 animate-spin-slow" />
          <span className="text-xs font-mono font-bold">
            ~{estimatedTimeWastedMinutes} Min Scammer Time Neutralized
          </span>
        </div>
      </div>

      {/* Replay Controls Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={() => setIsPlaying(false)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 flex items-center gap-1"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handleStartReplay}
              className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold shadow-sm"
              title="Animate turn-by-turn chat from beginning"
            >
              <Play className="w-3.5 h-3.5" />
              <span>▶ Replay From Start</span>
            </button>
          )}

          <button
            onClick={handleStepForward}
            disabled={displayedMessagesCount >= conversation.length}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
            title="Step to next message"
          >
            Step +1
          </button>

          <button
            onClick={handleReset}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Show all messages"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Playback speed buttons */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <FastForward className="w-3 h-3 text-cyan-400" /> Speed:
          </span>
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2 py-0.5 rounded font-bold ${
                playbackSpeed === s
                  ? 'bg-cyan-400 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="mt-4 p-4 rounded-xl bg-[#070b12] border border-slate-800/90 max-h-[460px] overflow-y-auto space-y-4 font-sans">
        {displayedList.map((item, index) => {
          const isScammer = item.speaker === 'scammer';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isScammer ? 'justify-start' : 'justify-end'}`}
            >
              {/* Avatar on left for scammer */}
              {isScammer && (
                <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center text-sm shrink-0 shadow-sm">
                  {item.avatar}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-md ${
                  isScammer
                    ? 'bg-slate-900 border border-red-900/40 text-slate-200 rounded-tl-none'
                    : 'bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border border-cyan-500/40 text-cyan-50 rounded-tr-none shadow-cyan-500/10'
                }`}
              >
                {/* Speaker Label & Timestamp */}
                <div className="flex items-center justify-between gap-3 text-[11px] font-mono mb-1 pb-1 border-b border-white/5">
                  <span className={`font-semibold ${isScammer ? 'text-red-400' : 'text-cyan-400'}`}>
                    {item.personaName}
                  </span>
                  <span className="text-slate-400 text-[10px]">{item.timestamp}</span>
                </div>

                {/* Message Body */}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {item.message}
                </p>

                {/* Counter-Baiting Tactic Badge */}
                {!isScammer && item.tacticUsed && (
                  <div className="mt-2 pt-1.5 border-t border-cyan-800/40 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      Tactic: {item.tacticUsed}
                    </span>
                    {item.timeDelaySec && (
                      <span className="text-slate-400">+{Math.round(item.timeDelaySec / 60)} min delay</span>
                    )}
                  </div>
                )}
              </div>

              {/* Avatar on right for persona */}
              {!isScammer && (
                <div className="w-8 h-8 rounded-full bg-cyan-950/90 border border-cyan-600 flex items-center justify-center text-sm shrink-0 shadow-sm">
                  {item.avatar}
                </div>
              )}
            </div>
          );
        })}

        {/* Animated typing indicator when continuing or replaying next turn */}
        {isContinuing && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 rounded-xl p-3 w-fit">
            <span className="text-lg">{persona.avatar}</span>
            <div className="flex items-center gap-1.5">
              <span>{persona.name} is crafting an absurd excuse...</span>
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Turn Extension Console (Scam-Bait Sandbox) */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 font-semibold">
            <Bot className="w-3.5 h-3.5" />
            INTERACTIVE SCAM-BAIT SANDBOX (Keep The Scammer Hooked):
          </span>
          <button
            onClick={handleSimulateScammerPressure}
            disabled={isContinuing}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-red-950/70 hover:bg-red-900/80 text-red-300 border border-red-800 transition-colors flex items-center gap-1 w-fit"
          >
            <span>⚡ Simulate Scammer Pressure</span>
          </button>
        </div>

        <form onSubmit={handleCustomSend} className="flex items-center gap-2">
          <input
            type="text"
            value={customReply}
            onChange={(e) => setCustomReply(e.target.value)}
            placeholder="Type what the scammer says next (e.g. 'Did you pay yet?! Send proof!')..."
            disabled={isContinuing}
            className="flex-1 bg-black/50 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="submit"
            disabled={!customReply.trim() || isContinuing}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors shrink-0 shadow-md shadow-cyan-500/20"
          >
            <span>Bait Next</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
