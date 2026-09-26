import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_BLOCKLIST } from './src/data/seedBlocklist.ts';
import { PRECOMPUTED_DEMO_RESULTS, DEMO_CASES } from './src/data/demoCases.ts';
import { extractIndicatorsLocally, classifyThreatHeuristically, generateBaitDialogue } from './server/threatEngine.ts';
import { AnalysisResult, BlocklistEntry, PersonaReply } from './src/types/threat.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Shared in-memory community threat store
let blocklistStore: BlocklistEntry[] = [...INITIAL_BLOCKLIST];
let totalScammerMinutesWasted = 1842;
let totalAnalyzedMessages = 156;

// Helper to register extracted indicators to the shared blocklist
function registerIndicatorsToBlocklist(result: AnalysisResult) {
  const now = new Date().toISOString().split('T')[0];
  const { indicators, category, categoryLabel, threatLevel } = result;

  const addOrUpdate = (type: BlocklistEntry['type'], val: string) => {
    if (!val || val.trim().length === 0) return;
    const cleanVal = val.trim();
    const existing = blocklistStore.find(b => b.value.toLowerCase() === cleanVal.toLowerCase());
    if (existing) {
      existing.flagCount += 1;
      existing.lastSeen = now;
      if (threatLevel === 'CRITICAL') existing.threatLevel = 'CRITICAL';
    } else {
      blocklistStore.unshift({
        id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type,
        value: cleanVal,
        category,
        categoryLabel,
        threatLevel,
        flagCount: 1,
        firstReported: now,
        lastSeen: now,
        impersonatedBrand: indicators.brandsImpersonated[0] || undefined,
        status: threatLevel === 'CRITICAL' ? 'confirmed_malicious' : 'flagged',
        notes: `Extracted via ScamBait analysis (${categoryLabel}).`,
      });
    }
  };

  indicators.upiIds.forEach(u => addOrUpdate('upi', u));
  indicators.phoneNumbers.forEach(p => addOrUpdate('phone', p));
  indicators.urls.forEach(u => addOrUpdate('url', u));
  indicators.bankAccounts.forEach(b => addOrUpdate('bank', b));
  indicators.cryptoWallets.forEach(w => addOrUpdate('wallet', w));
}

