# Copilot Instructions — JetRent Ljubljana

## Project Overview

Slovenian-language marketing & inquiry website for jet ski (Sea-Doo Spark) rental in Ljubljana. Static-first Next.js 14 App Router site — no database, no auth. The only dynamic feature is the contact form (`/kontakt`) which uses a React Server Action (currently logs to console; Supabase integration is planned).

## Architecture

- **Framework:** Next.js 14 App Router, TypeScript, Tailwind CSS 3
- **UI primitives:** shadcn/ui pattern — Radix UI + `class-variance-authority` in `src/components/ui/`. Use `cn()` from `@/lib/utils` for conditional classes.
- **Path alias:** `@/*` → `./src/*`

### Key directories

| Path | Purpose |
|---|---|
| `src/data/` | All business content, pricing, FAQ, navigation as typed TS objects — **single source of truth** for copy and config |
| `src/components/home/` | Homepage section components, barrel-exported via `index.ts` |
| `src/components/ui/` | shadcn/ui primitives (Button, Card, Input, etc.) |
| `src/components/layout/` | Header (client component) and Footer |
| `src/app/` | Pages — Slovenian slug names (`/cenik`, `/kako-deluje`, `/vprasanja`, `/kontakt`, `/pogoji`, `/zasebnost`, `/pogodba`) |

### Content & data flow

All user-facing text lives in `src/data/` — **never hardcode Slovenian copy in components**. Components import from data files:
- `business.ts` — contact info, SEO defaults, product specs, rental rules
- `content.ts` — page-specific copy (hero text, step descriptions, CTA labels)
- `pricing.ts` — rental tiers, seasonal pricing, notes
- `faq.ts` — FAQ items with categories, helper `getFAQsByCategory()`
- `navigation.ts` — main nav and footer nav link arrays

## Conventions

### Language

- All UI text, metadata, and user-facing strings are in **Slovenian** (`lang="sl"`).
- Code (variable names, comments, types) is in **English**.

### Component patterns

- Pages are React Server Components by default. Only add `'use client'` when state/effects are needed (see `Header.tsx`, `InquiryForm.tsx`).
- Homepage is composed of section components: `<Hero />`, `<Benefits />`, `<HowItWorks />`, etc. — each reads its own content slice from `src/data/content.ts`.
- Every page uses `page-padding-top` class (compensates fixed header) and `section-padding` / `section-padding-sm` for vertical rhythm.
- SEO: each page exports `metadata: Metadata`. Root layout uses template `%s | JetRent Ljubljana` from `businessInfo.seo`.

### Styling

- Custom color scales: `primary-50..950` (aqua/water), `secondary-50..950` (warm yellow). Use these instead of generic Tailwind blue/yellow.
- CSS custom utility classes in `globals.css`: `heading-1`, `heading-2`, `heading-3`, `gradient-text`, `card-hover`, `page-padding-top`, `section-padding`.
- Button has custom variants: `default`, `secondary`, `outline`, `ghost`, `link`, **`cta`** (gradient). Sizes include `xl`.
- Icons: use `lucide-react` exclusively.

### Forms

- The inquiry form at `/kontakt` uses `useActionState` with a server action in `actions.ts`. Validation is server-side, errors returned per-field. Follow this pattern for any new forms.

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## When adding new pages

1. Create `src/app/<slovenian-slug>/page.tsx` — export `metadata` and a default server component.
2. Add page copy to `src/data/content.ts`, business data to the appropriate data file.
3. Add navigation entry in `src/data/navigation.ts` if it should appear in the nav/footer.
4. Use `page-padding-top` on the root wrapper and the standard section layout pattern from existing pages.
