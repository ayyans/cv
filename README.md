# yeddes.com — Personal Portfolio

A modern, single-page portfolio for **yeddes.com** — built with Next.js 15, TypeScript, Tailwind v4, and Motion. Dark by default with a light toggle, blue + cyan-mint palette, deployable to Vercel in two clicks.

> **TL;DR** — edit `src/content/data.ts` to make it yours. Push to `main`. Vercel handles the rest.

---

## Tech stack

- **Next.js 15** (App Router) + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **Motion** (formerly Framer Motion) for scroll reveals + hovers
- **lucide-react** for icons
- **next-themes** for flash-free theme switching
- **Inter** + **JetBrains Mono** via `next/font`

## Prerequisites

- **Node.js 20+**
- **pnpm 9+** (recommended) — or `npm`/`yarn`/`bun` (just swap commands)

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content (no code)

The entire site reads from one file: **`src/content/data.ts`**. Open it and edit:

| Field | What it controls |
|---|---|
| `profile.name` | Hero headline + `<title>` + OG image |
| `profile.tagline` | Hero sub-line + meta description |
| `profile.bio` | About section paragraph |
| `profile.socials[]` | Footer + Contact section icons |
| `profile.availableForWork` | Toggles the green "Available for work" pill |
| `stack[]` | The 4-column tool grid |
| `projects[]` | Featured project cards |
| `experience[]` | Career timeline |
| `quickFacts[]` | About-section stat cards |

Types live in `src/content/types.ts` — strict, so a typo in a field name fails the build.

To add a new icon to a project or stack item:

1. Open `src/lib/stack-icons.tsx`
2. Import the lucide-react icon, e.g. `import { Boxes } from "lucide-react"`
3. Add it to the `iconMap` object
4. Reference it by name in `data.ts`

## Production build

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

1. **Push to GitHub** (create a public repo, push `main`).
2. **Import to Vercel**: [vercel.com/new](https://vercel.com/new) → "Import Git Repository" → select this repo.
3. Vercel auto-detects Next.js. Click **Deploy** → live at `<project>.vercel.app` in ~60 seconds.
4. **Add custom domain**: Project → Settings → Domains → add `yeddes.com`.
5. **Update DNS** at your registrar with the 2 records Vercel shows (A + CNAME).
6. SSL is automatic. Site is live at `https://yeddes.com` in 5–10 minutes.

## Environment variables

`.env.example` shows the variables you can set in Vercel:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Used in canonical links, sitemap, and OG image. Defaults to `https://yeddes.com`. |

## Project structure

```
src/
├── app/                  # Next.js App Router (layout, page, SEO)
├── components/
│   ├── nav.tsx           # Sticky glass nav with mobile menu + theme toggle
│   ├── footer.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── mobile-menu.tsx
│   ├── sections/         # The 6 page sections
│   └── ui/               # Button, Card, Tag, SectionWrapper, SocialIcon
├── content/
│   ├── data.ts           # ← EDIT THIS
│   └── types.ts          # Strict types — don't edit unless adding fields
└── lib/
    ├── utils.ts          # cn(), date formatters
    └── stack-icons.tsx   # Icon name → lucide component map
```

## Design system

| Token | Dark | Light |
|---|---|---|
| `--color-canvas` | `#0B1220` | `#F8FAFC` |
| `--color-fg` | `#F1F5F9` | `#0F172A` |
| `--color-brand` | `#3B82F6` | `#2563EB` |
| `--color-accent` | `#22D3EE` | `#06B6D4` |
| `--font-sans` | Inter | Inter |
| `--font-mono` | JetBrains Mono | JetBrains Mono |

All tokens live in `src/app/globals.css` under `@theme`. Edit there to rebrand.

## Performance notes

- Static by default (no DB, no API routes).
- Fonts self-hosted via `next/font` (zero CLS).
- Motion tree-shaken to only the components that use it.
- Target: Lighthouse mobile ≥ 95 on all 4 categories.

## License

MIT — do whatever you want with this.
