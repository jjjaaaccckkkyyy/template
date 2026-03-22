# AGENT.md — Fullstack Auth Template

A comprehensive reference for AI agents and developers working in this codebase.

---

## Overview

A production-ready full-stack monorepo starter with complete authentication (email/password + OAuth), a polished dark UI (**Precision Black** design system), and tRPC type-safe APIs.

**Dev URLs**
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Health check | http://localhost:3000/health |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Express, tRPC, Passport.js |
| Database | PostgreSQL (via `pg`) |
| Auth | Email/password, GitHub OAuth, Google OAuth |
| Sessions | `express-session` + `connect-pg-simple` (PostgreSQL-backed) |
| JWT | `jsonwebtoken` — ID tokens issued on login |
| Email | Resend (console fallback in dev) |
| Animations | `motion/react`, `animejs` |
| Package manager | pnpm workspaces |

---

## Project Structure

```
/
├── client/                      # React + Vite frontend
│   └── src/
│       ├── App.tsx              # Routes + AnimatePresence + MotionConfig
│       ├── main.tsx             # Entry — wraps app in AuthProvider
│       ├── index.css            # Global styles + CSS utility classes
│       ├── pages/
│       │   ├── auth/            # Login, Register, Verify, ForgotPassword,
│       │   │                    # ResetPassword, OAuthCallback
│       │   └── settings/        # SessionsPage (manage active sessions)
│       ├── components/
│       │   ├── layout/          # Sidebar, Header, DashboardLayout,
│       │   │                    # ProtectedRoute, VerificationBanner
│       │   ├── auth/            # PasswordStrengthIndicator
│       │   └── ui/              # Button, Card, Tooltip, StatusBadge, IconWrapper
│       └── lib/
│           ├── api.ts           # Fetch wrapper + tRPC client (manual HTTP)
│           ├── design-system.ts # Color tokens, cn() helper, style constants
│           └── hooks/
│               ├── useAuth.tsx  # AuthContext + AuthProvider + auth helpers
│               ├── useSidebar.ts
│               └── useMediaQuery.ts
│
├── server/                      # Express + tRPC backend
│   └── src/
│       ├── index.ts             # Express app entry point
│       ├── trpc.ts              # tRPC init, Context type, publicProcedure,
│       │                        # protectedProcedure (JWT auth middleware)
│       ├── logger.ts            # Logging utility
│       ├── router/
│       │   ├── index.ts         # Root tRPC router — register new routers here
│       │   └── auth.ts          # All REST auth endpoints (Express Router)
│       ├── auth/
│       │   ├── index.ts         # Re-exports: passport + getSessionConfig
│       │   ├── passport.ts      # Passport init + session serialisation
│       │   ├── middleware.ts    # requireAuth Express middleware
│       │   ├── sessions.ts      # Session management helpers
│       │   ├── strategies/
│       │   │   ├── local.ts     # Email/password Passport strategy
│       │   │   ├── github.ts    # GitHub OAuth strategy
│       │   │   └── google.ts    # Google OAuth strategy
│       │   ├── oauth/
│       │   │   ├── github.ts    # GitHub OAuth route handlers
│       │   │   └── google.ts    # Google OAuth route handlers
│       │   └── utils/
│       │       ├── id-token.ts  # JWT sign/verify
│       │       ├── password.ts  # bcrypt hash/compare
│       │       ├── tokens.ts    # Email verification + reset token generation
│       │       └── pkce.ts      # PKCE helpers for OAuth
│       ├── db/
│       │   ├── index.ts         # pg Pool export
│       │   ├── schema.sql       # Full database schema
│       │   ├── migrate.ts       # Migration runner (pnpm db:init)
│       │   └── repositories/
│       │       ├── users.ts     # User CRUD
│       │       ├── tokens.ts    # Email/reset token CRUD
│       │       ├── sessions.ts  # Session queries
│       │       └── oauth.ts     # OAuth account CRUD
│       └── email/
│           ├── index.ts         # initEmailService() — picks console or resend
│           ├── console.ts       # Dev: logs emails to stdout
│           ├── resend.ts        # Production: sends via Resend API
│           └── templates.ts     # Email HTML templates
│
├── docker-compose.yml           # PostgreSQL service
├── package.json                 # Root workspace scripts
└── pnpm-workspace.yaml          # Workspace: server, client
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Configure environment
cp server/.env.example server/.env
# Edit server/.env — set DATABASE_URL and SESSION_SECRET at minimum

# 4. Run migrations
pnpm db:init

# 5. Start dev servers (client + server in parallel)
pnpm dev
```

