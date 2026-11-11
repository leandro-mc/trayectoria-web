# TrayectorIA — Web

> Leer en español: [README.es.md](README.es.md)

Frontend of **TrayectorIA**, an AI-powered job networking platform. Candidates browse a job catalog, manage their profile, generate AI-tailored CVs and practice mock interviews; companies publish offers and review applications. Backend: [trayectoria-backend](https://github.com/leandro-mc/trayectoria-backend).

## Features

- **Public job catalog** with search, plus candidate and company registration
- **Candidate area:** dashboard, profile, applications and saved offers
- **AI tools:** CV generation and mock interviews
- **Company area:** dashboard, profile, create/edit offers and review applications
- Role-based route protection, light/dark theme

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 and shadcn/ui (Radix)
- TanStack Query for server state, Zustand for client state
- React Hook Form + Zod for forms and validation
- Axios with interceptors, Framer Motion

## Getting started

Requirements: Node.js 20+ and the [backend](https://github.com/leandro-mc/trayectoria-backend) running.

```bash
git clone https://github.com/leandro-mc/trayectoria-web.git
cd trayectoria-web
cp .env.example .env     # NEXT_PUBLIC_API_URL=http://localhost:8080/api
npm install
npm run dev              # http://localhost:3000
```

Other scripts: `npm run build`, `npm run lint`, `npm run type-check`.

## Structure

```
src/
├── app/         # Routes by role: (public), (candidate), (company), ai, jobs
├── features/    # Domain modules: auth, candidate, company, jobs, applications, ai...
│                #   each with api/, components/, hooks/, schemas/, types/
├── components/  # shadcn/ui and shared components
├── lib/         # Axios client, token storage, utilities
└── stores/      # Zustand (auth, ui)
```

Data flow: component → custom hook (TanStack Query) → API function → Axios client → backend.
