import { DemoCase, AnalysisResult } from '../types/threat';

export const DEMO_CASES: DemoCase[] = [
  {
    id: 'demo-kyc-bank',
    title: '1. Fake Bank KYC Update (SBI / HDFC)',
    category: 'kyc_banking',
    categoryLabel: 'Banking KYC Suspension',
    badgeColor: 'text-red-400 border-red-500/30 bg-red-500/10',
    threatLevel: 'CRITICAL',
    previewText: 'Dear customer, your SBI account will be BLOCKED in 24 hours. Update KYC immediately...',
    fullMessage: `[URGENT ALERT] Dear SBI Customer, your bank account no. ending in **4821 will be PERMANENTLY BLOCKED within 24 hours due to non-compliance of RBI KYC regulations. 

To avoid legal freeze and penalty fee of Rs. 4,500/-, immediately update your PAN & Aadhaar documents by visiting our secure verification portal:
http://sbi-kyc-portal-update24.live/verify-login.php

If portal fails, call Senior Nodal Verification Officer Mr. Rajesh Sharma immediately at +91 98762 14389. To fast-track bypass penalty, deposit Rs. 1 token to verification UPI: sbi.nodaldesk@ybl for security clearance.

Failure to act today will result in total freeze of funds.
- SBI Regulatory Compliance Cell`,
    suggestedPersonaId: 'martha',
  },
  {
    id: 'demo-job-offer',
    title: '2. Part-Time YouTube / Telegram Job Offer',
    category: 'job_scam',
    categoryLabel: 'Remote Task / Job Scam',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    threatLevel: 'HIGH',
    previewText: 'Earn ₹3,500 - ₹8,000/day just by liking YouTube videos and rating Google Maps...',
    fullMessage: `Hello dear! I am Priya Sharma, HR Director at Amazon Global Media Partner Services. We reviewed your resume online and you are selected for our part-time Work-From-Home Job!

Your daily duty is simple: Like YouTube video songs, subscribe to movie trailers, and rate Google Maps locations.
* Daily payout: Rs. 3,500 to Rs. 8,500 daily instant settlement.
* Time needed: Only 20-30 minutes per day on mobile phone.

To activate your Employee Work ID and reserve your daily task slot, you must pay a 100% refundable security registration deposit of Rs. 1,499/- to our Corporate Vendor Account:
Bank Name: Axis Bank Ltd
Account Number: 923010048192837
IFSC: UTIB0002194
Beneficiary: CloudMedia Tech Enterprises

Send payment receipt screenshot immediately to our Telegram Mentor: @HR_Priya_Amazon_VIP or WhatsApp +91 88261 90412. Limited 5 slots remaining today!`,
    suggestedPersonaId: 'clueless_intern',
  },
  {
    id: 'demo-lottery-prize',
    title: '3. KBC / WhatsApp Cash Lottery Win',
    category: 'lottery_prize',
    categoryLabel: 'Lottery / Prize Fraud',
    badgeColor: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    threatLevel: 'HIGH',
    previewText: 'CONGRATULATIONS! Your mobile number won 25 Lakhs in KBC All India SIM Lucky Draw...',
    fullMessage: `CONGRATULATIONS!! 🎊🎉
Dear WhatsApp User, your mobile SIM number has been selected as the 1st PRIZE WINNER of Rs. 25,00,000/- (Twenty Five Lakhs) in the All India SIM Card Lucky Draw 2026 organized by KBC (Kaun Banega Crorepati) & Jio-Airtel Mega Contest!

Your Lucky Draw File No: KBC-9921/WIN
Winner Code: KBC#782

To claim your 25 Lakh cash prize directly into your bank account without tax deduction, do NOT call regular customer care. You must contact KBC Head Office Claim Manager Mr. Vikram Rathore on official WhatsApp only:
WhatsApp: +91 70442 81923
Official Claim Certificate link: http://kbc-lottery-winner2026.online/claim-cert.html

Note: Beware of fake lottery calls. Only our WhatsApp manager +91 70442 81923 is authorized to release cheque disbursement code. Processing fee must be cleared before 6:00 PM.`,
    suggestedPersonaId: 'retiree',
  },
  {
    id: 'demo-tech-support',
    title: '4. Microsoft / Windows Critical Virus Alert',
    category: 'tech_support',
    categoryLabel: 'Tech Support Impersonation',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    threatLevel: 'CRITICAL',
    previewText: 'CRITICAL ALERT from Microsoft Windows Defender: Zeus Trojan Virus detected! Call immediately...',
    fullMessage: `** CRITICAL SYSTEM SECURITY ALERT - ERROR #0x80070422 **
Microsoft Windows Defender has detected a malicious Trojan Horse 'Zeus.Spyware.v4' on your computer system!

Your personal banking passwords, credit card credentials, webcam feed, and social media accounts are being transmitted to an unauthorized Russian IP address (185.220.101.5).

YOUR COMPUTER HAS BEEN BLOCKED FOR SAFETY.
DO NOT RESTART OR TURN OFF YOUR PC. DOING SO WILL CAUSE PERMANENT HARD DRIVE CORRUPTION AND IDENTITY THEFT.

Call Certified Microsoft Senior Security Engineering Desk immediately at our 24/7 Toll-Free Helpline:
Toll-Free Helpline: +1 888-492-3104 or Direct Line: +1 800-241-9981

Our technician will guide you to connect via secure remote tool http://anydesk-support-agent.net/connect-remote to disinfect your Windows registry and issue a lifetime firewall certificate.`,
    suggestedPersonaId: 'martha',
  },
  {
    id: 'demo-romance-investment',
    title: '5. Crypto Liquidity Pool / Romance Scam',
    category: 'romance_investment',
    categoryLabel: 'Romance / Crypto Ponzi',
    badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    threatLevel: 'CRITICAL',
    previewText: 'Hello darling, my uncle in Singapore trading house gave me insider arbitrage nodes...',
    fullMessage: `Hello my dear, I hope you are having a wonderful evening ❤️. I was looking at our chat from yesterday and thinking about our future travel plans together. 

I really want us to be financially free so you don't have to work long stress hours anymore. My uncle who is vice president at Singapore Quantitative Capital just told me the private liquidity arbitrage node for Tether (USDT) opened up for 48 hours only. It generates 18.5% guaranteed profit every 8 hours with zero market risk.

I already deposited $50,000 and earned $9,250 this morning! I want you to make money with me too. You don't need much to start, just transfer 1,000 USDT to the private node smart contract:
USDT (TRC20) Wallet: TX9rW7uM4VbEq81xPnK28yL45jZq11v9B7

Once you send the transaction hash, open our private VIP dapp http://defi-arbitrage-vault-yield.org and connect your wallet. I promise I will guide you step by step my love.`,
    suggestedPersonaId: 'compliance_officer',
  },
];

