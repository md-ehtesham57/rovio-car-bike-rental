# Rovio — Car & Bike Rental Marketplace

A full-stack car and bike rental marketplace as a monorepo with a Next.js frontend and Express API backend, powered by MongoDB and Redis.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | Express 5, TypeScript |
| Database | MongoDB 7 (Mongoose ODM) |
| Cache/Queue | Redis 7 (JWT blacklist, OTP, BullMQ email queue) |
| Auth | JWT (httpOnly cookies), Google OAuth, bcrypt |
| Validation | Zod |
| Rate Limiting | express-rate-limit |
| Containerization | Docker Compose |

## Architecture & Request Flow

```
Browser ──► Next.js (:3000)
               ├── Static pages (public routes)
               ├── Edge Middleware (JWT verify, route guards)
               │
               └── API Routes (Next.js proxy layer /api/*)
                     │
                     │  Cookie + API key forwarded internally
                     ▼
               Express API (:5000)
                     ├── apiKeyGuard (service-to-service)
                     ├── globalLimiter
                     │
                     ├── /api/v1/auth    — Auth routes
                     ├── /api/v1/seller  — Seller routes
                     └── /api/v1/admin   — Admin routes
                           │
                           ▼
                     MongoDB + Redis
```

**Key design decisions:**
- Next.js API routes act as a **proxy layer** — the browser never talks to Express directly except during login (where `auth-context.tsx` calls Express directly via `lib/auth.ts`).
- The **apiKeyGuard** middleware at `/api/v1` (Express) is a service-to-service guard. It only blocks if `API_KEY` is configured; by default it's a no-op mark. The Next.js server sends the API key header internally.
- **Edge middleware** in Next.js (`middleware.ts`) verifies JWT and checks roles before pages load, providing instant redirect instead of waiting for a server round-trip.
- Admin login goes through a **Next.js proxy** (`/api/auth/admin-login`) that sets the httpOnly cookie server-side, preventing client-side JS from accessing the token.

## Directory Structure

```
rovio/
├── apps/
│   ├── web/                          # Next.js 15 frontend (port 3000)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── admin/            # Admin pages
│   │   │   │   │   ├── login/        # Admin login page (bare, no sidebar)
│   │   │   │   │   ├── dashboard/    # Stats, recent bookings, quick actions
│   │   │   │   │   ├── vehicles/     # Manage all vehicles (approve/reject/delete)
│   │   │   │   │   ├── bookings/     # Manage all bookings (status progression)
│   │   │   │   │   ├── users/        # Manage users (make admin/delete)
│   │   │   │   │   ├── profile/      # Admin profile with avatar
│   │   │   │   │   └── layout.tsx    # Sidebar layout
│   │   │   │   ├── api/
│   │   │   │   │   ├── auth/         # Auth proxy routes (login, register, etc.)
│   │   │   │   │   └── admin/        # Admin proxy routes
│   │   │   │   │       ├── dashboard/
│   │   │   │   │       ├── vehicles/
│   │   │   │   │       │   └── [id]/
│   │   │   │   │       │       └── status/
│   │   │   │   │       ├── bookings/
│   │   │   │   │       │   └── [id]/
│   │   │   │   │       │       └── status/
│   │   │   │   │       └── users/
│   │   │   │   │           └── [id]/
│   │   │   │   │               └── role/
│   │   │   │   └── ...
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts          # Server-side helpers: apiFetch, JWT verify
│   │   │   │   ├── auth-context.tsx  # React context: user, login, logout, adminLogin
│   │   │   │   ├── csrf.ts          # CSRF guard
│   │   │   │   └── ...
│   │   │   └── middleware.ts         # Edge: JWT verify, route guards
│   │   ├── .env.local
│   │   ├── .env.docker
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── api/                          # Express 5 backend (port 5000)
│       ├── src/
│       │   ├── server.ts             # Entry point, graceful shutdown
│       │   ├── app.ts                # Express app setup, route mounting
│       │   ├── config/
│       │   │   └── index.ts          # Env vars, backward-compat aliases
│       │   ├── db/
│       │   │   ├── mongoose.ts       # MongoDB connection (3 retries, non-fatal)
│       │   │   └── redis.ts          # Redis client + TokenBlacklistService
│       │   ├── types/
│       │   │   └── index.ts          # AuthRequest, JwtPayload, ApiResponse, helpers
│       │   ├── lib/
│       │   │   └── schemas.ts        # Zod schemas (auth, vehicle, booking, admin)
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts    # authenticate, requireRole, requireAdmin, apiKeyGuard
│       │   │   ├── error.middleware.ts   # AppError, errorHandler, notFound
│       │   │   ├── validate.middleware.ts # validate(schema) middleware
│       │   │   └── ratelimit.middleware.ts # globalLimiter, authLimiter, etc.
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── user.model.ts    # User schema (passwordHash, select:false)
│       │   │   │   ├── auth.service.ts  # Register, login, OTP, adminLogin, logout
│       │   │   │   ├── auth.controller.ts
│       │   │   │   └── auth.routes.ts   # POST /register, /login, /admin/login, etc.
│       │   │   ├── vehicles/
│       │   │   │   ├── vehicle.model.ts # IVehicle with sellerId, status, categories
│       │   │   │   └── vehicle.service.ts # CRUD, toggleAvailability, sellerStats
│       │   │   ├── bookings/
│       │   │   │   └── booking.model.ts # IBooking with userId/vehicleId, status
│       │   │   ├── seller/
│       │   │   │   ├── seller.controller.ts
│       │   │   │   ├── seller.service.ts # Re-exports from vehicle.service
│       │   │   │   └── seller.routes.ts  # All behind authenticate
│       │   │   └── admin/
│       │   │       ├── admin.controller.ts  # 10 handlers
│       │   │       ├── admin.service.ts     # Dashboard stats, users/vehicles/bookings CRUD
│       │   │       └── admin.routes.ts      # All behind requireAdmin
│       │   └── delivery/
│       │       ├── queues/
│       │       │   └── mail.queue.ts   # BullMQ mail queue
│       │       ├── services/
│       │       │   └── mail.service.ts # Resend/Mock email sender
│       │       └── workers/
│       │           └── mail.worker.ts  # BullMQ worker
│       ├── Dockerfile
│       ├── .env.example
│       ├── .env.docker
│       └── package.json
│
├── docker-compose.yml                 # 5 services: web, api, worker, mongo, redis
├── .env.example
├── .gitignore
├── package.json                       # npm workspaces root
└── README.md
```