---

## Commands

Run from the **repo root** via pnpm workspaces.

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start client + server in parallel (watch mode) |
| `pnpm build` | Build both client and server |
| `pnpm start` | Start production server only |
| `pnpm test` | Run all tests (vitest) |
| `pnpm lint` | Lint both packages |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Prettier format |
| `pnpm typecheck` | TypeScript type-check (no emit) |
| `pnpm db:init` | Run DB migrations (`server/src/db/migrate.ts`) |

Filter by package: `pnpm --filter server <cmd>` or `pnpm --filter client <cmd>`

---

## Environment Variables

All variables live in `server/.env`. Copy from `server/.env.example`.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | — | Random secret for session signing (32+ chars) |
| `PORT` | — | `3000` | Server port |
| `NODE_ENV` | — | `development` | `development` or `production` |
| `BASE_URL` | — | `http://localhost:3000` | Server base URL (CORS in production) |
| `FRONTEND_URL` | — | `http://localhost:5173` | Frontend URL (used in email links) |
| `GITHUB_CLIENT_ID` | — | — | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | — | — | GitHub OAuth app client secret |
| `GOOGLE_CLIENT_ID` | — | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | — | — | Google OAuth client secret |
| `RESEND_API_KEY` | — | — | Resend API key |
| `EMAIL_FROM` | — | `noreply@yourdomain.com` | Sender address for transactional emails |
| `EMAIL_PROVIDER` | — | `console` | `console` (dev) or `resend` (production) |

---

## Database Schema

Tables defined in `server/src/db/schema.sql`:

| Table | Purpose |
|-------|---------|
| `users` | Core user accounts (`id`, `email`, `password_hash`, `name`, `avatar_url`, `email_verified`) |
| `oauth_accounts` | Links OAuth providers to users (`provider`, `provider_user_id`) |
| `session` | PostgreSQL-backed express sessions (`connect-pg-simple`) |
| `email_verification_tokens` | Short-lived tokens for email verification |
| `password_reset_tokens` | Short-lived tokens for password reset |

---

## Authentication Architecture

### Session + JWT dual-auth

- **Sessions** (`express-session` + PostgreSQL): Used for web-based auth flows and OAuth. All `/auth/*` REST endpoints rely on sessions.
- **JWT ID tokens**: Issued on successful login/OAuth, stored in `localStorage` as `id_token`. Sent as `Authorization: Bearer <token>` for tRPC procedures.

### Auth REST endpoints (`/auth/`)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Create account + send verification email |
| `POST` | `/auth/login` | Email/password login → returns `{ idToken }` |
| `POST` | `/auth/logout` | Destroy session + clear cookie |
| `GET` | `/auth/me` | Get current user from session |
| `POST` | `/auth/verify-email` | Consume email verification token |
| `POST` | `/auth/forgot-password` | Send password reset email |
| `POST` | `/auth/reset-password` | Consume reset token + set new password |
| `GET` | `/auth/login/github` | Initiate GitHub OAuth flow |
| `GET` | `/auth/callback/github` | GitHub OAuth callback |
| `GET` | `/auth/login/google` | Initiate Google OAuth flow |
| `GET` | `/auth/callback/google` | Google OAuth callback |
| `GET` | `/auth/sessions` | List active sessions for current user |
| `DELETE` | `/auth/sessions/:sid` | Revoke a specific session |

