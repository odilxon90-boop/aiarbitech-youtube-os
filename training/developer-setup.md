# Developer Setup — YouTube OS

This guide gets you from zero to a fully running local development environment. Follow each step in order.

---

## Prerequisites

Install these tools before starting:

| Tool | Version | Install |
|---|---|---|
| Node.js | 20 LTS | https://nodejs.org or `nvm install 20` |
| npm | ≥ 10 | Comes with Node.js |
| Docker Desktop | Latest | https://docs.docker.com/get-docker/ |
| Git | ≥ 2.40 | https://git-scm.com |
| jq | Any | `brew install jq` / `apt install jq` |

**Verify:**
```bash
node --version    # v20.x.x
npm --version     # 10.x.x
docker --version  # 27.x.x or later
git --version     # 2.x.x
```

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/aiarbitech/aiarbitech-youtube-os.git
cd aiarbitech-youtube-os
```

---

## Step 2 — Configure Environment Variables

Copy the example environment file and fill in values:

```bash
cp .env.example .env
```

Open `.env` and set:

```bash
# Required
DATABASE_URL=postgresql://youtube_os:youtube_os@localhost:5432/youtube_os
REDIS_URL=redis://:youtube_os@localhost:6379/0
CORS_ORIGIN=http://localhost:5173

# Optional (leave blank for local dev)
GLOBAL_ECOSYSTEM_API_URL=
GLOBAL_ECOSYSTEM_API_KEY=
```

> **Never commit `.env` to git.** It is listed in `.gitignore`.

---

## Step 3 — Start Infrastructure Services

Start PostgreSQL and Redis with Docker:

```bash
docker compose up -d postgres redis
```

Verify they are healthy:

```bash
docker compose ps
# postgres: healthy
# redis:    healthy
```

---

## Step 4 — Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Step 5 — Set Up the Database

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Validate the schema:

```bash
npx prisma validate
```

> If `migrate dev` fails, check that `DATABASE_URL` in `.env` is correct and PostgreSQL is running.

---

## Step 6 — Run the Backend

```bash
npm run dev
```

You should see:

```
Server listening at http://localhost:3000
```

Test it:

```bash
curl http://localhost:3000/api/v1/health
# {"status":"ok"}
```

---

## Step 7 — Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

---

## Step 8 — Run the Frontend

```bash
npm run dev
```

Open http://localhost:5173 in your browser. You should see the YouTube OS platform shell.

---

## Step 9 — Run the Test Suite

**Backend tests (202 tests):**
```bash
cd backend
npm test
```

All tests should pass. Tests use an in-memory SQLite-compatible layer — no running database required for tests.

**Frontend type check:**
```bash
cd frontend
npm run typecheck
```

**Frontend tests:**
```bash
cd frontend
npm test
```

---

## Step 10 — TypeScript Type Checking

Run this before committing to catch type errors:

```bash
# Backend
cd backend && npm run typecheck

# Frontend
cd frontend && npm run typecheck
```

Both should exit with 0 errors.

---

## Daily Development Workflow

```bash
# Start infrastructure (once per session)
docker compose up -d postgres redis

# Terminal 1 — Backend with hot reload
cd backend && npm run dev

# Terminal 2 — Frontend with hot reload
cd frontend && npm run dev

# Terminal 3 — Run tests on change
cd backend && npm test -- --watch
```

---

## Useful Scripts

### Backend

| Script | Command | Purpose |
|---|---|---|
| Development server | `npm run dev` | Starts with hot reload |
| Type check | `npm run typecheck` | Validates TypeScript |
| Tests | `npm test` | Runs all tests with Vitest |
| Build | `npm run build` | Compiles TypeScript to `dist/` |
| Start production | `npm start` | Runs compiled build |
| Prisma generate | `npx prisma generate` | Regenerates Prisma client |
| Prisma migrate | `npx prisma migrate dev` | Applies pending migrations |
| Prisma studio | `npx prisma studio` | Visual database browser at :5555 |

### Frontend

| Script | Command | Purpose |
|---|---|---|
| Development server | `npm run dev` | Vite dev server with HMR |
| Type check | `npm run typecheck` | Validates TypeScript |
| Build | `npm run build` | Production build to `dist/` |
| Preview | `npm run preview` | Preview production build locally |

---

## Full Docker Stack (optional)

To run everything in Docker (mimics production):

```bash
docker compose up -d
```

This starts: PostgreSQL, Redis, Backend (port 3000), Frontend (port 5173).

Stop everything:

```bash
docker compose down
```

Stop and remove volumes (full reset):

```bash
docker compose down -v
```

---

## IDE Setup (VS Code)

Recommended extensions (install via Extensions panel):

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Prisma** — `Prisma.prisma`
- **TypeScript Import Sorter** — `mike-co.import-sorter`
- **Docker** — `ms-azuretools.vscode-docker`
- **REST Client** — `humao.rest-client` (test APIs without Postman)

Workspace settings are in `.vscode/settings.json` if present.

---

## Common Setup Issues

### `DATABASE_URL` not set error
```
EnvironmentValidationError: DATABASE_URL: Required
```
**Fix:** Ensure `.env` exists in `backend/` directory with `DATABASE_URL` set. The `.env` file must be in the directory where you run `npm run dev`.

### PostgreSQL connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Fix:** `docker compose up -d postgres` and wait for it to be healthy (`docker compose ps`).

### Prisma client out of date
```
Error: @prisma/client did not initialize yet
```
**Fix:** `cd backend && npx prisma generate`

### Port already in use
```
Error: listen EADDRINUSE :::3000
```
**Fix:** `lsof -ti:3000 | xargs kill` (macOS/Linux) or find and kill the process in Task Manager (Windows).

### Node version mismatch
**Fix:** Use `nvm use 20` or install Node.js 20 LTS from https://nodejs.org

---

## Next Steps

- Read [Platform Overview](overview.md) to understand architecture
- Read [Operations Guide](operations.md) once you're comfortable developing
- Browse `backend/src/` — each folder is a bounded context
- Read `docs/ARCHITECTURE.md` for design decisions