## Authentication Flow

### Admin Login
```
1. User fills form on /admin/login
2. POST /api/auth/admin-login (Next.js proxy)
3. Proxy validates body (Zod), calls Express POST /api/v1/auth/admin/login
4. Express: checks credentials, returns JWT in response body
5. Proxy sets httpOnly cookie (sameSite: strict, secure in prod)
6. Redirect to /admin/dashboard
7. Edge middleware verifies JWT, checks role === "admin", allows through
```

### User Registration & Login
```
1. Client-side: auth-context calls lib/auth.ts → API_URL/api/v1/auth/register
2. Express: creates user, sends verification email via BullMQ
3. User clicks email link → POST /api/v1/auth/verify-email
4. Login: POST /api/v1/auth/login → returns JWT
5. Token stored in memory (context), not localStorage
```

### Brute-Force Protection
- 5 failed attempts → account locked for 15 minutes
- Admin login uses constant-time comparison
- Rate limiters per-route: auth (20/15m), OTP (5/1h), password reset (5/1h), admin (60/15m)

### Token Revocation (Logout)
- Every JWT has a `jti` (unique ID)
- On logout, `jti` is stored in Redis with TTL matching token expiry
- `authenticate` middleware checks Redis before accepting any JWT

## Admin Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/login` | GET | Admin login page |
| `/admin/dashboard` | GET | Stats, recent bookings, quick actions |
| `/admin/vehicles` | GET | List all vehicles with status filter, approve/reject/delete |
| `/admin/bookings` | GET | List all bookings with status progression |
| `/admin/users` | GET | List users, make admin, delete |
| `/admin/profile` | GET | View profile, sign out |

### API Proxy Routes (Next.js → Express)