### tRPC protected procedures

`protectedProcedure` (in `server/src/trpc.ts`) validates the `Authorization: Bearer <token>` header and injects `ctx.userId` (string UUID).

```ts
export const myRouter = router({
  getData: protectedProcedure.query(async ({ ctx }) => {
    // ctx.userId is the authenticated user's UUID
    return [];
  }),
});
```

---

## Adding New Pages (Frontend)

1. Create page in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Add nav item in `client/src/components/layout/Sidebar.tsx`

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
// Sidebar.tsx — add to navItems array
{ icon: MyIcon, label: "My Page", href: "/my-page" },
```

---

## Adding New API Endpoints (Backend)

1. Create a tRPC router in `server/src/router/`
2. Register it in `server/src/router/index.ts`

```ts
// server/src/router/my-router.ts
import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const myRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return [];
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return { id: '1', name: input.name };
    }),
});

// server/src/router/index.ts
import { myRouter } from './my-router';

export const appRouter = router({
  my: myRouter,  // <-- register here
});
```

---

## API Client (Frontend)

`client/src/lib/api.ts` provides two clients. Both automatically attach `Authorization: Bearer <token>` and handle 401 → redirect to `/login`.

### `api` — REST fetch wrapper

```ts
import { api } from '@/lib/api';

const data = await api.get<MyType>('/auth/me');
await api.post('/some-endpoint', { key: 'value' });
await api.put('/resource/1', { key: 'value' });
await api.delete('/resource/1');
```

### `trpc` — tRPC HTTP client

```ts
import { trpc } from '@/lib/api';

const result = await trpc.query<MyType>('my.list');
const created = await trpc.mutation<MyType>('my.create', { name: 'foo' });
```

---

## `useAuth` Hook

```ts
import { useAuth } from '@/lib/hooks';

const { user, isLoading, isAuthenticated, setIdToken, logout, refreshUser } = useAuth();
```

| Property | Type | Description |
|----------|------|-------------|
| `user` | `AuthUser \| null` | Current user (`id`, `email`, `name`, `avatarUrl`, `emailVerified`) |
| `isLoading` | `boolean` | True while fetching user from `/auth/me` |
| `isAuthenticated` | `boolean` | `true` when user is non-null |
| `setIdToken(token)` | `fn` | Store JWT in `localStorage` + re-fetch user |
| `logout()` | `async fn` | POST `/auth/logout`, clear token + user state |
| `refreshUser()` | `async fn` | Re-fetch current user from `/auth/me` |

`AuthProvider` must wrap the app (already done in `main.tsx`).

---

## Design System — Precision Black

The entire UI is built on **Precision Black**: a minimal dark terminal aesthetic using Space Mono, a near-black background, and a single lime accent (`#b5ff18`). All tokens, helpers, and style constants live in `client/src/lib/design-system.ts`.

---

### Color Tokens

```ts
// client/src/lib/design-system.ts
export const colors = {
  primary: {
    DEFAULT: "#b5ff18",      // lime accent — CTA, focus rings, active states
    10:  "rgba(181,255,24,0.1)",
    15:  "rgba(181,255,24,0.15)",
    20:  "rgba(181,255,24,0.2)",
    30:  "rgba(181,255,24,0.3)",
    40:  "rgba(181,255,24,0.4)",
    50:  "rgba(181,255,24,0.5)",
    70:  "#c8ff50",           // lighter lime for hover/gradient end
  },
  success: {
    DEFAULT: "rgb(74,222,128)",
    75:      "rgba(74,222,128,0.75)",
  },
  warning: {
    DEFAULT: "rgb(251,191,36)",
    75:      "rgba(251,191,36,0.75)",
  },
  danger: {
    DEFAULT: "rgb(239,68,68)",
    75:      "rgba(239,68,68,0.75)",
  },
  background: {
    DEFAULT: "#0a0a0a",      // page background
    card:    "#0e0e0e",      // cards, inputs
    elevated:"#0d0d0d",      // elevated surfaces (modals, dropdowns)
  },
  border: {
    DEFAULT: "rgba(255,255,255,0.07)",   // default border
    hover:   "rgba(255,255,255,0.14)",   // hovered border
  },
};
```

