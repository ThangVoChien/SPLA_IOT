# SPLA IoT Platform (Core)

## Project Overview: Why SPLA

SPLA IoT Platform is a multi-tenant IoT monitoring core designed for B2B SaaS environments. It is built to solve a practical problem: organizations need one platform that can ingest device telemetry at scale, isolate tenant data safely, and react to abnormal readings in real time.

Why this project matters:

- Tenant isolation by design: each organization has separate users, devices, and operational scope.
- Operational control with RBAC: ADMIN and USER roles reduce governance risk in shared deployments.
- Real-time visibility: telemetry is streamed to dashboards so teams can respond immediately.
- Actionable alerting: threshold rules turn raw sensor data into warning signals and notifications.
- Extensible domain architecture: SPLA hooks allow domain-specific logic without breaking core services.

In short, SPLA is not only a dashboard. It is a reusable IoT application backbone that combines authentication, device lifecycle management, telemetry ingestion, alert orchestration, and real-time monitoring in one maintainable platform.

SPLA IoT Platform is a multi-tenant IoT monitoring application built with Next.js App Router and Prisma (SQLite).
It provides:

- Session-based authentication with role checks (ADMIN/USER)
- Organization-scoped device management
- Telemetry ingestion and threshold-based alerting
- Real-time dashboard updates via Server-Sent Events (SSE)
- Optional Telegram alert dispatch

## Tech Stack

- Next.js 15 (App Router)
- React 19 RC
- Prisma ORM + SQLite
- Bootstrap 5 + Bootstrap Icons
- Chart.js / react-chartjs-2
- jose (JWT)

## Project Structure

- `app/`: UI pages + API routes
- `components/core/`: dashboard and CRUD UI components
- `lib/services/`: business services (auth, admin, devices, ingest, notifications)
- `lib/db/`: Prisma client
- `lib/core/`: event bus + extension contracts
- `lib/domain/`: domain bootstrap hooks
- `prisma/schema.prisma`: data model
- `middleware.js`: auth and RBAC route guards
- `next.config.mjs`: startup bootstrap (DB init + seeded admin)

## Data Model Overview

Main entities:

- `Organization`
- `User` (linked to Organization, role-based)
- `Sensor`
- `Device` (linked to Organization + Sensor)
- `Threshold` (1:1 with Device)
- `Telemetry`
- `Alert`
- `Log` (audit trail)
- `Telegram` (optional user Telegram settings)

See full schema in `prisma/schema.prisma`.

## API Overview

### Auth

- `POST /api/auth/register`: register org + user (role USER), sets session cookie
- `POST /api/auth/login`: login, sets session cookie
- `POST /api/auth/logout`: clear session
- `GET /api/auth/me`: return current session payload

### User Profile

- `PUT /api/users/profile`: update user Telegram settings
- `PUT /api/users/profile/password`: change password
- `GET /api/sensors/list`: list available sensor types for authenticated users

### Device and Threshold (org-scoped)

- `GET /api/devices`: list devices for current org
- `POST /api/devices`: create device (+ optional threshold)
- `PUT /api/devices/:id`: update device
- `DELETE /api/devices/:id`: delete device
- `PUT /api/devices/:id/threshold`: upsert threshold
- `DELETE /api/devices/:id/threshold`: delete threshold

### Ingestion, Alerts, Streaming

- `POST /api/ingest`: ingest `{ macAddress, value }` telemetry
- `GET /api/alerts`: recent alerts (last 24h, capped)
- `GET /api/stream`: SSE stream for telemetry/alerts/stats updates

### Admin

Protected by middleware (`/api/admin/*`, ADMIN only):

- Users: `POST /api/admin/users`, `PUT/DELETE/PATCH /api/admin/users/:id`
- Organizations: `POST /api/admin/organizations`, `PUT/DELETE /api/admin/organizations/:id`
- Sensors: `POST /api/admin/sensors`, `PUT/DELETE /api/admin/sensors/:id`

### Dashboard helper

- `GET /api/dashboard/stats`: current org dashboard metrics (e.g., device count)

## Security and Access Control

- Session stored in HTTP-only `session` cookie
- Middleware protects:
  - `/dashboard/*`
  - `/api/admin/*` (ADMIN role)
  - `/api/devices/*` and `/api/users/*` (authenticated)
- Root route `/` auto-redirects to `/dashboard` when authenticated, else `/login`

## Environment Variables

Create `.env` (or copy from `.env.example` and edit):

```env
DATABASE_URL="file:../prisma/dev.db"
TELEGRAM_BOT_TOKEN=""
# Optional (recommended in production)
JWT_SECRET="replace_me_with_strong_secret"
NEXT_PUBLIC_APP_DOMAIN="CORE"
```

Notes:

- If `TELEGRAM_BOT_TOKEN` is empty, Telegram sends are mocked to console logs.
- Current auth service uses a hardcoded fallback secret in code; move to `JWT_SECRET` for production.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Ensure environment file exists (`.env`).

3. Run development server:

```bash
npm run dev
```

4. Open:

- `http://localhost:3000/login`

## Startup Bootstrap Behavior

On startup (via `next.config.mjs`), app attempts to:

- Ensure DB tables exist (runs `prisma db push --skip-generate` when needed)
- Seed default org and admin user
- Trigger optional domain server bootstrap (`lib/domain/boot.js`)

Default seeded admin credentials:

- Username: `admin`
- Password: `admin`

Change these immediately outside local development.

## Domain Extensibility (SPLA hooks)

`lib/domain/boot.js` supports dynamic domain loading through `NEXT_PUBLIC_APP_DOMAIN`.

- Server phase: `bootServer()`
- Client phase: `bootClient()`

If domain modules are missing, core mode continues safely.

## Real-time Updates

`/api/stream` exposes SSE events:

- `connected`
- `telemetry`
- `alert`
- `stats_update`

Events are emitted from the in-memory event bus (`lib/core/event-bus.js`).

## Known Notes

- Simulator route folders exist but are currently empty:
  - `app/api/simulator/dispatch/`
  - `app/api/simulator/scenarios/`
- SQLite is used by default; for production, use managed DB and hardened secrets/cookies.

## NPM Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run start`: start production server
- `npm run lint`: run Next.js lint
