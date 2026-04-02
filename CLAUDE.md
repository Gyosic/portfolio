# Portfolio Project

## Tech Stack
- Next.js 15 (App Router, Turbopack)
- TypeScript (strict)
- Tailwind CSS 4 + tw-animate-css
- Radix UI (shadcn/ui) + Lucide icons
- Drizzle ORM + PostgreSQL
- NextAuth v5 (beta)
- Vercel AI SDK + OpenAI
- Biome (formatter + linter)
- react-i18next (Korean/English)

## Project Structure
```
app/[lng]/          # i18n pages (ko, en)
app/[lng]/admin/    # Admin pages (auth required)
app/api/            # API routes
components/ui/      # shadcn/ui primitives (DO NOT modify directly)
components/bits/    # Custom compound components (DO NOT modify directly)
components/         # Project components
hooks/              # Custom React hooks
lib/                # Utilities, DB client, helpers
drizzle/            # DB schema and migrations
scripts/            # Build, embedding, DB scripts
public/             # Static assets
styles/             # Global styles
```

## Coding Conventions
- Biome: 2-space indent, 100 char line width, LF line endings
- Server Components by default, `"use client"` only when needed
- Named exports preferred
- Use `cn()` from `lib/utils` for conditional Tailwind classes
- All user-facing text via i18n translation keys
- Zod for all input validation

## Development Pipeline (Agent Team)

### @designer - UI/UX Design
Wireframes and component design using Pencil MCP.
Output: Design specs with component structure, responsive notes, Tailwind classes.

### @frontend - Frontend Development
React/Next.js implementation from design specs.
Handles components, pages, client state, i18n.

### @backend - Backend Development
API routes, DB schema, server actions, auth flows.
Uses Drizzle ORM for all database operations.

### @qa - Quality Assurance
Code review, build verification, lint/type checks.
Read-only access - cannot modify code.

### Pipeline Flow
```
Design -> Frontend + Backend (parallel) -> QA -> Deploy
```

## Commands
- `npm run dev` - Dev server (Turbopack)
- `npm run build` - Production build
- `npm run lint` - Next.js lint
- `npm run drizzle:generate` - Generate + push DB migration
- `npm run embedding` - Re-embed portfolio content
- `npx @biomejs/biome check .` - Full Biome check
- `npx tsc --noEmit` - Type check
- `npx knip` - Dead code detection
