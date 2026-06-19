# TrayectorIA - Frontend

AI-powered professional networking platform. Connects candidates with companies: AI-generated CV, mock interviews, job catalog with advanced search.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios with interceptors |
| Animations | Framer Motion |
| Icons | Lucide React |
| Dates | date-fns |

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/leandro-mc/trayectoria-web.git
cd trayectoria-web

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
# Edit .env with your backend URL

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you will see the design system preview.

---

## Environment variables

```bash
# .env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## Project structure

```
src/
├── app/                   # Next.js App Router (routes, layouts, pages)
├── features/              # Business domain modules
│   ├── auth/              # JWT authentication
│   ├── candidate/         # Candidate profile
│   ├── company/           # Company profile
│   ├── jobs/              # Job catalog
│   ├── applications/      # Applications
│   ├── saved-offers/      # Saved offers
│   ├── skills/            # Skills catalog
│   └── ai/
│       ├── curricula/     # AI CV generation
│       └── interviews/    # AI mock interviews
├── components/
│   ├── ui/                # shadcn/ui (do not modify)
│   └── shared/            # Reusable components
├── lib/
│   ├── api/               # Axios client + interceptors
│   ├── auth/              # Token storage + helpers
│   └── utils/             # cn, date, format
├── stores/                # Zustand (auth, ui)
├── types/                 # Global types and API contracts
└── config/                # Constants, routes, query keys
```

Each feature follows the same internal structure:
```
features/[feature]/
├── api/         # HTTP functions (never inside components)
├── components/  # Feature components
├── hooks/       # Custom hooks with TanStack Query
├── schemas/     # Zod validation
└── types/       # TypeScript types
```

---

## Data flow

```
Component -> Custom Hook -> API function -> Axios client -> Backend
```

Components never call the API directly. Always through a custom hook.

---

## Scripts

```bash
npm run dev         # Development server (Turbopack, default in Next.js 16)
npm run build       # Production build
npm run start       # Production server
npm run lint        # ESLint
npm run type-check  # TypeScript without emitting
```

---

## Authentication

The system uses **JWT with automatic refresh token**:

- The `accessToken` lives in `sessionStorage` (cleared when the tab is closed)
- The `refreshToken` persists in `localStorage`
- The Zustand store (`auth.store.ts`) is the runtime source of truth
- The Axios interceptor automatically refreshes the token on 401, queuing in-flight requests

Route protection is handled in `src/proxy.ts` (equivalent to Next.js ≤15 middleware):
- `/dashboard`, `/profile`, `/ai/...` -> `CANDIDATE` only
- `/company/...` -> `COMPANY` only
- `/login`, `/register` -> redirects if already authenticated

---

## Backend

The frontend consumes a REST API at `http://localhost:8080/api/v1`.  

---

## Author

**Leandro Mora Corrales**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.