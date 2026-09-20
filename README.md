# MindWell Wellness Journal

MindWell is a beginner-friendly MERN wellness journal for private reflection, mood tracking, and short breathing exercises. The project is intentionally split into a plain JavaScript React client and an Express/Mongoose server.

## Features

- Register, log in, log out, protected API routes, and friendly validation
- Journal CRUD with guided prompts, tags, pagination, and search
- AES-256-GCM encryption for journal content before storage
- Daily mood, energy, emotion check-ins, charts, and streaks
- Animated 4-7-8 breathing assistant with pause and reset controls
- Light/dark theme preference
- Premium demo upgrade with **₹299/month** display and no payment processing
- Protected JSON export for profile, journals, and moods
- Responsive mobile-friendly interface

## Project structure

```text
mindwell-wellness-journal/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/
│   ├── src/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── utils/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── package.json
└── README.md
```

## Run locally

Install all dependencies:

```bash
npm run install-all
```

Start the API and frontend together:

```bash
npm run dev
```

Or start them separately:

```bash
npm run server
npm run client
```

The Vite client runs on `http://localhost:5173` and proxies `/api` requests to the Express server on `http://localhost:5000`.

## Environment variables

Copy `server/.env.example` to `server/.env` and provide:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — server-only JWT signing secret
- `ENCRYPTION_KEY` — server-only key material used to derive the AES-256-GCM key
- `CLIENT_URL` — allowed browser origin
- `PORT` — API port, defaulting to `5000`

If `MONGO_URI` is not configured during development, MindWell uses an encrypted in-memory store so the app remains easy to explore. Production requires real secrets and MongoDB.

## API overview

All API routes are under `/api`.

| Area | Routes |
| --- | --- |
| Auth | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me` |
| Journals | `/journals`, `/journals/:id` |
| Moods | `/moods` |
| Analytics | `/analytics/dashboard`, `/analytics/moods` |
| Profile | `/users/profile`, `/users/premium` |
| Export | `/export` |

## Privacy and security

Journal text is never stored as readable text. Before a journal document is written, the server generates a unique IV, encrypts content with AES-256-GCM, and stores only `ciphertext`, `iv`, and `authTag` with the owner ID and metadata. Decryption occurs only after the authenticated owner has been verified.

Passwords are hashed with bcryptjs. JWT tokens authorize every user-owned route. The frontend stores only the auth token and never receives the journal encryption key.

## Premium demo

The Plus screen displays **₹299/month** for demonstration purposes only. Clicking the button directly enables the demo premium flag and displays:

> Demo mode: MindWell Plus enabled. No payment was processed.

There is no Razorpay, Stripe, UPI, card, checkout, or real transaction integration.

## Verification

```bash
npm run build
curl http://localhost:5000/api/healthz
```

The production build is generated in `client/dist`, which is ignored from version control.

## Migration summary

- Moved the real frontend from `artifacts/mindwell` into `client`.
- Moved the real API from `artifacts/api-server` into `server`.
- Converted application `.ts` and `.tsx` sources to `.js` and `.jsx`.
- Replaced generated workspace imports with local JavaScript client and validation modules.
- Added JavaScript Vite, Tailwind, Express, MongoDB, JWT, bcrypt, and npm configuration.
- Removed `artifacts`, `lib`, `scripts`, TypeScript configuration, pnpm workspace files, Replit configuration, generated build output, and TypeScript build metadata.
- Removed platform-specific visible wording and comments from the application.