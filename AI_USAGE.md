# AI Usage

## Tools Used

- **Claude (Anthropic)** — primary tool for code generation, deployment guidance, and debugging
- **ChatGPT (OpenAI)** — code generation and alternative implementation reference, research for compatibility checking
- **Gemini (Google)** — used occasionally for compatibility checking and cross-referencing

---

## How AI Was Used

- Generating the initial Next.js project structure and boilerplate
- Writing the `better-sqlite3` database module
- Drafting the multi-stage Dockerfile
- Writing the Nginx reverse proxy configuration
- Checking `docker-compose.yml` for typos and errors, adding named volumes
- Debugging deployment errors on the VM
- Template guide in writing this documentation for typos, misspelling, and grammar checking
- Generating notes for Notion to easily track checklist, errors, and credentials (Documentation)

All generated code was reviewed, tested, and understood before submission.

---

## Examples Where AI Was Wrong or Unhelpful

### 1. ChatGPT's Dockerfile failed to build
ChatGPT's generated Dockerfile caused the Next.js build to fail during `npm run build`. The build crashed with an error during static page generation. After troubleshooting, I switched to Claude's Dockerfile which built successfully.

References:
- https://docs.docker.com/build/guide/ — Docker official build guide
- https://nextjs.org/docs/messages/prerender-error — Next.js prerender errors

### 2. Claude's Dockerfile used `npm ci` without a lock file
Claude generated a Dockerfile that used `npm ci` to install dependencies. However, `npm ci` requires a `package-lock.json` file to exist, which wasn't included in the project. This caused the Docker build to fail with:

```
npm error The `npm ci` command can only install with an existing package-lock.json
```

The fix was simple — change `npm ci` to `npm install` in the Dockerfile.

References:
- https://docs.npmjs.com/cli/v10/commands/npm-ci — official npm ci docs, 

### 3. HTTP 307 instead of HTTP 302
Both AIs initially implemented the redirect using Next.js's built-in `redirect()` function from `next/navigation`. However, this returns **HTTP 307** by default, not **HTTP 302** as required by the exam.

The fix was to convert the page component into a Route Handler using `NextResponse.redirect(url, { status: 302 })` which gives full control over the HTTP response code.

References:
- https://nextjs.org/docs/app/api-reference/functions/next-response#redirect — NextResponse.redirect docs
- https://nextjs.org/docs/app/building-your-application/routing/route-handlers — Route Handlers docs

### 4. Next.js version mismatch
The exam required Next.js 16+, but Claude's generated `package.json` specified `"next": "^15.3.0"` which installed version 15.5.18. This was caught by checking the actual installed version inside the Docker container and fixed by updating to `"next": "^16.0.0"`.

References:
- https://nextjs.org/changelog — Next.js version changelog
- https://www.npmjs.com/package/next — check latest Next.js version on npm

---

## General Troubleshooting References

- **Stack Overflow** — https://stackoverflow.com (search any error message here first)
- **Docker Docs** — https://docs.docker.com
- **Next.js Docs** — https://nextjs.org/docs
- **npm Docs** — https://docs.npmjs.com

