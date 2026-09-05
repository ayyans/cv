# `yeddes.com` — Implementation Plan

**Date:** 2026-09-05
**Spec:** `docs/superpowers/specs/2026-09-05--design.md`
**Status:** Ready to execute

---

## Goal

Build the skeleton in the order: **scaffold → design system → content → chrome → sections → SEO → docs → verify**. Each phase ends in a runnable state (no half-broken snapshots).

## Phase Map

| # | Phase | Outcome |
|---|---|---|
| 0 | Env check | Confirm Node 20+, pnpm 9+ available. |
| 1 | Scaffold | `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `globals.css` — all wired. |
| 2 | Design system | Tailwind v4 CSS variables, Inter + JetBrains Mono via `next/font`, base globals. |
| 3 | Content model | `src/content/types.ts` (strict), `src/content/data.ts` (placeholders). |
| 4 | UI primitives | `button`, `card`, `tag`, `section-wrapper`, `social-icon`, `cn` util. |
| 5 | Theming | `theme-provider` (next-themes), `theme-toggle` (sun/moon), flash-free. |
| 6 | Layout chrome | `nav.tsx` (sticky, glassmorphism, mobile menu), `footer.tsx`. |
| 7 | Sections | `hero`, `about`, `tech-stack`, `projects`, `experience`, `contact`. |
| 8 | Page | `app/page.tsx` composes all sections. |
| 9 | SEO | `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, JSON-LD in `layout.tsx`, favicon. |
| 10 | Docs | `README.md` with install/customize/deploy steps. |
| 11 | Verify | `pnpm install` → `pnpm build` → `pnpm start` smoke. Walk acceptance criteria. |

## Execution Order (the linear list I'll follow)

1. Verify Node + pnpm versions.
2. Write `package.json` with all deps + scripts.
3. Write `tsconfig.json` (strict), `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`.
4. Write `src/app/globals.css` with Tailwind v4 + theme tokens.
5. Write `src/lib/utils.ts` (`cn`).
6. Write `src/content/types.ts` (all strict types).
7. Write `src/content/data.ts` (typed placeholder content).
8. Write `src/lib/stack-icons.tsx` (icon name → component map).
9. Write `src/components/ui/*` (button, card, tag, section-wrapper, social-icon).
10. Write `src/components/theme-provider.tsx` + `src/components/theme-toggle.tsx` + `src/components/mobile-menu.tsx`.
11. Write `src/components/nav.tsx`.
12. Write `src/components/footer.tsx`.
13. Write `src/components/sections/hero.tsx`.
14. Write `src/components/sections/about.tsx`.
15. Write `src/components/sections/tech-stack.tsx`.
16. Write `src/components/sections/projects.tsx`.
17. Write `src/components/sections/experience.tsx`.
18. Write `src/components/sections/contact.tsx`.
19. Write `src/app/layout.tsx` (fonts, ThemeProvider, metadata, JSON-LD).
20. Write `src/app/page.tsx` (composes all sections).
21. Write `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`.
22. Write `public/favicon.svg`.
23. Write `README.md`.
24. `pnpm install` (resolve deps).
25. `pnpm build` (verify no TS/build errors).
26. Smoke test (start dev server, curl `localhost:3000`, check for content).
27. Acceptance criteria walkthrough (the 11-item checklist from the spec).
28. Commit.

## Risks

- **Tailwind v4 syntax drift** — I'll use the `@theme` directive and CSS variables as documented in v4. If a directive doesn't exist, I'll fall back to v3-compatible config.
- **Motion package** — importing from `motion/react` (the new home of Framer Motion).
- **Network access for `pnpm install`** — needed. If it fails, I'll surface the error.
- **File count** — 25+ files. I'll batch parallel writes where possible.

## Done = Acceptance Criteria Met (from spec §16)

All 11 items in the spec's acceptance checklist pass.
