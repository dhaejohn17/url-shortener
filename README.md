# URL Shortener

A simple URL shortener built with Next.js 15 (App Router), SQLite via `better-sqlite3`, and deployed with Docker Compose + Nginx.

## Features

- **Shorten URLs** — paste a long URL, get a short code back
- **Redirect** — visiting `/<code>` does an HTTP 302 redirect to the original URL
- **Click tracking** — each redirect increments a click counter
- **Admin dashboard** — password-protected page listing all URLs and click counts
- **Persistent storage** — SQLite database stored in a Docker volume (survives reboots)
- **Reboot resilient** — Docker's `restart: always` policy keeps the app alive

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | SQLite via `better-sqlite3` |
| Reverse Proxy | Nginx (Alpine) |
| Container | Docker + Docker Compose |

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd url-shortener

# Install dependencies
npm install

# Copy env file and set your admin password
cp .env.example .env.local
# Edit .env.local and set ADMIN_PASSWORD

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Running with Docker Compose

```bash
# Copy and configure environment
cp .env.example .env
nano .env   # set ADMIN_PASSWORD

# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

## Project Structure

```
url-shortener/
├── src/
│   ├── app/
│   │   ├── [code]/page.tsx        # Redirect handler
│   │   ├── admin/page.tsx         # Admin dashboard (client)
│   │   ├── api/
│   │   │   ├── shorten/route.ts   # POST /api/shorten
│   │   │   ├── admin/urls/route.ts# GET  /api/admin/urls
│   │   │   └── health/route.ts    # GET  /api/health
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Home page
│   │   └── globals.css
│   └── lib/
│       └── db.ts                  # SQLite setup & helpers
├── nginx/
│   └── nginx.conf
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── docs/
    ├── DEPLOYMENT.md
    ├── DECISIONS.md
    └── AI_USAGE.md
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ADMIN_PASSWORD` | Password for the `/admin` page | Yes |
| `DB_DIR` | Directory for the SQLite file (default: `./data`) | No |

## Admin Access

Navigate to `/admin` and enter the password set in `ADMIN_PASSWORD`.
