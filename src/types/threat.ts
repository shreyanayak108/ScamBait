export type ScamCategory = 
  | 'kyc_banking'
  | 'job_scam'
  | 'lottery_prize'
  | 'tech_support'
  | 'romance_investment'
  | 'courier_customs'
  | 'utility_bill'
  | 'other';

export type ThreatLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface TriggeredPhrase {
  phrase: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Indicators {
  upiIds: string[];
  phoneNumbers: string[];
  urls: string[];
  bankAccounts: string[];
  brandsImpersonated: string[];
  cryptoWallets: string[];
  emailAddresses?: string[];
}

export interface PatternFingerprint {
  clusterId: string;
  clusterName: string;
  similarityMatchPercent: number;
  knownVictimsTargeted: number;
  firstSeenDaysAgo: number;
  variantFamily: string;
  behaviorTactic: string;
}

export interface PersonaReply {
  speaker: 'scammer' | 'persona';
  personaName: string;
  avatar: string;
  message: string;
  timestamp: string;
  tacticUsed?: string;
  timeDelaySec?: number;
}

export interface AnalysisResult {
  id: string;
  originalMessage: string;
  category: ScamCategory;
  categoryLabel: string;
  riskScore: number; // 0 - 100
  threatLevel: ThreatLevel;
  justification: string;
  indicators: Indicators;
  triggeredPhrases: TriggeredPhrase[];
  fingerprint: PatternFingerprint;
  psychologicalTriggers: string[];
  urgencyTactics: string[];
  recommendedAction: string;
  selectedPersona: {
    id: string;
    name: string;
    role: string;
    strategy: string;
    avatar: string;
  };
  baitConversation: PersonaReply[];
  estimatedTimeWastedMinutes: number;
  detectedLanguage?: string;
  analyzedAt: string;
}

export interface BlocklistEntry {
  id: string;
  type: 'upi' | 'phone' | 'url' | 'bank' | 'wallet';
  value: string;
  category: ScamCategory;
  categoryLabel: string;
  threatLevel: ThreatLevel;
  flagCount: number;
  firstReported: string;
  lastSeen: string;
  impersonatedBrand?: string;
  status: 'active_trap' | 'confirmed_malicious' | 'flagged';
  notes?: string;
}

export interface DemoCase {
  id: string;
  title: string;
  category: ScamCategory;
  categoryLabel: string;
  badgeColor: string;
  threatLevel: ThreatLevel;
  previewText: string;
  fullMessage: string;
  suggestedPersonaId: string;
}