// 1. /api/analyze route with 10s timeout, retry once, and fail-safe fallback
app.post('/api/analyze', async (req: Request, res: Response) => {
  const { message, personaId, demoCaseId } = req.body;

  // Validation
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      error: 'Message content is required and cannot be empty.',
      code: 'EMPTY_INPUT',
    });
  }

  const cleanMessage = message.trim();
  if (cleanMessage.length > 4000) {
    return res.status(400).json({
      error: 'Message exceeds maximum allowed limit of 4,000 characters.',
      code: 'INPUT_TOO_LONG',
    });
  }

  // Check if this matches a demo case ID directly for instant zero-latency presentation
  if (demoCaseId && PRECOMPUTED_DEMO_RESULTS[demoCaseId]) {
    const demoResult = PRECOMPUTED_DEMO_RESULTS[demoCaseId];
    registerIndicatorsToBlocklist(demoResult);
    totalScammerMinutesWasted += demoResult.estimatedTimeWastedMinutes;
    totalAnalyzedMessages += 1;
    return res.json(demoResult);
  }

  // Also check if text exactly matches any of our 5 demo cases
  for (const dc of DEMO_CASES) {
    if (cleanMessage.includes(dc.fullMessage.slice(0, 80)) || cleanMessage === dc.fullMessage) {
      const demoResult = PRECOMPUTED_DEMO_RESULTS[dc.id];
      if (demoResult) {
        registerIndicatorsToBlocklist(demoResult);
        totalScammerMinutesWasted += demoResult.estimatedTimeWastedMinutes;
        totalAnalyzedMessages += 1;
        return res.json(demoResult);
      }
    }
  }

  // Local fallback indicators and heuristic classification as baseline
  const localIndicators = extractIndicatorsLocally(cleanMessage);
  const heuristic = classifyThreatHeuristically(cleanMessage, localIndicators);
  const heuristicDialogue = generateBaitDialogue(heuristic.category, cleanMessage);

  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini API key or offline, use deterministic threat engine
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.log('[ScamBait] Running local deterministic threat analysis engine (API key not configured).');
    const localResult: AnalysisResult = {
      id: `analysis-${Date.now()}`,
      originalMessage: cleanMessage,
      category: heuristic.category,
      categoryLabel: heuristic.categoryLabel,
      riskScore: heuristic.riskScore,
      threatLevel: heuristic.threatLevel,
      justification: heuristic.justification,
      indicators: localIndicators,
      triggeredPhrases: heuristic.triggeredPhrases,
      fingerprint: heuristic.fingerprint,
      psychologicalTriggers: heuristic.psychologicalTriggers,
      urgencyTactics: heuristic.urgencyTactics,
      recommendedAction: heuristic.recommendedAction,
      selectedPersona: heuristicDialogue.persona,
      baitConversation: heuristicDialogue.conversation,
      estimatedTimeWastedMinutes: heuristicDialogue.estimatedTimeWastedMinutes,
      analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    registerIndicatorsToBlocklist(localResult);
    totalScammerMinutesWasted += localResult.estimatedTimeWastedMinutes;
    totalAnalyzedMessages += 1;
    return res.json(localResult);
  }

  // AI-powered analysis with Gemini (gemini-3.8-flash)
  // Wrapped in 10-second AbortController timeout with 1 retry
  const callModelWithTimeout = async (attempt: number = 1): Promise<AnalysisResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemPrompt = `You are ScamBait, an elite cybersecurity defense threat intelligence engine.
Analyze this suspicious/scam message and return a strictly valid JSON response.
Extract actionable indicators of compromise (IOCs): UPI IDs, phone numbers, suspicious URLs/domains, bank accounts, impersonated brands, and crypto wallets.
Assign a risk score (0-100), scam category, threat level (CRITICAL, HIGH, MEDIUM, LOW), psychological manipulation triggers, and generate a multi-turn in-character scam-baiting conversation where an AI persona strings the scammer along with hilarious, distracting excuses that waste their time without alerting them.`;

      const userPrompt = `Message to analyze:
"""
${cleanMessage}
"""

Respond ONLY with a JSON object adhering to this schema:
{
  "category": "kyc_banking" | "job_scam" | "lottery_prize" | "tech_support" | "romance_investment" | "courier_customs" | "utility_bill" | "other",
  "categoryLabel": string,
  "riskScore": number (0 to 100),
  "threatLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "justification": string (2-3 sentences explaining the risk),
  "indicators": {
    "upiIds": string[],
    "phoneNumbers": string[],
    "urls": string[],
    "bankAccounts": string[],
    "brandsImpersonated": string[],
    "cryptoWallets": string[]
  },
  "triggeredPhrases": [
    { "phrase": string, "reason": string, "severity": "high" | "medium" | "low" }
  ],
  "psychologicalTriggers": string[],
  "urgencyTactics": string[],
  "recommendedAction": string,
  "fingerprint": {
    "clusterId": string,
    "clusterName": string,
    "similarityMatchPercent": number,
    "knownVictimsTargeted": number,
    "firstSeenDaysAgo": number,
    "variantFamily": string,
    "behaviorTactic": string
  },
  "selectedPersona": {
    "id": string,
    "name": string,
    "role": string,
    "strategy": string,
    "avatar": string
  },
  "baitConversation": [
    {
      "speaker": "scammer" | "persona",
      "personaName": string,
      "avatar": string,
      "message": string,
      "timestamp": string,
      "tacticUsed": string,
      "timeDelaySec": number
    }
  ],
  "estimatedTimeWastedMinutes": number
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      clearTimeout(timeoutId);

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);

      // Merge with locally detected indicators so nothing is missed
      const mergedUpi = Array.from(new Set([...(parsed.indicators?.upiIds || []), ...localIndicators.upiIds]));
      const mergedPhones = Array.from(new Set([...(parsed.indicators?.phoneNumbers || []), ...localIndicators.phoneNumbers]));
      const mergedUrls = Array.from(new Set([...(parsed.indicators?.urls || []), ...localIndicators.urls]));
      const mergedBanks = Array.from(new Set([...(parsed.indicators?.bankAccounts || []), ...localIndicators.bankAccounts]));
      const mergedBrands = Array.from(new Set([...(parsed.indicators?.brandsImpersonated || []), ...localIndicators.brandsImpersonated]));
      const mergedWallets = Array.from(new Set([...(parsed.indicators?.cryptoWallets || []), ...localIndicators.cryptoWallets]));

      const finalResult: AnalysisResult = {
        id: `analysis-${Date.now()}`,
        originalMessage: cleanMessage,
        category: parsed.category || heuristic.category,
        categoryLabel: parsed.categoryLabel || heuristic.categoryLabel,
        riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : heuristic.riskScore,
        threatLevel: parsed.threatLevel || heuristic.threatLevel,
        justification: parsed.justification || heuristic.justification,
        indicators: {
          upiIds: mergedUpi,
          phoneNumbers: mergedPhones,
          urls: mergedUrls,
          bankAccounts: mergedBanks,
          brandsImpersonated: mergedBrands,
          cryptoWallets: mergedWallets,
        },
        triggeredPhrases: parsed.triggeredPhrases && parsed.triggeredPhrases.length > 0
          ? parsed.triggeredPhrases
          : heuristic.triggeredPhrases,
        psychologicalTriggers: parsed.psychologicalTriggers || heuristic.psychologicalTriggers,
        urgencyTactics: parsed.urgencyTactics || heuristic.urgencyTactics,
        recommendedAction: parsed.recommendedAction || heuristic.recommendedAction,
        fingerprint: parsed.fingerprint || heuristic.fingerprint,
        selectedPersona: parsed.selectedPersona || heuristicDialogue.persona,
        baitConversation: parsed.baitConversation && parsed.baitConversation.length > 0
          ? parsed.baitConversation
          : heuristicDialogue.conversation,
        estimatedTimeWastedMinutes: parsed.estimatedTimeWastedMinutes || heuristicDialogue.estimatedTimeWastedMinutes,
        analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      return finalResult;
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(`[ScamBait AI Analysis Error - Attempt ${attempt}]:`, err?.message || err);

      if (attempt === 1) {
        // Retry once with exponential backoff (800ms)
        await new Promise((resolve) => setTimeout(resolve, 800));
        return callModelWithTimeout(2);
      }

      throw err;
    }
  };

  try {
    const result = await callModelWithTimeout(1);
    registerIndicatorsToBlocklist(result);
    totalScammerMinutesWasted += result.estimatedTimeWastedMinutes;
    totalAnalyzedMessages += 1;
    return res.json(result);
  } catch (error: any) {
    console.warn('[ScamBait] AI call failed after retry, seamlessly using deterministic threat engine fallback.');
    
    // Fail-safe deterministic fallback: NEVER crash or leave user hanging
    const fallbackResult: AnalysisResult = {
      id: `analysis-fallback-${Date.now()}`,
      originalMessage: cleanMessage,
      category: heuristic.category,
      categoryLabel: heuristic.categoryLabel,
      riskScore: heuristic.riskScore,
      threatLevel: heuristic.threatLevel,
      justification: heuristic.justification,
      indicators: localIndicators,
      triggeredPhrases: heuristic.triggeredPhrases,
      fingerprint: heuristic.fingerprint,
      psychologicalTriggers: heuristic.psychologicalTriggers,
      urgencyTactics: heuristic.urgencyTactics,
      recommendedAction: heuristic.recommendedAction,
      selectedPersona: heuristicDialogue.persona,
      baitConversation: heuristicDialogue.conversation,
      estimatedTimeWastedMinutes: heuristicDialogue.estimatedTimeWastedMinutes,
      analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    registerIndicatorsToBlocklist(fallbackResult);
    totalScammerMinutesWasted += fallbackResult.estimatedTimeWastedMinutes;
    totalAnalyzedMessages += 1;
    return res.json(fallbackResult);
  }
});

// 2. /api/interact: conversational next-turn scam-baiting
app.post('/api/interact', async (req: Request, res: Response) => {
  const { persona, conversationHistory, nextMessage, isScammerReply } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const historyText = (conversationHistory || [])
    .map((c: any) => `${c.speaker === 'scammer' ? 'Scammer' : persona?.name || 'Persona'}: ${c.message}`)
    .join('\n');

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Deterministic witty response
    const replies = [
      "Oh goodness, I tapped the screen and my camera took a photo of my ceiling fan! Does the Reserve Bank need to see my ceiling fan?",
      "My nephew said I should never give my OTP to strangers, but you seem so very polite! Are you related to the Guptas on Elm Street?",
      "I am trying to find the button you mentioned, but my tea just boiled over on the stove. Hold on for just 10 minutes while I wipe the milk!",
      "I took my telephone to the local post office and the clerk told me to ask you for your badge identification number. What is your badge number dear?",
    ];
    const chosen = replies[Math.floor(Math.random() * replies.length)];
    totalScammerMinutesWasted += 6;
    return res.json({
      reply: {
        speaker: 'persona',
        personaName: persona?.name || 'Grandma Martha',
        avatar: persona?.avatar || '👵',
        message: chosen,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tacticUsed: 'Distraction and deliberate technical incompetence',
        timeDelaySec: 320,
      },
      timeAddedMinutes: 6,
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const prompt = `You are playing the scam-baiting persona "${persona?.name || 'Grandma Martha'}".
Persona role: ${persona?.role || 'Elderly grandmother'}.
Persona strategy: ${persona?.strategy || 'Pretend to be helpless, waste time, ask absurd questions, misunderstand technology'}.

