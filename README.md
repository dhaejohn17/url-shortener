# URL Shortener

A simple URL shortener built and deployed by **Dhaene John Balbastro** as part of a Software Engineer Take-Home Exam.

This project was an enjoyable deployment experience and a great opportunity for growth

---

## What It Does

- **Shorten URLs** — paste a long URL and get a short code back
- **Redirect** — visiting `/<code>` does an HTTP 302 redirect to the original URL
- **Click tracking** — each redirect increments a click counter
- **Admin dashboard** — password-protected page listing all URLs and click counts
- **Persistent storage** — SQLite database stored in a Docker volume (survives reboots)
- **Reboot resilient** — Docker's `restart: always` keeps the app alive after VM reboots

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | SQLite via `better-sqlite3` |
| Reverse Proxy | Nginx (Alpine) |
| Containers | Docker + Docker Compose |
| Server | Ubuntu 24.04 LTS |

---

## Why Docker?

Docker was the MVP of this deployment. It made everything cleaner and easier to manage:

- The app and Nginx run as separate containers but communicate internally
- The SQLite database is stored in a named volume that persists across reboots
- `restart: always` means the app auto-recovers from crashes and VM reboots
- The entire setup is defined in one `docker-compose.yml` file — easy to read and explain

---

## Project Structure

```
url-shortener/
├── src/
│   ├── app/
│   │   ├── [code]/route.ts         # HTTP 302 redirect handler
│   │   ├── admin/page.tsx          # Admin dashboard
│   │   ├── api/
│   │   │   ├── shorten/route.ts    # POST /api/shorten
│   │   │   ├── admin/urls/route.ts # GET  /api/admin/urls
│   │   │   └── health/route.ts     # GET  /api/health
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Home page
│   │   └── globals.css
│   └── lib/
│       └── db.ts                   # SQLite setup & helpers
├── nginx/
│   └── nginx.conf                  # Reverse proxy config
├── Dockerfile                      # Multi-stage build
├── docker-compose.yml              # App + Nginx + Volume
├── .env.example                    # Environment variable template
├── README.md
├── DEPLOYMENT.md
├── DECISIONS.md
└── AI_USAGE.md
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ADMIN_PASSWORD` | Password for the `/admin` page | Yes |
| `DB_DIR` | Directory for the SQLite file (default: `./data`) | No |

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/dhaejohn17/url-shortener.git
cd url-shortener

# Copy and configure environment
cp .env.example .env
nano .env  # set ADMIN_PASSWORD

# Build and start
docker compose up -d --build

# Open in browser
http://localhost
```

---

## Live Demo

- **Public URL:** http://35.188.109.30
- **Admin page:** http://35.188.109.30/admin

