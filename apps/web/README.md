# Rovio — Car & Bike Rentals

A full-stack car and bike rental marketplace built with Next.js 15.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Auth Backend:** lemu-auth (Express.js, separate service)
- **Database:** MongoDB 7
- **Cache/Queue:** Redis 7 (email worker queue)
- **Auth:** JWT (httpOnly cookies), Google OAuth
- **Containerization:** Docker Compose

## Architecture

```
rovio (Next.js :3000)
  └── /api/auth/* → proxies to lemu-auth
  └── serves SSR pages
  └── Edge middleware verifies JWT on protected routes

lemu-auth (Express :5000)
  ├── /api/v1/auth/* — register, login, verify-email, google, me
  ├── connects to MongoDB (users) + Redis (OTP cache)
  └── mail worker (Redis consumer) — sends emails asynchronously

mongodb (:27017)
redis (:6379)
```

## Quick Start (Docker)

```bash
# 1. Clone both repos side by side
# ../rovio-car-bike-rental
# ../lemu-auth

# 2. Copy environment files
cp .env.docker .env
# Edit .env with your secrets (JWT_SECRET, LEMU_API_KEY, etc.)

# 3. Build and start all services
docker compose up -d --build

# 4. Open http://localhost:3000
```

## Environment Variables

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret used to sign/verify auth tokens (base64, 32+ bytes) |
| `LEMU_API_KEY` | Shared secret between rovio and lemu-auth (64-char hex) |
| `LEMU_AUTH_URL` | URL of lemu-auth service (internal Docker hostname) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID for sign-in button |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app for CORS/CSRF |

### Key Files

- `.env.docker` — Environment for Docker Compose (tracked in git, uses placeholders for secrets)
- `.env` — Actual secrets, gitignored, used by Docker Compose for `$NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Google OAuth

1. Create a credential in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Add `http://localhost:3000` as an **Authorized JavaScript origin**
3. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env`

The flow uses Google Identity Services (`@react-oauth/google`):
- Frontend gets ID token from Google
- Sends it to `/api/auth/google` → proxied to lemu-auth
- Backend verifies the token and returns a JWT

## Auth Flow

### Email/Password
1. Register at `/register` → OTP stored in Redis, returned in response (dev hint)
2. Verify OTP at `/verify-email` → user activated
3. Login at `/login` → JWT set as httpOnly cookie

### Google
1. Click "Sign in with Google" → Google popup
2. ID token sent to backend → user created if new (auto-verified)
3. JWT set as httpOnly cookie → redirected to home

## Protected Routes

- `/profile` — requires auth; middleware redirects to `/login?redirect=...`

## Development (without Docker)

```bash
# Terminal 1 — lemu-auth
cd ../lemu-auth
npm install
# Start MongoDB & Redis locally or in Docker
npm run dev

# Terminal 2 — rovio
npm install
npm run dev
```

## Build

```bash
npm run build
# Output: .next/standalone/ (for Docker deployment)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
