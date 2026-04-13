# LunaJoy — Mental Health Progress Tracker

A web application that allows patients to log their daily mental health status and view trends over time. Built with sensitivity to the needs of mental health patients.

## Tech Stack

### Backend (`luna_backend/`)
| Role | Technology |
|---|---|
| Framework | Express.js (v5) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) via Prisma ORM |
| Authentication | Google OAuth 2.0 + JWT |
| Real-time | Socket.io |
| Validation | Zod |
| Logger | Pino (structured, no console.log) |

### Frontend (`luna_frontend/`)
| Role | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Data Fetching | TanStack Query (zero useEffect) |
| Forms | react-hook-form + Zod resolver |
| Real-time | Socket.io client + useSyncExternalStore |
| Auth | @react-oauth/google |
| UI Components | Headless UI |

### Testing
- **Vitest** as test runner for both projects
- **Testing Library** + jsdom for React component tests
- **Supertest** for backend API integration tests

## Features

- **Google Login** — Secure OAuth 2.0 authentication
- **Daily Log Form** — Multi-step wizard (8 steps) capturing mood, anxiety, sleep, activity, social interactions, stress, and symptoms
- **Data Visualization** — Interactive line charts with 3 selectable parameters and weekly/monthly toggle
- **Real-time Updates** — WebSocket-powered chart updates when new entries are added
- **Calming UI** — Soft color palette, supportive language, smooth transitions, and accessible components

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A **Google Cloud** project with OAuth 2.0 credentials ([setup guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid))
- A **Supabase** project (free tier) for PostgreSQL database ([supabase.com](https://supabase.com))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/CAASG/lunaJoy_full_stack_assessment.git
cd lunaJoy_full_stack_assessment
```

### 2. Backend setup

```bash
cd luna_backend
npm install
cp .env.example .env
```

Edit `.env` with your values:
```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=a_strong_random_string_min_16_chars
```

Run the database migration and start the server:
```bash
npx prisma migrate dev
npm run dev
```

The backend runs on `http://localhost:3001`.

### 3. Frontend setup

```bash
cd luna_frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the dev server:
```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Available Scripts

### Backend (`luna_backend/`)
| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client |

### Frontend (`luna_frontend/`)
| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |

## Project Structure

```
LunaJoy/
├── README.md
├── .gitignore
├── luna_backend/
│   ├── prisma/schema.prisma          # Database schema
│   ├── src/
│   │   ├── index.ts                  # Express + Socket.io server
│   │   ├── config/env.ts             # Environment validation (Zod)
│   │   ├── lib/                      # Prisma client, logger, error classes
│   │   ├── middleware/               # Auth, validation, error handler
│   │   ├── routes/                   # Auth and log route definitions
│   │   ├── controllers/              # Request handlers
│   │   ├── services/                 # Business logic (Result pattern)
│   │   ├── schemas/                  # Zod validation schemas
│   │   ├── socket/                   # Socket.io setup + auth
│   │   └── __tests__/               # Vitest tests
│   └── package.json
│
└── luna_frontend/
    ├── src/
    │   ├── App.tsx                    # Providers + routing
    │   ├── api/client.ts             # Axios with JWT interceptor
    │   ├── context/                   # Auth + Socket providers
    │   ├── hooks/                     # useAuth, useLogs, useSocket
    │   ├── pages/                     # Login, Dashboard, DailyLog
    │   ├── components/
    │   │   ├── layout/               # Navbar, ProtectedRoute, ErrorBoundary
    │   │   ├── log-form/             # 8 wizard steps + progress bar
    │   │   ├── charts/               # TrendChart, ParameterSelector, PeriodToggle
    │   │   └── ui/                   # Button, Slider, EmojiRating, Modal, Tooltip
    │   ├── utils/                     # Constants, formatters
    │   ├── types/                     # TypeScript interfaces
    │   └── __tests__/                # Vitest + Testing Library tests
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/google` | Verify Google token, return JWT |
| `GET` | `/api/auth/me` | Get current user profile |
| `POST` | `/api/log` | Create daily log entry |
| `GET` | `/api/logs?period=week&date=YYYY-MM-DD` | Get logs with summary averages |
| `GET` | `/api/health` | Health check |

## Code Quality Rules

1. **Zero `useEffect`** — TanStack Query for data fetching, `useSyncExternalStore` for WebSocket subscriptions, `useMemo` for derived state
2. **Defensive Programming** — Zod validation at all boundaries, Result pattern in services, ErrorBoundary in frontend
3. **JSDoc Comments** — Module headers and function docstrings throughout
4. **Zero `console.log`** — ESLint `no-console: error` enforced; Pino logger on backend
5. **Structured Errors** — Typed error codes (`AUTH_TOKEN_EXPIRED`, `VALIDATION_ERROR`, etc.) with actionable messages

## License

ISC
