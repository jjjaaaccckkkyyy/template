# Fullstack Auth Template

A production-ready full-stack starter with complete authentication, a polished dark UI, and a clean monorepo structure. Clone, configure, and start building your app.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Express, tRPC, Passport.js |
| Database | PostgreSQL (via `pg`) |
| Auth | Email/password, GitHub OAuth, Google OAuth |
| Email | Resend (console fallback in dev) |
| Animations | motion/react, Anime.js |
| Package manager | pnpm workspaces |

## Features

- **Email / password auth** — register, login, email verification, password reset
- **OAuth** — GitHub and Google (plug in your client IDs)
- **Session management** — PostgreSQL-backed sessions, view and revoke active sessions
- **Protected routes** — client-side `ProtectedRoute` guard + server-side session middleware
- **JWT ID tokens** — issued on login, decoded client-side for user identity
- **Precision Black design system** — Space Mono, `#0a0a0a` background, `#b5ff18` lime accent, 2px border-radius
- **Terminal-style tooltips** — `$ message ▌` aesthetic, used for validation and UI hints
- **Smooth animations** — page transitions, staggered dashboard reveals, Anime.js login entrance
- **Responsive layout** — collapsible sidebar, mobile drawer, Header with user menu

---

## Project Structure

```
/
├── client/               # React + Vite frontend
│   └── src/
│       ├── App.tsx               # Routes + MotionConfig
│       ├── pages/
│       │   ├── auth/             # Login, Register, Verify, ForgotPassword, ResetPassword, OAuthCallback
│       │   └── settings/         # SessionsPage
│       ├── components/
│       │   ├── layout/           # Sidebar, Header, DashboardLayout, ProtectedRoute, VerificationBanner
│       │   ├── auth/             # PasswordStrengthIndicator
│       │   └── ui/               # Button, Card, Tooltip, StatusBadge, IconWrapper
│       └── lib/
│           ├── api.ts            # tRPC client
│           └── hooks/            # useAuth, useSidebar, useMediaQuery
│
├── server/               # Express + tRPC backend
│   └── src/
│       ├── index.ts              # Express server entry
│       ├── trpc.ts               # tRPC setup
│       ├── router/
│       │   ├── index.ts          # App router (add your routers here)
│       │   └── auth.ts           # All auth endpoints
│       ├── auth/                 # Passport strategies, middleware, OAuth, utils
│       ├── db/
│       │   ├── index.ts          # pg Pool
│       │   ├── schema.sql        # Database schema
│       │   ├── migrate.ts        # Migration runner
│       │   └── repositories/    # users, tokens, sessions, oauth
│       └── email/                # Resend + console providers, templates
│
├── docker-compose.yml    # PostgreSQL service
├── package.json          # Root workspace scripts
└── pnpm-workspace.yaml
```

---

## Quick Start

### 1. Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### 2. Clone and install

```bash
git clone <your-repo> my-app
cd my-app
pnpm install
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Configure environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` — at minimum set:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/template
SESSION_SECRET=<random 32+ character string>
```

### 5. Run migrations

```bash
pnpm db:init
```

### 6. Start development servers

```bash
pnpm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health check: http://localhost:3000/health

---

## Environment Variables

All variables live in `server/.env`. Copy from `server/.env.example`.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | Random secret for session signing (32+ chars) |
| `PORT` | — | Server port (default: 3000) |
| `NODE_ENV` | — | `development` or `production` |
| `BASE_URL` | — | Server base URL (used in production CORS) |
| `FRONTEND_URL` | — | Frontend URL (used in email links) |
| `GITHUB_CLIENT_ID` | — | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | — | GitHub OAuth app client secret |
| `GOOGLE_CLIENT_ID` | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | — | Google OAuth client secret |
| `RESEND_API_KEY` | — | Resend API key (optional, console fallback in dev) |
| `EMAIL_FROM` | — | Sender address for transactional emails |
| `EMAIL_PROVIDER` | — | `console` (dev) or `resend` (production) |

---

## Adding OAuth Providers

### GitHub
1. Go to https://github.com/settings/developers → New OAuth App
2. Set **Homepage URL**: `http://localhost:5173`
3. Set **Callback URL**: `http://localhost:3000/auth/callback/github`
4. Copy Client ID and Secret to `server/.env`

### Google
1. Go to https://console.cloud.google.com/ → APIs & Services → Credentials
2. Create OAuth 2.0 Client → Web application
3. Add **Authorized redirect URI**: `http://localhost:3000/auth/callback/google`
4. Copy Client ID and Secret to `server/.env`

---

## Adding New Pages

1. Create your page in `client/src/pages/`
2. Add the route in `client/src/App.tsx`
3. Add a nav item in `client/src/components/layout/Sidebar.tsx`

```tsx
// App.tsx — add inside <Routes>
<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <PageTransition><MyPage /></PageTransition>
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
```

```ts
// Sidebar.tsx — add to navItems
{ icon: MyIcon, label: "My Page", href: "/my-page" },
```

## Adding New API Endpoints

1. Create a new tRPC router in `server/src/router/`
2. Register it in `server/src/router/index.ts`

```ts
// server/src/router/my-router.ts
import { router, protectedProcedure } from '../trpc';

export const myRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // ctx.req.user is the authenticated user
    return [];
  }),
});

// server/src/router/index.ts
import { myRouter } from './my-router';

export const appRouter = router({
  auth: authRouter,
  my: myRouter,   // <-- add here
});
```

---

## Design System

The template uses **Precision Black** — a minimal dark theme.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Page background |
| Card | `#0e0e0e` | Cards, inputs |
| Text | `#e0e0e0` | Primary text |
| Muted | `rgba(255,255,255,0.35)` | Labels, subtitles |
| Accent | `#b5ff18` | Lime — focus rings, active states |
| Border | `rgba(255,255,255,0.07)` | Card borders |
| Font | Space Mono | All text |
| Border radius | `2px` | All components |

CSS utility classes available in `index.css`: `.card-cyber`, `.btn-cyber`, `.btn-cyber-outline`, `.input-cyber`, `.label-xs`, `.auth-card`, `.auth-button`.

---

## Production

```bash
pnpm build
pnpm start
```

Set `NODE_ENV=production` and `EMAIL_PROVIDER=resend` in your environment.
