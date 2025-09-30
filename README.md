# Cross-Chain Wallet (ZetaChain demo)

A Vite + React + TypeScript app with a lightweight Express API. It showcases a cross-chain wallet dashboard, deposits/withdrawals, vault status, and history views, using ethers v6 and mock chain/token configs.

Key features
- Pages: Home, Dashboard, Deposit, Withdraw, History, Vault, Connect Wallet
- Dark mode UI with Tailwind CSS, icons via lucide-react
- State via Zustand, routing via React Router
- Charts via Recharts, toasts via react-hot-toast
- API server (Express) for local development, proxied by Vite
- Vercel-ready serverless routing

Tech stack
- Frontend: Vite + React + TypeScript, Tailwind CSS
- State/UI: Zustand, lucide-react, @headlessui/react, @heroicons/react
- Blockchain: ethers v6, mock chain/token configs
- Charts/feedback: Recharts, react-hot-toast
- Backend (dev): Express + cors + dotenv (Nodemon + tsx)

Getting started
1) Prerequisites: Node.js >= 18
2) Install deps: npm install
3) Dev (client + server together): npm run dev
   - Client runs Vite and proxies /api to http://localhost:3001
4) Run only client: npm run client:dev
5) Run only server: npm run server:dev
6) Type-check: npm run check
7) Lint: npm run lint
8) Build: npm run build, then preview: npm run preview

Environment variables
- Create .env in project root (optional)
- PORT=3001 (default if unset)
- Add any secrets (RPC keys, API keys) here. Never commit secrets.

API overview
- Local dev server entry: api/server.ts (Express), loads app from api/app.ts
- Endpoints:
  - GET /api/health → { success: true, message: 'ok' }
  - /api/auth/register, /api/auth/login, /api/auth/logout (placeholders)
- Error handler returns JSON, 404 returns { success: false, error: 'API not found' }

Vite proxy & routing
- vite.config.ts proxies /api → http://localhost:3001 in dev
- React Router paths:
  - /, /dashboard, /deposit, /withdraw, /history, /vault, /connect

Deployment (Vercel)
- vercel.json rewrites:
  - /api/* → /api/index (serverless handler)
  - /* → /index.html (SPA)
- api/index.ts exports Vercel handler that calls the Express app

Blockchain configuration
- src/constants/chains.ts lists supported chains: Ethereum, Polygon, BNB Chain, ZetaChain
- SUPPORTED_TOKENS per chain, ZETA_CONTRACTS placeholders, TRANSACTION_SETTINGS
- src/utils/web3.ts wraps ethers for providers, balances, explorers

Project structure (key folders)
- src/ components, pages, stores, utils, constants, types
- api/ Express app, routes, local server entry
- public/ assets (favicon.svg)

Notes
- Tailwind configured via postcss.config.js and tailwind.config.js
- ESLint configured in eslint.config.js
- Uses vite-tsconfig-paths and react-dev-locator for DX
