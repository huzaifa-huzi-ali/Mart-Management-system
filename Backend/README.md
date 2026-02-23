# Food Management Backend (PostgreSQL)

## Stack
- Node.js + Express
- PostgreSQL (`pg`)
- JWT auth (`jsonwebtoken`)
- Password hashing (`bcryptjs`)

## Quick Start
1. Copy `.env.example` to `.env`.
2. Fill required values (`DATABASE_URL`, `JWT_SECRET`, etc.).
3. Install deps: `npm install`
4. Run locally: `npm run dev`

## Required Environment Variables
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` (minimum 32 characters)

## Optional Environment Variables
- `PORT` (default: `5000`)
- `JWT_EXPIRES_IN` (default: `7d`)
- `CORS_ORIGIN` (comma-separated allowed origins)
- `RATE_LIMIT_WINDOW_MS` (default: `900000`)
- `RATE_LIMIT_MAX` (default: `300`)
- `DB_POOL_MAX` (default: `20`)
- `DB_IDLE_TIMEOUT_MS` (default: `30000`)
- `DB_CONNECT_TIMEOUT_MS` (default: `10000`)
- `PGSSLMODE=disable` (only for local non-SSL DBs)

## Railway Deployment
1. Push repo to GitHub.
2. In Railway, create a new project and deploy this `Backend` service.
3. Add a PostgreSQL plugin in the same Railway project.
4. In backend service variables, set:
   - `DATABASE_URL` = PostgreSQL plugin `DATABASE_URL`
   - `JWT_SECRET` = strong random value (>= 32 chars)
   - `CORS_ORIGIN` = your frontend Railway domain
   - Optional tuning vars from `.env.example`
5. Railway will run `npm run start` and use health check `/api/health` from `railway.json`.

## Current Production API Domain
- Backend base URL: `https://postgres-production-29d1.up.railway.app`
- Frontend should call: `https://postgres-production-29d1.up.railway.app/api`

## Security Defaults Enabled
- Helmet security headers
- Global rate limiting
- Strict Bearer token parsing
- Centralized server error messages (no stack/details in API responses)
- Required env validation at startup

## Health Check
- `GET /api/health`
