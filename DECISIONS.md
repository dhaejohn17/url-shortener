# Technical Decisions

Three specific technical decisions made during this project, including what was considered, what was chosen, and why.

---

## 1. Process Management: Docker Compose over PM2 or systemd

### What I considered
- **PM2** — a popular process manager for Node.js apps with built-in restart and startup features
- **systemd** — the Linux-native option, robust and available on every modern distro
- **Docker Compose** — containers for both the app and Nginx, with `restart: always` for auto-restart and reboot resilience. It also supports `restart: unless-stopped` but `restart: always` was chosen since it ensures the app comes back up even after a full VM reboot, which is a requirement for this exam.

### What I chose
**Docker Compose**

### Why
I chose Docker because I am already familiar with containers and how they work. For me it is much cleaner compared to systemd and PM2 — everything is defined in one `docker-compose.yml` file, including the app, Nginx, and the database volume. I have more hands-on experience with Docker compared to the other two options, which made it easier to set up, debug, and explain.

---

## 2. Reverse Proxy: Nginx over Caddy

### What I considered
- **Caddy** — a modern reverse proxy with automatic HTTPS and a simpler config syntax --> I actually just googled this one, but as far as I know, this one works the same as Nginx, I dont just know yet if it's lighter than Nginx. But I sticked to Nginx since Nginx is more popular to use and have wider documentation.
- **Nginx** — a popular reverse proxy that is widely used in production environments

### What I chose
**Nginx**

### Why
I chose Nginx because I already have experience with how reverse proxies work, particularly from using Apache before. Nginx and Apache share similar concepts — virtual hosts, proxying, and header management — so the transition was straightforward. I was confident I could configure it correctly and explain it, which was important given the exam requirement of understanding everything submitted.

---

## 3. Database Library: better-sqlite3 over Prisma

### What I considered
- **Prisma with SQLite** — an ORM with a schema file, type-safe client, and migration tooling. Good for larger projects with complex relations
- **better-sqlite3** — a lightweight, synchronous SQLite binding with direct SQL queries.

### What I chose
**better-sqlite3**

### Why
I chose better-sqlite3 because I wanted to be familiar with what I was using and be able to explain it clearly. Prisma adds a lot of abstraction — schema files, migrations, generated clients — which can be harder to explain if you are not deeply familiar with it. With better-sqlite3, the SQL queries are written directly and are easy to read and understand. For a small project like this URL shortener with only one table, better-sqlite3 was the right fit.