Conversation history:
${historyText}

The scammer just said:
"${nextMessage || 'Did you make the payment yet?'}"

Generate the persona's next in-character reply. Keep it humorous, believable, and intentionally frustrating for the scammer. Waste their time without tipping them off that you are onto them. Do not break character. Keep it under 60 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { temperature: 0.8 },
    });

    const personaText = response.text?.trim() || "Oh dear, let me find my glasses first!";
    totalScammerMinutesWasted += 7;

    return res.json({
      reply: {
        speaker: 'persona',
        personaName: persona?.name || 'Grandma Martha',
        avatar: persona?.avatar || '👵',
        message: personaText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tacticUsed: 'In-character conversational stall',
        timeDelaySec: 280,
      },
      timeAddedMinutes: 7,
    });
  } catch (err: any) {
    console.error('[ScamBait Interact Error]:', err?.message || err);
    return res.json({
      reply: {
        speaker: 'persona',
        personaName: persona?.name || 'Grandma Martha',
        avatar: persona?.avatar || '👵',
        message: "Oh my, I dropped my reading glasses behind the sofa! Hold on while I find my walking stick to fish them out...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tacticUsed: 'Physical world distraction delay',
        timeDelaySec: 300,
      },
      timeAddedMinutes: 5,
    });
  }
});

