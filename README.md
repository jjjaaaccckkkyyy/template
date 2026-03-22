# Fullstack Auth Starter Template

A production-ready full-stack authentication starter with a clean, minimal "Precision Black" design system.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + motion/react |
| API | tRPC + Express |
| Auth | Passport.js + express-session |
| Database | PostgreSQL (via `pg`) |
| Email | Resend / Console (dev) |
| Package Manager | pnpm (monorepo) |

## Features

- ✅ Email/password authentication
- ✅ GitHub OAuth
- ✅ Google OAuth
- ✅ Email verification
- ✅ Password reset
- ✅ Session management (view & revoke active sessions)
- ✅ Precision Black design system
- ✅ Responsive dashboard layout with sidebar
- ✅ Animated page transitions

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### Setup

```bash
# 1. Clone and install
git clone <your-repo>
cd fullstack-template
pnpm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Configure environment
cp server/.env.example server/.env
# Edit server/.env with your values

# 4. Initialize database
pnpm db:init

# 5. Start development servers
pnpm dev
```

Visit `http://localhost:5173`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/myapp` |
| `SESSION_SECRET` | Express session secret (32+ chars) | — |
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID | — |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret | — |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | — |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | — |
| `EMAIL_PROVIDER` | Email provider (`console` or `resend`) | `console` |
| `RESEND_API_KEY` | Resend API key (if using Resend) | — |
| `EMAIL_FROM` | From address for emails | — |

## OAuth Setup

### GitHub
1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Set callback URL to `http://localhost:3000/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

### Google
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 credentials
3. Add `http://localhost:3000/auth/google/callback` as authorized redirect URI
4. Copy Client ID and Client Secret to `.env`

## Adding New Pages

1. Create your page component in `client/src/pages/`
2. Add a route in `client/src/App.tsx`
3. Add a nav item in `client/src/components/layout/Sidebar.tsx`

## Adding tRPC Endpoints

```typescript
// server/src/router/index.ts
import { router } from '../trpc';
import { myRouter } from './my-router'; // your new router

export const appRouter = router({
  my: myRouter,
});

export type AppRouter = typeof appRouter;
```

## Design System Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#080808` | Page background |
| `--color-surface` | `#0e0e0e` | Card/panel background |
| `--color-border` | `rgba(255,255,255,0.07)` | Borders |
| `--color-text` | `#e0e0e0` | Primary text |
| `--color-text-muted` | `rgba(255,255,255,0.35)` | Secondary text |
| `--color-accent` | `#b5ff18` | Accent/highlight |

## Production Notes

- Set `NODE_ENV=production` and use a strong `SESSION_SECRET`
- Use `EMAIL_PROVIDER=resend` with a real `RESEND_API_KEY`
- Set `FRONTEND_URL` to your production domain
- Ensure your PostgreSQL instance is secured
- Consider adding rate limiting for auth endpoints