> **Rule of thumb:** Never hardcode hex values in component JSX — reference `colors` from `design-system.ts` or use the Tailwind inline values listed below.

---

### Typography

| Property | Value |
|----------|-------|
| Font family | `Space Mono` (loaded via `@fontsource/space-mono`) |
| Class | `font-mono` on every text element |
| Base text | `text-[#e0e0e0]` |
| Muted / labels | `text-[rgba(255,255,255,0.35)]` |
| Subtle / placeholder | `text-[rgba(255,255,255,0.5)]` |
| Accent text | `text-[#b5ff18]` |
| Label pattern | `text-[10px] uppercase tracking-[0.28em]` |
| Mono heading | `text-2xl font-bold tracking-tight` |

---

### Spacing & Shape

| Property | Value | Tailwind |
|----------|-------|---------|
| Border radius | `2px` | `rounded-sm` |
| Card padding | `p-6` (24px) | `p-6` |
| Section gap | `space-y-8` | `space-y-8` |
| Grid gap | `gap-6` | `gap-6` |
| Transition | `duration-200` on all interactive elements | `transition-all duration-200` |

---

### Style Constants (`styles` object)

Pre-composed Tailwind strings for common patterns:

```ts
export const styles = {
  card: {
    base:  "relative overflow-hidden rounded-sm border transition-all duration-200",
    cyber: "border-[rgba(255,255,255,0.07)] bg-[#0e0e0e] hover:border-[rgba(255,255,255,0.12)]",
  },
  button: {
    base:  "flex items-center justify-center rounded-sm border transition-all duration-200",
    cyber: "border-[rgba(181,255,24,0.3)] bg-[rgba(181,255,24,0.06)] hover:border-[rgba(181,255,24,0.5)] hover:bg-[rgba(181,255,24,0.12)]",
  },
  text: {
    gradient: "text-[#b5ff18]",
    mono:     "font-mono text-xs uppercase tracking-wider",
  },
};
```

Usage:
```tsx
import { styles, cn } from '@/lib/design-system';

<div className={cn(styles.card.base, styles.card.cyber, 'p-6')}>...</div>
<button className={cn(styles.button.base, styles.button.cyber)}>Click</button>
```

---

### `cn()` Helper

Merges class names, filtering out falsy values (no external dependency):

```ts
export const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ');

// Usage
cn('base', isActive && 'active', undefined)   // → "base active"
cn(styles.card.base, styles.card.cyber)       // → "relative overflow-hidden ..."
```

---

### CSS Utility Classes

Defined in `client/src/index.css` and available globally via Tailwind:

| Class | Description |
|-------|-------------|
| `.card-cyber` | Dark card: `bg-[#0e0e0e]`, `border-[rgba(255,255,255,0.07)]`, `rounded-sm` |
| `.btn-cyber` | Filled lime button: lime bg tint + lime border, hover brightens |
| `.btn-cyber-outline` | Outline-only lime button |
| `.input-cyber` | Dark input: `bg-[#0e0e0e]`, mono font, lime focus ring |
| `.label-xs` | `font-mono text-[10px] uppercase tracking-[0.28em] text-[rgba(255,255,255,0.35)]` |
| `.auth-card` | Centered, constrained-width auth form card |
| `.auth-button` | Full-width auth submit button (lime accent) |

Additional stylesheet modules:
| File | Purpose |
|------|---------|
| `src/styles/auth.css` | Auth page layout (full-screen centered, animated entrance) |
| `src/styles/dashboard.css` | Dashboard grid and content area styles |
| `src/styles/layout.css` | Sidebar, header, and drawer layout styles |