// 3. /api/blocklist: GET all threat indicators
app.get('/api/blocklist', (_req: Request, res: Response) => {
  return res.json({
    total: blocklistStore.length,
    blocklist: blocklistStore,
  });
});

// 4. /api/lookup: instant check-before-you-trust
app.get('/api/lookup', (req: Request, res: Response) => {
  const query = (req.query.query as string || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  // Exact or partial match in blocklist
  const matches = blocklistStore.filter(entry => 
    entry.value.toLowerCase().includes(query) ||
    (entry.impersonatedBrand && entry.impersonatedBrand.toLowerCase().includes(query))
  );

  const isFlagged = matches.length > 0;
  const highestThreat = matches.reduce((acc, curr) => {
    if (curr.threatLevel === 'CRITICAL') return 'CRITICAL';
    if (curr.threatLevel === 'HIGH' && acc !== 'CRITICAL') return 'HIGH';
    return acc;
  }, isFlagged ? 'MEDIUM' : 'SAFE');

  return res.json({
    query,
    isFlagged,
    threatLevel: isFlagged ? highestThreat : 'SAFE',
    matchCount: matches.length,
    matches,
    verdict: isFlagged 
      ? `WARNING: This indicator has been flagged ${matches.reduce((sum, m) => sum + m.flagCount, 0)} times across the ScamBait threat defense network!`
      : `No prior reports found for "${query}" in our verified database. Always exercise caution before transferring funds or sharing credentials.`,
  });
});

// 5. /api/stats: community statistics
app.get('/api/stats', (_req: Request, res: Response) => {
  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  blocklistStore.forEach(entry => {
    categoryCounts[entry.categoryLabel] = (categoryCounts[entry.categoryLabel] || 0) + 1;
  });

  return res.json({
    totalScammerMinutesWasted,
    totalThreatsIndexed: blocklistStore.length,
    totalAnalyzedMessages,
    categoryCounts,
    activeTrapsCount: blocklistStore.filter(b => b.status === 'active_trap').length,
    confirmedMaliciousCount: blocklistStore.filter(b => b.status === 'confirmed_malicious').length,
  });
});

// Start Express server
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScamBait] Threat Intelligence Server operational on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[ScamBait Server Startup Error]:', err);
});
