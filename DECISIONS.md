# Technical Decisions

Three specific technical decisions made during this project, including what was considered, what was chosen, and why.

---

## 1. Process Management: Docker Compose over PM2 or systemd

### What I considered

- **PM2** — the most common choice for Node.js apps. Easy to set up, has `pm2 startup` for reboot persistence, and integrates with the host's process tree directly.
- **systemd** — the Linux-native option. Robust, zero overhead, and every modern distro ships it. Requires writing a unit file and managing the app as a host process.
- **Docker Compose** — containers for both the app and Nginx, with `restart: always` providing auto-restart and reboot resilience.

### What I chose

**Docker Compose**

### Why

Docker Compose solves more than just process management — it solves the entire deployment environment. By containerising both Next.js and Nginx together:

- The app runs identically on any Linux VM regardless of what's installed on the host (no Node version conflicts, no global npm packages)
- Nginx and Next.js are wired together via Docker's internal DNS (`nextjs:3000`) without exposing the app port to the outside
- The named volume for SQLite is declared in the same file as everything else, making the whole setup self-documenting
- `restart: always` handles both crash recovery and reboot resilience in one line

PM2 would've been simpler for just the Node process, but then I'd still need to separately manage Nginx on the host and worry about the host's Node version. Systemd is excellent but requires more manual configuration and doesn't help with Nginx or environment isolation.

---

## 2. Database: better-sqlite3 over Prisma with SQLite

### What I considered

- **Prisma with SQLite** — an ORM with a schema file, type-safe client, and migration tooling. Great for larger projects where you want schema versioning and abstract queries.
- **better-sqlite3** — a low-level synchronous SQLite binding. Direct SQL, zero abstraction, very fast.

### What I chose

**better-sqlite3**

### Why

This app has two tables at most and four SQL statements total. Pulling in Prisma (which adds a code-generation step, a schema file, a migrations folder, and a ~200ms startup time to generate the client) would be significant over-engineering for a URL shortener.

`better-sqlite3`'s synchronous API is actually an advantage in Next.js Server Components and API routes — no need to `await` every query, and there's no risk of concurrent write errors since SQLite handles that at the file level with WAL mode enabled.

If this app were to grow into something with complex relations and team members unfamiliar with SQL, Prisma would become the right choice.

---

## 3. Next.js Build Mode: standalone output over a regular build

### What I considered

- **Standard build (`next build`)** — outputs to `.next/`, but requires the full `node_modules` to be present at runtime. In Docker this means either copying all of `node_modules` into the final image or running `npm install` at runtime — both result in very large images (~800MB+).
- **Standalone output (`output: 'standalone'`)** — Next.js traces exactly which files are needed and copies them into `.next/standalone`, producing a self-contained `server.js` that needs no `node_modules` at all.

### What I chose

**Standalone output**

### Why

The Dockerfile uses a multi-stage build: install deps → build → copy only the standalone output into the final runner image. This drops the final image size from ~800MB to ~200MB. A smaller image means:

- Faster deploys (less to push/pull)
- Smaller attack surface
- Less disk usage on the VM

The standalone output is the officially recommended approach for containerised Next.js deployments and pairs naturally with the multi-stage Dockerfile pattern.
