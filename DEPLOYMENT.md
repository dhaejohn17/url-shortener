# Deployment Guide

This document describes how the URL shortener is deployed on a Linux VM.

## Overview

The app runs as two Docker containers managed by Docker Compose:

1. **`nextjs`** — the Next.js app (standalone build, port 3000 internal only)
2. **`nginx`** — reverse proxy (Nginx Alpine, port 80 public)

A named Docker volume (`sqlite_data`) persists the SQLite database across container restarts and reboots.

## Server Requirements

- Ubuntu 22.04 (or any modern Linux distro)
- Docker Engine 24+
- Docker Compose v2
- Ports 80 open in firewall/security group

## Initial Server Setup

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# 3. Verify
docker --version
docker compose version
```

## Deployment Steps

```bash
# 1. Clone the repository
git clone <repo-url> /opt/url-shortener
cd /opt/url-shortener

# 2. Create .env file (never commit this)
cp .env.example .env
nano .env
# Set: ADMIN_PASSWORD=<your-strong-password>

# 3. Build and start in detached mode
docker compose up -d --build

# 4. Verify containers are running
docker compose ps

# 5. Check logs
docker compose logs -f
```

The app should now be reachable at `http://<vm-ip>`.

## Process Management

Docker Compose is configured with `restart: always` on both services. This means:

- Containers auto-restart if they crash
- Containers auto-start when Docker itself starts (e.g. after a reboot)

Docker Engine is enabled as a systemd service automatically during installation:

```bash
# Verify Docker starts on boot
sudo systemctl is-enabled docker
# Should print: enabled
```

After a `sudo reboot`, Docker Engine starts, and Docker Compose containers come back up automatically within ~30 seconds.

## Reverse Proxy: Nginx

Nginx listens on port 80 and proxies all requests to the Next.js container at `nextjs:3000` (Docker's internal DNS).

Key headers forwarded:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

The Next.js app uses `X-Forwarded-Proto` to build correct short URLs.

## Environment Variables

- Stored in `.env` at the project root (gitignored)
- Docker Compose reads `.env` automatically and passes variables to the `nextjs` container
- A `.env.example` with placeholders is committed for reference

```bash
# .env (never committed)
ADMIN_PASSWORD=your-strong-password-here
DB_DIR=/app/data
```

## Persistent Storage

The SQLite database lives at `/app/data/urls.db` inside the `nextjs` container. This path is backed by a named Docker volume:

```yaml
volumes:
  sqlite_data:
    driver: local
```

This volume is stored at `/var/lib/docker/volumes/url-shortener_sqlite_data/` on the host and persists across `docker compose down/up` and reboots.

**The database is never in `/tmp` or any ephemeral path.**

## Reboot Test

To simulate a reboot and verify recovery:

```bash
sudo reboot
# Wait ~60 seconds, then:
curl http://<vm-ip>
# Should return the home page HTML
```

## Updating the App

```bash
cd /opt/url-shortener
git pull
docker compose up -d --build
```

## Useful Commands

```bash
# View running containers
docker compose ps

# View logs (follow mode)
docker compose logs -f

# Restart a specific service
docker compose restart nextjs

# Open a shell in the Next.js container
docker compose exec nextjs sh

# Inspect the SQLite database
docker compose exec nextjs sh -c "ls -lah /app/data/"
```
