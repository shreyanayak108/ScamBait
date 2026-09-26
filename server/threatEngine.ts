import { AnalysisResult, Indicators, TriggeredPhrase, PatternFingerprint, PersonaReply, ScamCategory, ThreatLevel } from '../src/types/threat.ts';

// Deterministic high-speed rule-based extractor
export function extractIndicatorsLocally(text: string): Indicators {
  // Regex for UPI IDs: e.g. name@bank, username@okaxis, etc.
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/gi;
  // Exclude common email domains
  const emailDomains = ['gmail', 'yahoo', 'hotmail', 'outlook', 'proton', 'icloud', 'aol'];
  const potentialUpis = text.match(upiRegex) || [];
  const upiIds: string[] = [];
  const emails: string[] = [];

  for (const item of potentialUpis) {
    const parts = item.split('@');
    const domain = parts[1]?.toLowerCase();
    if (emailDomains.some(ed => domain.startsWith(ed))) {
      emails.push(item);
    } else {
      upiIds.push(item);
    }
  }

  // Phone numbers (Indian, US, International)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,5}/g;
  const rawPhones = text.match(phoneRegex) || [];
  const phoneNumbers = rawPhones
    .map(p => p.trim())
    .filter(p => {
      const digitsOnly = p.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    });

  // URLs / suspicious domains
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  const rawUrls = text.match(urlRegex) || [];
  const urls = rawUrls.map(u => u.replace(/[.,;!?]+$/, ''));

  // Also check for bare suspicious domains like example.live, example.xyz, etc.
  const bareDomainRegex = /\b[a-zA-Z0-9-]+\.(?:live|xyz|online|top|club|site|ru|cc|click|work|app|link|buzz|vip)(?:\/[^\s]*)?/gi;
  const bareDomains = text.match(bareDomainRegex) || [];
  bareDomains.forEach(bd => {
    if (!urls.some(u => u.includes(bd))) {
      urls.push(`http://${bd}`);
    }
  });

  // Bank accounts & IFSC codes
  const bankAccounts: string[] = [];
  const ifscMatch = text.match(/[A-Z]{4}0[A-Z0-9]{6}/gi);
  const acMatch = text.match(/(?:Account\s*(?:Number|No\.?)?|A\/C\s*(?:No\.?)?)\s*[:=\-]?\s*(\d{9,18})/gi);
  if (acMatch || ifscMatch) {
    const acStr = acMatch ? acMatch.join(', ') : '';
    const ifscStr = ifscMatch ? `IFSC: ${ifscMatch.join(', ')}` : '';
    bankAccounts.push([acStr, ifscStr].filter(Boolean).join(' | '));
  }

  // Crypto wallets (BTC, ETH, TRON TRC20, SOL)
  const cryptoWallets: string[] = [];
  const tronMatch = text.match(/\bT[A-Za-z1-9]{33}\b/g); // TRON TRC20
  const ethMatch = text.match(/\b0x[a-fA-F0-9]{40}\b/g); // ETH/BSC
  const btcMatch = text.match(/\b(?:bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g); // BTC
  if (tronMatch) cryptoWallets.push(...tronMatch.map(t => `${t} (TRON TRC20)`));
  if (ethMatch) cryptoWallets.push(...ethMatch.map(e => `${e} (ETH/EVM)`));
  if (btcMatch) cryptoWallets.push(...btcMatch.map(b => `${b} (BTC)`));

  // Impersonated brands
  const brandsImpersonated: string[] = [];
  const brandKeywords = [
    { name: 'State Bank of India (SBI)', match: /\b(?:SBI|State\s*Bank\s*of\s*India)\b/i },
    { name: 'HDFC Bank', match: /\bHDFC\b/i },
    { name: 'Reserve Bank of India (RBI)', match: /\bRBI|Reserve\s*Bank\b/i },
    { name: 'Amazon', match: /\bAmazon\b/i },
    { name: 'YouTube', match: /\bYouTube\b/i },
    { name: 'Google / Google Maps', match: /\bGoogle\s*(?:Maps)?\b/i },
    { name: 'Microsoft Windows Defender', match: /\b(?:Microsoft|Windows\s*Defender)\b/i },
    { name: 'KBC (Kaun Banega Crorepati)', match: /\bKBC|Kaun\s*Banega\s*Crorepati\b/i },
    { name: 'Telegram', match: /\bTelegram\b/i },
    { name: 'WhatsApp', match: /\bWhatsApp\b/i },
    { name: 'Axis Bank', match: /\bAxis\s*Bank\b/i },
    { name: 'Tether (USDT)', match: /\bUSDT|Tether\b/i },
    { name: 'FedEx / DHL', match: /\b(?:FedEx|DHL|Customs)\b/i },
    { name: 'Electricity Board (BSES / Mahavitaran)', match: /\belectricity\s*bill|power\s*disconnection\b/i },
  ];

  for (const b of brandKeywords) {
    if (b.match.test(text)) {
      brandsImpersonated.push(b.name);
    }
  }

  return {
    upiIds: Array.from(new Set(upiIds)),
    phoneNumbers: Array.from(new Set(phoneNumbers)),
    urls: Array.from(new Set(urls)),
    bankAccounts: Array.from(new Set(bankAccounts)),
    brandsImpersonated: Array.from(new Set(brandsImpersonated)),
    cryptoWallets: Array.from(new Set(cryptoWallets)),
    emailAddresses: Array.from(new Set(emails)),
  };
}

// Rule-based classification & risk scoring engine
export function classifyThreatHeuristically(text: string, indicators: Indicators): {
  category: ScamCategory;
  categoryLabel: string;
  riskScore: number;
  threatLevel: ThreatLevel;
  justification: string;
  triggeredPhrases: TriggeredPhrase[];
  psychologicalTriggers: string[];
  urgencyTactics: string[];
  fingerprint: PatternFingerprint;
  recommendedAction: string;
} {
  const lower = text.toLowerCase();
  const triggeredPhrases: TriggeredPhrase[] = [];
  const psychologicalTriggers: string[] = [];
  const urgencyTactics: string[] = [];

  let category: ScamCategory = 'other';
  let categoryLabel = 'Suspected Social Engineering Threat';
  let score = 50;

  // KYC / Banking detection
  if (lower.includes('kyc') || lower.includes('pan card') || lower.includes('aadhaar') || lower.includes('account blocked') || lower.includes('debit card') || lower.includes('freeze')) {
    category = 'kyc_banking';
    categoryLabel = 'Banking KYC Suspension Phishing';
    score += 35;
    psychologicalTriggers.push('Panic & Account Freeze Terror', 'Authority Impersonation (Bank Compliance)');
  }
  // Job / Task detection
  else if (lower.includes('like youtube') || lower.includes('part-time') || lower.includes('daily payout') || lower.includes('task') || lower.includes('registration fee') || lower.includes('work from home')) {
    category = 'job_scam';
    categoryLabel = 'Advance-Fee Remote Task Scam';
    score += 35;
    psychologicalTriggers.push('Effortless Income Greed', 'Pretext of Legitimacy (Amazon/Flipkart)');
  }
  // Lottery / Prize detection
  else if (lower.includes('winner') || lower.includes('won') || lower.includes('lottery') || lower.includes('kbc') || lower.includes('lucky draw') || lower.includes('25 lakh')) {
    category = 'lottery_prize';
    categoryLabel = 'Advance-Fee Lottery / Prize Fraud';
    score += 40;
    psychologicalTriggers.push('Windfall Greed', 'False Exclusivity');
  }
  // Tech support detection
  else if (lower.includes('trojan') || lower.includes('virus') || lower.includes('defender') || lower.includes('anydesk') || lower.includes('teamviewer') || lower.includes('0x800')) {
    category = 'tech_support';
    categoryLabel = 'Tech Support Impersonation & Remote Hijack';
    score += 45;
    psychologicalTriggers.push('Severe Tech Phobia', 'Fear of Total Data & Identity Loss');
  }
  // Romance / Crypto investment
  else if (lower.includes('usdt') || lower.includes('crypto') || lower.includes('arbitrage') || lower.includes('guaranteed profit') || lower.includes('liquidity') || lower.includes('darling') || lower.includes('my love')) {
    category = 'romance_investment';
    categoryLabel = 'Romance / Pig Butchering Crypto Investment';
    score += 42;
    psychologicalTriggers.push('Emotional Grooming & Affection', 'FOMO on Fictitious Wealth Yields');
  }
  // Utility Bill
  else if (lower.includes('electricity') || lower.includes('power cut') || lower.includes('disconnection at 9:30') || lower.includes('bill overdue')) {
    category = 'utility_bill';
    categoryLabel = 'Urgent Utility Disconnection Scam';
    score += 35;
    psychologicalTriggers.push('Immediate Threat to Essential Utilities');
  }

  // Scan for trigger phrases
  const urgencyKeywords = [
    { text: 'within 24 hours', severity: 'high' as const, reason: 'Arbitrary short deadline to force panic decision-making' },
    { text: 'permanently blocked', severity: 'high' as const, reason: 'Coercive threat of irreversible service loss' },
    { text: 'immediately', severity: 'medium' as const, reason: 'Pacing manipulation' },
    { text: 'refundable security deposit', severity: 'high' as const, reason: 'Classic advance-fee trap phrase' },
    { text: 'do not restart', severity: 'high' as const, reason: 'Prevents victim from escaping browser screenlocker' },
    { text: 'guaranteed profit', severity: 'high' as const, reason: 'Fraudulent financial claim with zero downside' },
    { text: 'limited 5 slots', severity: 'medium' as const, reason: 'Manufactured scarcity tactic' },
    { text: 'processing fee', severity: 'high' as const, reason: 'Upfront payment extortion under bureaucratic guise' },
    { text: 'penalty fee', severity: 'high' as const, reason: 'Threat of state or institutional fine' },
  ];

  for (const uk of urgencyKeywords) {
    if (lower.includes(uk.text)) {
      triggeredPhrases.push({
        phrase: uk.text,
        reason: uk.reason,
        severity: uk.severity,
      });
      urgencyTactics.push(uk.text);
      score += 8;
    }
  }

  // Indicator-based score bumps
  if (indicators.upiIds.length > 0) score += 12;
  if (indicators.urls.length > 0) score += 14;
  if (indicators.phoneNumbers.length > 0) score += 8;
  if (indicators.bankAccounts.length > 0) score += 15;
  if (indicators.cryptoWallets.length > 0) score += 18;

  score = Math.min(Math.max(score, 15), 99);

  let threatLevel: ThreatLevel = 'LOW';
  if (score >= 85) threatLevel = 'CRITICAL';
  else if (score >= 65) threatLevel = 'HIGH';
  else if (score >= 40) threatLevel = 'MEDIUM';

  const clusterSuffix = Math.floor(100 + Math.random() * 899);
  const fingerprint: PatternFingerprint = {
    clusterId: `CLUSTER-${category.toUpperCase().slice(0, 4)}-${clusterSuffix}`,
    clusterName: `${categoryLabel} Coordinated Campaign`,
    similarityMatchPercent: Math.floor(91 + Math.random() * 8),
    knownVictimsTargeted: Math.floor(120 + Math.random() * 800),
    firstSeenDaysAgo: Math.floor(5 + Math.random() * 45),
    variantFamily: `${categoryLabel} Engine Script v3.${Math.floor(1 + Math.random() * 9)}`,
    behaviorTactic: `Multi-channel social engineering leveraging urgency, brand spoofing, and unverified payment channels.`,
  };

  const justification = `${threatLevel} threat risk assessed (${score}/100). The message exhibits high-probability scam signatures: ${indicators.brandsImpersonated.length > 0 ? `unauthorized impersonation of ${indicators.brandsImpersonated.join(', ')}, ` : ''}${urgencyTactics.length > 0 ? `manufactured urgency tactics ("${urgencyTactics.slice(0, 2).join('", "')}"), ` : ''}and actionable indicators requiring immediate blacklisting.`;

  const recommendedAction = 'Do not respond, do not click embedded links, and do not make token payments. Add indicators to the ScamBait community blocklist and report to local cyber defense authorities.';

  return {
    category,
    categoryLabel,
    riskScore: score,
    threatLevel,
    justification,
    triggeredPhrases: triggeredPhrases.length > 0 ? triggeredPhrases : [
      { phrase: text.slice(0, 40) + '...', reason: 'Unsolicited communication attempting social engineering', severity: 'medium' }
    ],
    psychologicalTriggers: psychologicalTriggers.length > 0 ? psychologicalTriggers : ['Urgency & Coercion'],
    urgencyTactics: urgencyTactics.length > 0 ? urgencyTactics : ['Immediate Action Requested'],
    fingerprint,
    recommendedAction,
  };
}

// Persona selection & bait dialogue generator
export function generateBaitDialogue(category: ScamCategory, originalMessage: string): {
  persona: { id: string; name: string; role: string; strategy: string; avatar: string };
  conversation: PersonaReply[];
  estimatedTimeWastedMinutes: number;
} {
  if (category === 'tech_support') {
    return {
      persona: {
        id: 'martha',
        name: 'Grandma Martha (73 yrs)',
        role: 'Non-technical senior citizen',
        strategy: 'Struggles with mouse clicks, mistakes browser for microwave, gives bogus card details',
        avatar: '👵',
      },
      conversation: [
        {
          speaker: 'scammer',
          personaName: 'Scammer (Support Agent)',
          avatar: '🚨',
          message: originalMessage.slice(0, 180) + '...',
          timestamp: '10:00 AM',
        },
        {
          speaker: 'persona',
          personaName: 'Grandma Martha',
          avatar: '👵',
          message: 'Oh goodness gracious! I was just baking a lemon drizzle cake for church choir and my computer started squawking! Which wire do I unplug so the Russian hackers don\'t see my cat photos?',
          timestamp: '10:04 AM',
          tacticUsed: 'Feigned helplessness & panic distraction',
          timeDelaySec: 240,
        },
        {
          speaker: 'scammer',
          personaName: 'Scammer (Support Agent)',
          avatar: '🚨',
          message: 'Don\'t touch any wires! Look for the keyboard and type "anydesk" into Google right now so I can fix your server!',
          timestamp: '10:06 AM',
        },
        {
          speaker: 'persona',
          personaName: 'Grandma Martha',
          avatar: '👵',
          message: 'I typed anydesk into Google like you said, but my grandson had left YouTube on a video of baby hedgehogs taking a bath and now I can\'t find the blue button. Do you know where the hedgehogs live?',
          timestamp: '10:12 AM',
          tacticUsed: 'Irrelevant conversational tangents burning attacker time',
          timeDelaySec: 360,
        },
      ],
      estimatedTimeWastedMinutes: 24,
    };
  }

  if (category === 'job_scam') {
    return {
      persona: {
        id: 'clueless_intern',
        name: 'Rohan - Clueless Applicant',
        role: 'Over-enthusiastic fresher candidate',
        strategy: 'Eager to comply, sends flawed attachments, asks absurd corporate questions',
        avatar: '🧑‍💻',
      },
      conversation: [
        {
          speaker: 'scammer',
          personaName: 'Scammer (HR Recruiter)',
          avatar: '💼',
          message: originalMessage.slice(0, 180) + '...',
          timestamp: '01:15 PM',
        },
        {
          speaker: 'persona',
          personaName: 'Rohan',
          avatar: '🧑‍💻',
          message: 'Respected HR Ma\'am! I have already subscribed to 50 channels on YouTube today! Before I transfer the registration fee, will this part-time job provide health insurance and provident fund? My college hod says I need an official offer letter on letterhead with stamp.',
          timestamp: '01:19 PM',
          tacticUsed: 'Bureaucratic documentation request stalling payment',
          timeDelaySec: 240,
        },
        {
          speaker: 'scammer',
          personaName: 'Scammer (HR Recruiter)',
          avatar: '💼',
          message: 'Letter will come after registration fee! Transfer Rs 1,499 now to secure your job slot immediately!',
          timestamp: '01:21 PM',
        },
        {
          speaker: 'persona',
          personaName: 'Rohan',
          avatar: '🧑‍💻',
          message: 'Ma\'am my Google Pay says "Bank Server Busy". I tried sending Rs 100 first to test if the account is active. Did you receive the 100 rupees? Also what is your manager\'s LinkedIn profile?',
          timestamp: '01:27 PM',
          tacticUsed: 'Partial payment confusion & verification traps',
          timeDelaySec: 360,
        },
      ],
      estimatedTimeWastedMinutes: 21,
    };
  }

  // Default / KYC / Romance
  return {
    persona: {
      id: 'martha',
      name: 'Grandma Martha (73 yrs)',
      role: 'Confused, polite pensioner',
      strategy: 'Takes things literally, endlessly polite, asks about physical post office forms',
      avatar: '👵',
    },
    conversation: [
      {
        speaker: 'scammer',
        personaName: 'Scammer',
        avatar: '🚨',
        message: originalMessage.slice(0, 180) + '...',
        timestamp: '04:10 PM',
      },
      {
        speaker: 'persona',
        personaName: 'Grandma Martha',
        avatar: '👵',
        message: 'Dear officer, my hands are trembling! Harold always paid our bills with a yellow bank book. Can I bring cash in an envelope to your head office tomorrow afternoon after my bingo game?',
        timestamp: '04:15 PM',
        tacticUsed: 'Traditional banking distraction',
        timeDelaySec: 300,
      },
      {
        speaker: 'scammer',
        personaName: 'Scammer',
        avatar: '🚨',
        message: 'NO CASH! NO ENVELOPE! You must pay or click the link right now from your phone or your account is gone!',
        timestamp: '04:17 PM',
      },
      {
        speaker: 'persona',
        personaName: 'Grandma Martha',
        avatar: '👵',
        message: 'I tapped the blue link on my screen and it opened a recipe for apple crumble. Is this the verification page? Harold loved crumble with extra cinnamon.',
        timestamp: '04:23 PM',
        tacticUsed: 'Absurd technical misunderstanding',
        timeDelaySec: 360,
      },
    ],
    estimatedTimeWastedMinutes: 19,
  };
}
