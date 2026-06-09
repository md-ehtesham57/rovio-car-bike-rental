# Rovio — Car & Bike Rentals

A full-stack car and bike rental marketplace as a monorepo with a Next.js frontend and Express API backend.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Express 5, TypeScript
- **Database:** MongoDB 7
- **Cache/Queue:** Redis 7 (JWT blacklist, email worker queue)
- **Auth:** JWT (httpOnly cookies), Google OAuth, bcrypt
- **Containerization:** Docker Compose

## Structure

```
rovio/
├── apps/
│   ├── web/     Next.js app (port 3000)
│   └── api/     Express API (port 5000)
├── docker-compose.yml
└── package.json  (npm workspaces)
```

## Quick Start (Docker)

```bash
docker compose up -d --build
# Open http://localhost:3000
```

## Development (without Docker)

Requires MongoDB and Redis running locally (or via Docker).

```bash
# Start both apps concurrently
npm run dev

# Or individually
npm run dev:web
npm run dev:api
```

## Environment Variables

Key shared vars are documented in `.env.example`. App-specific env templates:
- `apps/web/.env.docker` / `apps/web/.env.local`
- `apps/api/.env.docker` / `apps/api/.env`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both web + API in parallel |
| `npm run dev:web` | Next.js dev server only |
| `npm run dev:api` | Express API dev server only |
| `npm run build` | Build both apps |
| `npm run build:web` | Build Next.js only |
| `npm run build:api` | Build Express API only |
| `npm run lint` | Lint web app |
| `npm run worker` | Start email worker |
