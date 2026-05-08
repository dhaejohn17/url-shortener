# AI Usage

## Tools Used

- **Claude (Anthropic)** — used throughout the project for code generation, file structure planning, Dockerfile authoring, Nginx config, and the four documentation files.

---

## How AI Was Used

AI assistance was used for the following:

- Generating the initial Next.js project structure and boilerplate
- Writing the `better-sqlite3` database module with WAL mode enabled
- Drafting the multi-stage Dockerfile for a Next.js standalone build
- Writing the Nginx reverse proxy configuration with correct `proxy_set_header` directives
- Drafting `docker-compose.yml` with named volumes and health checks
- Writing this documentation

All generated code was reviewed, tested, and understood before submission. Nothing was submitted that couldn't be explained.

---

## Example Where AI Was Wrong or Unhelpful

**Situation:** When asking Claude to generate the redirect page, it initially used Next.js 13-style `params` typing — treating `params` as a plain object:

```tsx
// What Claude first generated (incorrect for Next.js 15)
export default async function RedirectPage({ params }: { params: { code: string } }) {
  const { code } = params;
  ...
}
```

**The problem:** In Next.js 15, dynamic route `params` are now a **Promise** that must be awaited. Using the old pattern causes a runtime warning in dev and will silently break in strict mode:

```
Warning: params should be awaited before accessing its properties
```

**The fix:** The correct pattern for Next.js 15 is:

```tsx
interface Props {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: Props) {
  const { code } = await params;  // must await
  ...
}
```

Claude initially wasn't aware of this Next.js 15 breaking change and generated the old API. I caught it by checking the Next.js 15 release notes and corrected it manually.

**Lesson:** AI tools have training cutoffs and may not know about recent breaking changes in frameworks. Always verify generated code against the actual framework documentation, especially for version-specific APIs.