export const PRECOMPUTED_DEMO_RESULTS: Record<string, AnalysisResult> = {
  'demo-kyc-bank': {
    id: 'res-kyc-bank-sbi',
    originalMessage: DEMO_CASES[0].fullMessage,
    category: 'kyc_banking',
    categoryLabel: 'Banking KYC Suspension',
    riskScore: 98,
    threatLevel: 'CRITICAL',
    justification: 'Critical threat. Impersonates State Bank of India (SBI) with synthetic urgency ("blocked in 24 hours"), a fake phishing portal, malicious phone number, and demands unverified UPI token payments to bypass nonexistent regulatory penalties.',
    indicators: {
      upiIds: ['sbi.nodaldesk@ybl'],
      phoneNumbers: ['+91 98762 14389'],
      urls: ['http://sbi-kyc-portal-update24.live/verify-login.php'],
      bankAccounts: ['SBI A/C ending in 4821 (Impersonated target)'],
      brandsImpersonated: ['State Bank of India (SBI)', 'Reserve Bank of India (RBI)'],
      cryptoWallets: [],
      emailAddresses: [],
    },
    triggeredPhrases: [
      { phrase: 'PERMANENTLY BLOCKED within 24 hours', reason: 'High-pressure manufactured urgency tactic designed to cause panic', severity: 'high' },
      { phrase: 'penalty fee of Rs. 4,500/-', reason: 'Coercive extortion threat to incentivize compliance', severity: 'high' },
      { phrase: 'sbi-kyc-portal-update24.live', reason: 'Deceptive typo-squatted phishing domain registered on cheap TLD', severity: 'high' },
      { phrase: 'deposit Rs. 1 token to verification UPI: sbi.nodaldesk@ybl', reason: 'Classic UPI reverse-charge / account harvesting trap', severity: 'high' }
    ],
    fingerprint: {
      clusterId: 'CLUSTER-IN-KYC-942',
      clusterName: 'Jamtara-Mewat KYC Extortion Grid',
      similarityMatchPercent: 96,
      knownVictimsTargeted: 432,
      firstSeenDaysAgo: 19,
      variantFamily: 'SBI-RBI Regulatory Impersonation Script v4.2',
      behaviorTactic: 'SMS blast with phishing login URL + secondary Vishing helpline + UPI reverse token capture',
    },
    psychologicalTriggers: [
      'Panic & Account Freeze Fear',
      'Artificial 24-Hour Time Limit',
      'Authority Impersonation (RBI/SBI Nodal Officer)',
      'Threat of Monetary Penalty (Rs 4,500)'
    ],
    urgencyTactics: [
      '24-Hour Account Freeze Warning',
      'Threat of Legal Action',
      'Immediate Token Payment Demand'
    ],
    recommendedAction: 'DO NOT click the link or send 1 Re to the UPI ID. Forward this SMS to 1930 (Indian National Cyber Crime Reporting Portal) and block the phone number immediately.',
    selectedPersona: {
      id: 'martha',
      name: 'Grandma Martha (73 yrs)',
      role: 'Confused, overly polite grandmother',
      strategy: 'Struggles with smartphone controls, asks endless questions about grandchildren, pretends UPI PIN is knitting pattern number.',
      avatar: '👵',
    },
    baitConversation: [
      {
        speaker: 'scammer',
        personaName: 'Scammer (Fake SBI Officer)',
        avatar: '🚨',
        message: 'Dear SBI Customer, your bank account no. ending in **4821 will be PERMANENTLY BLOCKED within 24 hours. Update KYC immediately or pay Rs. 1 token to sbi.nodaldesk@ybl!',
        timestamp: '10:14 AM'
      },
      {
        speaker: 'persona',
        personaName: 'Grandma Martha',
        avatar: '👵',
        message: 'Oh heavens, Mr. Rajesh! I nearly dropped my reading glasses in my tea. My late husband Harold always handled the passbooks at the branch with Mr. Gupta. Is the bank on Station Road flooded again? Which button do I press on this glass telephone?',
        timestamp: '10:17 AM',
        tacticUsed: 'Feigned helplessness & distraction with irrelevant backstory',
        timeDelaySec: 180
      },
      {
        speaker: 'scammer',
        personaName: 'Scammer (Fake SBI Officer)',
        avatar: '🚨',
        message: 'Madam don’t waste time! Click http://sbi-kyc-portal-update24.live or open Google Pay right now and send 1 rupee to sbi.nodaldesk@ybl! Otherwise police complaint will freeze all your fixed deposits!',
        timestamp: '10:19 AM'
      },
      {
        speaker: 'persona',
        personaName: 'Grandma Martha',
        avatar: '👵',
        message: 'Police complaint?! Lord have mercy! I opened the Google Pay icon you said, but it asks for a 6-digit Secret PIN. Harold wrote down 1-9-5-1 which is our wedding year, but the screen said "Payment Failed: Insufficient Bank Balance in Pension Account". Can I send you a physical post office money order instead dear? I have 25 postal stamps here.',
        timestamp: '10:24 AM',
        tacticUsed: 'Fake payment attempt failure, wasting scammer cycles on troubleshooting',
        timeDelaySec: 300
      },
      {
        speaker: 'scammer',
        personaName: 'Scammer (Fake SBI Officer)',
        avatar: '🚨',
        message: 'No stamps madam! What other bank card do you have? Check your purse! Read me the 16 digit number on front of your debit card and the expiry date quickly!!',
        timestamp: '10:26 AM'
      },
      {
        speaker: 'persona',
        personaName: 'Grandma Martha',
        avatar: '👵',
        message: 'Let me look in my crochet bag... Ah yes, I found a shiny plastic card! It says "More Supermarket Loyalty Savings Club", card number 4920 1182 3901 8842, valid until December 2029. Does this work for the Reserve Bank dear? The print is so small, let me fetch my magnifying loupe.',
        timestamp: '10:32 AM',
        tacticUsed: 'Sending worthless supermarket loyalty number to exhaust attacker patience',
        timeDelaySec: 360
      }
    ],
    estimatedTimeWastedMinutes: 18,
    detectedLanguage: 'English (Indian Banking Context)',
    analyzedAt: 'Just now',
  },
  'demo-job-offer': {
    id: 'res-job-offer-amazon',
    originalMessage: DEMO_CASES[1].fullMessage,
    category: 'job_scam',
    categoryLabel: 'Remote Task / Job Scam',
    riskScore: 94,
    threatLevel: 'CRITICAL',
    justification: 'High-risk task/recruitment scam. Impersonates Amazon HR, lures victim with unrealistically inflated part-time wages (₹3500-₹8500/day for liking videos), demands an advance "refundable security fee" to a third-party Axis Bank account, and redirects to Telegram.',
    indicators: {
      upiIds: [],
      phoneNumbers: ['+91 88261 90412'],
      urls: [],
      bankAccounts: ['Axis Bank Ltd A/C: 923010048192837, IFSC: UTIB0002194 (Beneficiary: CloudMedia Tech Enterprises)'],
      brandsImpersonated: ['Amazon Global Media Partner Services', 'YouTube', 'Google Maps'],
      cryptoWallets: [],
      emailAddresses: [],
    },
    triggeredPhrases: [
      { phrase: 'Rs. 3,500 to Rs. 8,500 daily instant settlement', reason: 'Unrealistic return-on-effort typical of task-deposit pyramid schemes', severity: 'high' },
      { phrase: '100% refundable security registration deposit of Rs. 1,499/-', reason: 'Advance fee fraud (victim deposits money and never recovers it)', severity: 'high' },
      { phrase: 'Axis Bank Account Number: 923010048192837', reason: 'Mule account used for funneling fraudulent deposits', severity: 'high' },
      { phrase: '@HR_Priya_Amazon_VIP', reason: 'Off-platform steering to unmonitored Telegram channel', severity: 'medium' }
    ],
    fingerprint: {
      clusterId: 'CLUSTER-ASIA-TASK-108',
      clusterName: 'Southeast Asia "Like & Subscribe" Task Syndicate',
      similarityMatchPercent: 94,
      knownVictimsTargeted: 890,
      firstSeenDaysAgo: 45,
      variantFamily: 'Amazon HR Task Fee Funnel v2.8',
      behaviorTactic: 'Lure via WhatsApp -> Task trial on Telegram -> Fake bonus dashboard -> Large crypto/bank lock-in',
    },
    psychologicalTriggers: [
      'Easy Wealth & Greed Lure',
      'Artificial Scarcity ("Limited 5 slots remaining")',
      'False Assurance ("100% refundable")',
      'Big Tech Brand Borrowing (Amazon/Google)'
    ],
    urgencyTactics: [
      'Only 5 slots remaining today',
      'Immediate payment receipt requirement'
    ],
    recommendedAction: 'Do NOT transfer money. Legitimate companies never charge candidates an onboarding or registration fee. Report the Axis Bank account to cybercrime.gov.in and block the recruiter.',
    selectedPersona: {
      id: 'clueless_intern',
      name: 'Rohan - Clueless College Fresher',
      role: 'Overeager, technologically confused applicant',
      strategy: 'Eager to work, constantly asks absurd administrative questions, uploads corrupted screenshots, asks for official tax invoice.',
      avatar: '🧑‍💻',
    },
    baitConversation: [
      {
        speaker: 'scammer',
        personaName: 'Scammer (HR Priya)',
        avatar: '💼',
        message: 'Hello! I am Priya Sharma from Amazon. You are selected for Rs 5,000/day job liking YouTube videos! Pay Rs 1,499 registration fee to Axis Bank 923010048192837 immediately to begin.',
        timestamp: '11:02 AM'
      },
      {
        speaker: 'persona',
        personaName: 'Rohan (Intern)',
        avatar: '🧑‍💻',
        message: 'Respected Priya Ma’am! Wow, Amazon is my dream company! My college placement officer said Amazon gives free laptops and blue t-shirts. Will the blue t-shirt come in size Medium? Also I already went ahead and subscribed to 47 Bhojpuri music videos on YouTube to show my dedication!',
        timestamp: '11:05 AM',
        tacticUsed: 'Enthusiastic diversion with irrelevant corporate perk requests',
        timeDelaySec: 180
      },
      {
        speaker: 'scammer',
        personaName: 'Scammer (HR Priya)',
        avatar: '💼',
        message: 'Yes yes t-shirt will come later! First send Rs 1499 to Axis Bank account right now and send screenshot on Telegram @HR_Priya_Amazon_VIP. Only 2 slots left!',
        timestamp: '11:07 AM'
      },
      {
        speaker: 'persona',
        personaName: 'Rohan (Intern)',
        avatar: '🧑‍💻',
        message: 'Ma\'am I tried doing NEFT transfer from my Father’s account, but his bank manager says CloudMedia Tech Enterprises is registered as a poultry feed trading firm in Surat. Should I put GST number in the remark field? My dad is asking for your Corporate Identification Number (CIN) for his income tax audit.',
        timestamp: '11:12 AM',
        tacticUsed: 'Exposing mismatch in mule account company registration to rattle scammer',
        timeDelaySec: 300
      }
    ],
    estimatedTimeWastedMinutes: 15,
    detectedLanguage: 'English (Job Recruitment Context)',
    analyzedAt: 'Just now',
  },
  'demo-lottery-prize': {
    id: 'res-lottery-kbc',
    originalMessage: DEMO_CASES[2].fullMessage,
    category: 'lottery_prize',
    categoryLabel: 'Lottery / Prize Fraud',
    riskScore: 95,
    threatLevel: 'CRITICAL',
    justification: 'Classic advance-fee lottery scam. Impersonates popular TV show Kaun Banega Crorepati (KBC) and telecom operators with fake 25 Lakh prize claim, routing to an unverified WhatsApp number and phishing link to extract "processing fees".',
    indicators: {
      upiIds: [],
      phoneNumbers: ['+91 70442 81923'],
      urls: ['http://kbc-lottery-winner2026.online/claim-cert.html'],
      bankAccounts: [],
      brandsImpersonated: ['Kaun Banega Crorepati (KBC)', 'Reliance Jio', 'Bharti Airtel'],
      cryptoWallets: [],
      emailAddresses: [],
    },
    triggeredPhrases: [
      { phrase: '1st PRIZE WINNER of Rs. 25,00,000/-', reason: 'Unsolicited windfall reward lure without user participation', severity: 'high' },
      { phrase: 'kbc-lottery-winner2026.online', reason: 'Freshly registered suspicious TLD pretending to be Sony/KBC media portal', severity: 'high' },
      { phrase: 'Processing fee must be cleared before 6:00 PM', reason: 'Advance fee demand disguised as administrative processing', severity: 'high' },
      { phrase: 'contact KBC Head Office Claim Manager Mr. Vikram Rathore on official WhatsApp only', reason: 'Bypassing telecom logs by pushing user to WhatsApp encrypted chat', severity: 'medium' }
    ],
    fingerprint: {
      clusterId: 'CLUSTER-IN-KBC-319',
      clusterName: 'KBC SIM Lottery Syndicate',
      similarityMatchPercent: 98,
      knownVictimsTargeted: 1240,
      firstSeenDaysAgo: 120,
      variantFamily: 'KBC 25 Lakh SIM Draw Audio-Poster v9.1',
      behaviorTactic: 'Fake WhatsApp audio note + forged certificate graphic + GST / Customs processing fee demand',
    },
    psychologicalTriggers: [
      'Euphoric Greed & Windfall Bias',
      'Celebrity / Trusted Media Authority (Amitabh Bachchan / KBC)',
      'Fear of Missing Out (FOMO before 6:00 PM)',
      'False Secrecy ("do not call regular customer care")'
    ],
    urgencyTactics: [
      'Processing fee deadline at 6:00 PM today',
      'Prize file forfeiture warning'
    ],
    recommendedAction: 'Never pay money to claim a prize you did not enter. True lotteries do not ask for WhatsApp communications or upfront fees. Block +91 70442 81923 immediately.',
    selectedPersona: {
      id: 'retiree',
      name: 'Balwant Singh (68 yrs)',
      role: 'Over-excited retired railway clerk',
      strategy: 'Pretends he wants to donate the 25 lakhs to village cow shelter, asks for Amitabh Bachchan’s voice message confirmation.',
      avatar: '👴🏽',
    },
    baitConversation: [
      {
        speaker: 'scammer',
        personaName: 'Scammer (KBC Manager Vikram)',
        avatar: '🎉',
        message: 'Congratulations! Your SIM won Rs. 25,00,000 in KBC Lucky Draw! Contact WhatsApp manager +91 70442 81923 and pay processing fee Rs 12,500 before 6 PM!',
        timestamp: '02:20 PM'
      },
      {
        speaker: 'persona',
        personaName: 'Balwant Singh',
        avatar: '👴🏽',
        message: 'Jai Sri Krishna Vikram Ji! Oh my God, 25 Lakhs! I have watched every episode of Amitabh Bachchan Sir since 2000! My wife is currently distributing laddoos in our entire railway colony! Will Amitabh ji come to our house in Kanpur with the big cardboard cheque?',
        timestamp: '02:23 PM',
        tacticUsed: 'Enthusiastic buy-in that leads scammer to believe the mark is 100% hooked',
        timeDelaySec: 180
      },
      {
        speaker: 'scammer',
        personaName: 'Scammer (KBC Manager Vikram)',
        avatar: '🎉',
        message: 'Yes yes Amitabh Bachchan will do video call once government tax of Rs 12,500 is paid! Pay quickly to our account otherwise lottery file will be cancelled!',
        timestamp: '02:25 PM'
      },
      {
        speaker: 'persona',
        personaName: 'Balwant Singh',
        avatar: '👴🏽',
        message: 'Vikram Ji, you are like my son. Since you have my 25,00,000 rupees sitting right there in front of you, please deduct the 12,500 rupees from that pile, keep an extra 10,000 for your sweets and tea, and transfer the remaining 24,77,500 to my State Bank passbook! Isn’t that so much simpler?',
        timestamp: '02:29 PM',
        tacticUsed: 'The classic "deduct it from the winnings" trap that scammers cannot logically counter',
        timeDelaySec: 240
      }
    ],
    estimatedTimeWastedMinutes: 22,
    detectedLanguage: 'English / Hindi Hinglish Context',
    analyzedAt: 'Just now',
  },
  'demo-tech-support': {
    id: 'res-tech-support-msft',
    originalMessage: DEMO_CASES[3].fullMessage,
    category: 'tech_support',
    categoryLabel: 'Tech Support Impersonation',
    riskScore: 99,
    threatLevel: 'CRITICAL',
    justification: 'Severe tech support scareware scam. Uses fabricated system error codes (#0x80070422), fake malware threats ("Zeus.Spyware.v4"), toll-free impersonation numbers, and tries to coerce victims into installing remote access tools (AnyDesk/TeamViewer).',
    indicators: {
      upiIds: [],
      phoneNumbers: ['+1 888-492-3104', '+1 800-241-9981'],
      urls: ['http://anydesk-support-agent.net/connect-remote'],
      bankAccounts: [],
      brandsImpersonated: ['Microsoft Windows Defender', 'Microsoft Corporation'],
      cryptoWallets: [],
      emailAddresses: [],
    },
    triggeredPhrases: [
      { phrase: 'CRITICAL SYSTEM SECURITY ALERT - ERROR #0x80070422', reason: 'Fabricated BSOD/error code designed to mimic operating system alarms', severity: 'high' },
      { phrase: 'DO NOT RESTART OR TURN OFF YOUR PC', reason: 'High-coercion instruction to stop user from rebooting (which would dismiss the browser popup)', severity: 'high' },
      { phrase: 'http://anydesk-support-agent.net/connect-remote', reason: 'Trojanized / phishing domain spoofing AnyDesk remote management software', severity: 'high' },
      { phrase: 'Toll-Free Helpline: +1 888-492-3104', reason: 'Inbound VoIP toll-free number connected to boiler-room call center', severity: 'high' }
    ],
    fingerprint: {
      clusterId: 'CLUSTER-GLOBAL-TECH-771',
      clusterName: 'Kolkata/NCR Tech Support Boiler Room Network',
      similarityMatchPercent: 97,
      knownVictimsTargeted: 2150,
      firstSeenDaysAgo: 180,
      variantFamily: 'Zeus Defender ScreenLocker v11',
      behaviorTactic: 'Browser fullscreen lockup -> Audio siren -> VoIP remote desktop session -> Fake syskey lock -> $500 Target gift cards',
    },
    psychologicalTriggers: [
      'Acute Tech Phobia & Data Loss Terror',
      'Webcam & Identity Blackmail Threat',
      'Urgency through "Do Not Turn Off Your PC" Command',
      'Microsoft Brand Authority'
    ],
    urgencyTactics: [
      'Permanent hard drive corruption threat',
      'Banking credentials actively leaking'
    ],
    recommendedAction: 'Close the browser tab using Task Manager (Ctrl+Shift+Esc or Cmd+Option+Esc). Never call the phone number or grant remote access. Microsoft will NEVER pop up a phone number to call.',
    selectedPersona: {
      id: 'martha',
      name: 'Grandma Martha (73 yrs)',
      role: 'Non-technical senior citizen',
      strategy: 'Mistakes the CD-ROM tray for a cup holder, asks if the mouse pointer is an actual rodent, reads random cereal box barcodes instead of serial numbers.',
      avatar: '👵',
    },
    baitConversation: [
      {
        speaker: 'scammer',
        personaName: 'Scammer (Tech Agent "David")',
        avatar: '🖥️',
        message: 'Microsoft Defender Alert! Zeus virus detected. Call +1 888-492-3104 immediately and go to anydesk-support-agent.net to connect remote session!',
        timestamp: '03:10 PM'
      },
      {
        speaker: 'persona',
        personaName: 'Grandma Martha',
        avatar: '👵',
        message: 'Hello David? Oh thank heavens you called. My screen is flashing bright red and making a beeping sound like my microwave when the baked potatoes are finished. Is Zeus the Greek god who does lightning? Did lightning strike my telephone wires?',
        timestamp: '03:13 PM',
        tacticUsed: 'Absurd literal interpretation of malware terminology',
        timeDelaySec: 180
      },
      {
        speaker: 'scammer',
        personaName: 'Scammer (Tech Agent "David")',
        avatar: '🖥️',
        message: 'No ma\'am! Hackers are inside your PC! Look at your keyboard, find the Windows key between Ctrl and Alt, and press the letter R! Tell me what you see!',
        timestamp: '03:15 PM'
      },
      {
        speaker: 'persona',
        personaName: 'Grandma Martha',
        avatar: '👵',
        message: 'Between Ctrl and Alt? Dear, I am looking at my keyboard right now. Between the C and the A there is only cookie crumbs and some Earl Grey tea residue. Wait, let me blow on it... *cough cough*. Oh, now my spacebar came off in my hand. Do I put superglue on it?',
        timestamp: '03:19 PM',
        tacticUsed: 'Pretending hardware is physically falling apart to stall keyboard shortcuts',
        timeDelaySec: 240
      },
      {
        speaker: 'scammer',
        personaName: 'Scammer (Tech Agent "David")',
        avatar: '🖥️',
        message: 'DON’T GLUE THE SPACEBAR! Just open the internet browser! The blue E or the circle with green and red and yellow!',
        timestamp: '03:21 PM'
      },
      {
        speaker: 'persona',
        personaName: 'Grandma Martha',
        avatar: '👵',
        message: 'I see a round green thing... oh wait, that’s my tin of Vicks VapoRub on the desk. Let me move it aside. Okay, now I typed "w-w-w-dot-any-desk" into Google, and it is showing me pictures of mahogany writing desks at IKEA for $149. Is that the desk you want me to buy for Microsoft?',
        timestamp: '03:26 PM',
        tacticUsed: 'Deliberate semantic confusion between software and physical furniture',
        timeDelaySec: 300
      }
    ],
    estimatedTimeWastedMinutes: 28,
    detectedLanguage: 'English (US/UK Technical Context)',
    analyzedAt: 'Just now',
  },
  'demo-romance-investment': {
    id: 'res-romance-crypto',
    originalMessage: DEMO_CASES[4].fullMessage,
    category: 'romance_investment',
    categoryLabel: 'Romance / Crypto Ponzi (Sha Zhu Pan)',
    riskScore: 97,
    threatLevel: 'CRITICAL',
    justification: 'Severe "Pig Butchering" (Sha Zhu Pan) romance/crypto fraud. Exploits emotional bonding and false intimacy, claims non-existent insider arbitrage yields (18.5% every 8 hrs), provides a malicious TRC20 wallet address and illegitimate DeFi portal URL.',
    indicators: {
      upiIds: [],
      phoneNumbers: [],
      urls: ['http://defi-arbitrage-vault-yield.org'],
      bankAccounts: [],
      brandsImpersonated: ['Singapore Quantitative Capital (Fictitious)', 'Tether (USDT)'],
      cryptoWallets: ['TX9rW7uM4VbEq81xPnK28yL45jZq11v9B7 (TRON TRC20)'],
      emailAddresses: [],
    },
    triggeredPhrases: [
      { phrase: 'thinking about our future travel plans together', reason: 'Emotional manipulation priming victim through romantic rapport', severity: 'high' },
      { phrase: 'generates 18.5% guaranteed profit every 8 hours with zero market risk', reason: 'Impossible financial yield claim characteristic of crypto Ponzi scams', severity: 'high' },
      { phrase: 'USDT (TRC20) Wallet: TX9rW7uM4VbEq81xPnK28yL45jZq11v9B7', reason: 'Unregulated anonymous crypto deposit address', severity: 'high' },
      { phrase: 'defi-arbitrage-vault-yield.org', reason: 'Fraudulent smart-contract drainer web app', severity: 'high' }
    ],
    fingerprint: {
      clusterId: 'CLUSTER-SEA-PIGBUTCHER-501',
      clusterName: 'Mekong Cyber Compound "Golden Triangle" Syndicate',
      similarityMatchPercent: 95,
      knownVictimsTargeted: 670,
      firstSeenDaysAgo: 60,
      variantFamily: 'Sha Zhu Pan Wealth Grooming v6.4',
      behaviorTactic: 'Weeks of romantic grooming -> Fake high-yield liquidity pool -> Fake small withdrawal allowed -> Complete wallet drain',
    },
    psychologicalTriggers: [
      'Romantic Affection & Future Love Promise',
      'Greed & Exaggerated Wealth Independence',
      'Exclusive "Insider Information" Framing',
      'Artificial Safe Haven Claim ("zero market risk")'
    ],
    urgencyTactics: [
      'Node open for 48 hours only',
      'Limited arbitrage cycle expiration'
    ],
    recommendedAction: 'Never send cryptocurrency to anyone you have only met online. Disconnect any Web3 wallet that interacted with the domain. Report the TRC20 address to Chainabuse / ScamAdviser and cease all contact.',
    selectedPersona: {
      id: 'compliance_officer',
      name: 'Agent Vance - Compliance Auditor',
      role: 'Bureaucratic financial compliance officer pretender',
      strategy: 'Pretends to love the scammer, but insists on sending official FinCEN Form 8300 and anti-money-laundering questionnaires before every transaction.',
      avatar: '🕵️‍♂️',
    },
    baitConversation: [
      {
        speaker: 'scammer',
        personaName: 'Scammer ("Elena")',
        avatar: '🌹',
        message: 'Hello my love ❤️ My uncle opened the 18.5% liquidity node! Send 1,000 USDT to TX9rW7uM4VbEq81xPnK28yL45jZq11v9B7 so we can buy our beach house!',
        timestamp: '08:45 PM'
      },
      {
        speaker: 'persona',
        personaName: 'Agent Vance',
        avatar: '🕵️‍♂️',
        message: 'Dearest Elena! My heart fluttered when I read about the beach house with palm trees. However, as Chief Risk Auditor at my firm, SEC Rule 17a-8 requires me to perform formal Know-Your-Customer (KYC) counterparty due diligence on your uncle’s Cayman offshore trust entity. Could you please send his LEI (Legal Entity Identifier) number and Form W-8BEN-E?',
        timestamp: '08:49 PM',
        tacticUsed: 'Counter-compliance trap demanding authentic financial regulatory disclosures',
        timeDelaySec: 240
      },
      {
        speaker: 'scammer',
        personaName: 'Scammer ("Elena")',
        avatar: '🌹',
        message: 'Honey why are you talking so complicated with business papers?! Don’t you trust me and our love?! The node closes in 6 hours, just transfer the USDT quickly, my uncle will take care of tax!',
        timestamp: '08:52 PM'
      },
      {
        speaker: 'persona',
        personaName: 'Agent Vance',
        avatar: '🕵️‍♂️',
        message: 'Darling, I trust you with all my soul! That’s why I have drafted a 42-page Notarized Power of Attorney document naming you the sole beneficiary of my $850,000 retirement 401(k). I just need your uncle’s corporate tax residency certificate from the Singapore Monetary Authority so my wire officer can release the $850,000. Can he email that by noon tomorrow?',
        timestamp: '08:58 PM',
        tacticUsed: 'Dangling an enormous $850,000 fake prize to bait the scammer into wasting days waiting for documents',
        timeDelaySec: 360
      }
    ],
    estimatedTimeWastedMinutes: 34,
    detectedLanguage: 'English (Romantic Manipulation Context)',
    analyzedAt: 'Just now',
  },
};