| Next.js Route | Method | Express Target |
|---------------|--------|----------------|
| `/api/admin/dashboard` | GET | `GET /api/v1/admin/dashboard` |
| `/api/admin/vehicles` | GET | `GET /api/v1/admin/vehicles` |
| `/api/admin/vehicles/:id/status` | PATCH | `PATCH /api/v1/admin/vehicles/:id/status` |
| `/api/admin/vehicles/:id` | DELETE | `DELETE /api/v1/admin/vehicles/:id` |
| `/api/admin/bookings` | GET | `GET /api/v1/admin/bookings` |
| `/api/admin/bookings/:id/status` | PATCH | `PATCH /api/v1/admin/bookings/:id/status` |
| `/api/admin/users` | GET | `GET /api/v1/admin/users` |
| `/api/admin/users/:id/role` | PATCH | `PATCH /api/v1/admin/users/:id/role` |
| `/api/admin/users/:id` | DELETE | `DELETE /api/v1/admin/users/:id` |
| `/api/auth/admin-login` | POST | `POST /api/v1/auth/admin/login` |

All proxy routes forward the `token` httpOnly cookie to Express.

## Quick Start (Docker — full stack)

```bash
git clone <repo> rovio && cd rovio
docker compose up -d --build

# Open admin panel
open http://localhost:3000/admin/login
```

Starts 5 services: web, api, worker, mongodb, redis. Requires a rebuild on code changes.

## Development — Option A: Hybrid (infra in Docker, apps on host)

Fastest hot reload — Docker only manages MongoDB + Redis; apps run directly on your machine.

```bash
npm install

# Start MongoDB + Redis in background
docker compose -f docker-compose.dev.yml up -d mongodb redis

# Start both apps with hot reload
npm run dev

# Or individually:
npm run dev:web     # Next.js on :3000
npm run dev:api     # Express on :5000 (with tsx watch)
npm run worker      # BullMQ email worker
```

No rebuild needed on code changes — the apps pick them up automatically. Connect to MongoDB at `mongodb://127.0.0.1:27017/rovio` and Redis at `127.0.0.1:6379`.

## Development — Option B: All in Docker (hot reload)

Everything runs in Docker with volume mounts, so code changes reflect instantly without `--build`.

```bash
# Build dev images (only needed once, or when deps change)
docker compose -f docker-compose.dev.yml build

# Start all 5 services with hot reload
docker compose -f docker-compose.dev.yml up -d

# Watch logs
docker compose -f docker-compose.dev.yml logs -f

# Stop everything
docker compose -f docker-compose.dev.yml down
```

- Next.js at `http://localhost:3000` (with Turbopack hot reload)
- Express API at `http://localhost:5000` (with tsx watch)
- The worker also runs in dev mode with tsx watch
- Source directories are bind-mounted; `node_modules` and `.next` live in anonymous volumes (rebuild only when `package.json` changes)

## Environment Variables

Key shared vars in `.env.example`:

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `JWT_SECRET` | — | **Yes** | JWT signing secret |
| `API_KEY` | `""` | No | Internal service API key |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/rovio` | No | MongoDB connection |
| `REDIS_URL` | built from REDIS_HOST+PORT | No | Redis connection |
| `GOOGLE_CLIENT_ID` | `""` | No | Google OAuth client ID |
| `RESEND_API_KEY` | `""` | No | Resend email API key |
| `APP_URL` | `http://localhost:3000` | No | Frontend URL for CORS |

App-specific env templates:
- `apps/web/.env.docker` / `apps/web/.env.local`
- `apps/api/.env.docker` / `apps/api/.env`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both web + API in parallel |
| `npm run dev:web` | Next.js dev server only |
| `npm run dev:api` | Express API dev server only |
| `npm run build` | Build both apps |
| `npm run build:web` | Build Next.js only |
| `npm run build:api` | Build Express API only |
| `npm run lint` | Lint web app |
| `npm run worker` | Start email worker |

## Key Design Details

- **Express 5 types** (`@types/express@5.0.6`) cause `req.params` to be `string | string[]` — `String()` casts used in controllers.
- **MongoDB failure is non-fatal**: the API server starts even if DB is down; auth routes return proper errors instead of crashing.
- **All `@/` path aliases** in the API are converted to relative imports to avoid runtime resolution issues in Docker.
- **Admin sidebar layout** renders pages bare for `/admin/login` (no sidebar); all other admin pages get the full sidebar with nav, user avatar, and sign-out.
- **Cookie-based auth**: the `token` httpOnly cookie is set server-side by Next.js API proxy routes, not by client-side JS. The `auth-context.tsx` reads the user from a server endpoint (`/api/auth/me`) that verifies the cookie.
