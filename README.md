# ScamBait

An AI-powered cyber defense platform that wastes scammers' time instead of just blocking them. ScamBait analyzes an incoming scam message, flags malicious indicators (phone numbers, UPI IDs, suspicious URLs), generates a risk assessment, and deploys an AI persona to keep the scammer engaged in conversation — while quietly building a shared threat-intelligence blocklist from what it extracts.

Built for the **ASYNC'26 Cybersecurity & Defense track** by team **HackHive**.

## Why

Most anti-scam tools only play defense: detect a scam message, block it, done. The scammer moves on to the next victim within seconds, at zero cost to them. ScamBait goes on the offensive — every minute a scammer spends arguing with an AI persona is a minute they're not scamming a real person, and every detail they reveal in the process becomes data that protects the next potential victim.

## How it works

1. **Intake** — a scam message or email is pasted/forwarded into the app.
2. **Engage** — an AI persona (instructed to act confused but trusting, and to never reveal real personal or bank details) replies in character, drawing the scammer into an extended back-and-forth instead of a dead end.
3. **Extract** — as the conversation continues, useful details the scammer reveals (UPI IDs, phone numbers, bank account details, fake company names) are automatically pulled out.
4. **Report** — extracted information feeds a shared, anonymous blocklist to warn the next person, and can be used to file an official cybercrime report.

## Tech stack

- **Frontend:** React 19 + Vite + Tailwind CSS, with `motion` for animation and `lucide-react` for icons
- **Backend:** Express (run via `tsx`, TypeScript throughout)
- **AI:** Google Gemini API via `@google/genai`
- Built on the [google-gemini/aistudio-repository-template](https://github.com/google-gemini/aistudio-repository-template), so it's set up to run in Google AI Studio as well as locally

## Project structure

```
.
├── server.ts           # Express server entry point
├── server/              # Backend logic (API routes, persona/extraction calls)
├── src/                  # React frontend
├── index.html
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

## Getting started

### Prerequisites
- Node.js (recent LTS)
- A Gemini API key (get one from [Google AI Studio](https://aistudio.google.com))

### Setup

```bash
git clone https://github.com/shreyanayak108/ScamBait.git
cd ScamBait
npm install
cp .env.example .env
```

Edit `.env` and set:

```
GEMINI_API_KEY="your-actual-gemini-api-key"
APP_URL="http://localhost:5173"   # or your deployed URL
```

### Run

```bash
npm run dev      # starts the server via tsx (server.ts)
```

Other scripts:
- `npm run build` — production build (Vite)
- `npm run start` — same as dev, for production run via tsx
- `npm run preview` — preview the built app
- `npm run lint` — type-check with `tsc --noEmit`
- `npm run clean` — remove build output

## Roadmap / ideas for extension

- Multilingual personas (Hindi and other regional languages, not just English)
- A "detect-only" risk verdict shown before baiting starts
- Auto-prefilled cybercrime complaint packet (India's 1930/NCRP format)
- Verified-only blocklist (require multiple independent reports before publishing an identifier)
- Family Shield mode for protecting less tech-savvy relatives
- Community leaderboard of total scammer time wasted

## Team — HackHive

- V S Sreeman Narayan
- Srijan Salian
- Shreya Nayak
- Vaishnavi Shetty

## Disclaimer

ScamBait's AI persona is designed to never share real personal, banking, or authentication details. This project is for educational and defensive research purposes as part of a hackathon submission.