---

### Interactive State Patterns

These patterns are used consistently across all interactive elements:

```
Default:   border-[rgba(255,255,255,0.07)]  text-[rgba(255,255,255,0.45)]
Hover:     border-[rgba(255,255,255,0.14)]  text-[#e0e0e0]  bg-[rgba(255,255,255,0.04)]
Active:    border-[rgba(181,255,24,0.2)]    text-[#b5ff18]  bg-[rgba(181,255,24,0.08)]
Focus:     ring-2 ring-[#b5ff18] ring-offset-2 ring-offset-[#0a0a0a]
Disabled:  opacity-40 cursor-not-allowed
```

Focus rings always use `focus-visible:` (not `focus:`) to avoid mouse-click outlines.

---

### Status / Semantic Colors

Used in `StatusBadge`, session lists, and toast notifications:

| State | Color | Tailwind inline |
|-------|-------|----------------|
| Success / online | `rgb(74,222,128)` | `text-[rgb(74,222,128)]` |
| Warning | `rgb(251,191,36)` | `text-[rgb(251,191,36)]` |
| Danger / error | `rgb(239,68,68)` | `text-[rgb(239,68,68)]` |
| Info / accent | `#b5ff18` | `text-[#b5ff18]` |

---

### Animations

Animations use **`motion/react`** (`AnimatePresence` + `motion`) for page transitions and reveal effects, and **Anime.js** for the login page entrance sequence.

**Page transition variants** (defined in `App.tsx`, applied via `<PageTransition>`):
```ts
const pageVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
};
```

`<AnimatePresence mode="wait">` wraps all routes to ensure exit animations complete before the next page mounts.

**Loading spinner** (used in `ProtectedRoute` while auth resolves):
```tsx
<div className="h-6 w-6 animate-spin rounded-full border-2
  border-[rgba(181,255,24,0.2)] border-t-[#b5ff18]" />
```

Respect `prefers-reduced-motion` via `<MotionConfig reducedMotion="user">` at the app root.

---

### Sidebar Active State

Nav items follow this exact active/inactive pattern (reference for any new nav links):

```tsx
// Active
"bg-[rgba(181,255,24,0.08)] text-[#b5ff18] border border-[rgba(181,255,24,0.2)]"

// Inactive
"text-[rgba(255,255,255,0.45)] hover:text-[#e0e0e0] hover:bg-[rgba(255,255,255,0.04)] border border-transparent"
```

---

## Email System

Email provider selected at startup via `EMAIL_PROVIDER`:

- **`console`** (default in dev): Prints email content to stdout — no config needed.
- **`resend`** (production): Sends via [Resend](https://resend.com) using `RESEND_API_KEY`.

Edit `server/src/email/templates.ts` to customise verification and password-reset email HTML.

---

## OAuth Setup

### GitHub
1. Go to https://github.com/settings/developers → New OAuth App
2. Homepage URL: `http://localhost:5173`
3. Callback URL: `http://localhost:3000/auth/callback/github`
4. Set `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` in `server/.env`

### Google
1. Go to https://console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client → Web application
3. Authorized redirect URI: `http://localhost:3000/auth/callback/google`
4. Set `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` in `server/.env`

---

## Production Build

```bash
pnpm build
NODE_ENV=production EMAIL_PROVIDER=resend pnpm start
```

In production:
- CORS is restricted to `BASE_URL` only.
- Set `EMAIL_PROVIDER=resend` and supply `RESEND_API_KEY`.
- Serve the built client (`client/dist`) via a CDN or static host.

---

## Testing

Both packages use [Vitest](https://vitest.dev/).

```bash
pnpm test                     # Run all tests
pnpm --filter server test     # Server tests only
pnpm --filter client test     # Client tests only
```

- **Server**: Uses `supertest` for HTTP integration tests.
- **Client**: Uses `@testing-library/react` + `jsdom`.
