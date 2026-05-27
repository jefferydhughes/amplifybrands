# Amplify Brands

The marketing site, the brand it runs on, and the strategy we sell from. One repo, three jobs:

1. **The site** — static HTML/CSS/JS, no build step, no dependencies. Ships to Vercel as-is.
2. **The brand** — how Amplify sounds and looks. The source of truth for every word and pixel.
3. **The strategy** — the playbook we mine for offers and marketing. All of it written in the brand voice.

> **Tagline:** Less busywork. More business.
> **Live:** https://amplifybrands.io
> **Repo:** https://github.com/jefferydhughes/amplifybrands

---

## The map

```
amplifybrands/
├── README.md            # You are here. Start point for the whole repo.
│
│  ── THE BRAND (source of truth — read before you write or design) ──
├── brandvoice.md        # How we sound. Governs every word, everywhere.
├── design.md            # How we look. Color, type, layout, motion.
│
│  ── THE STRATEGY (what we sell, and how) ──
├── strategy/
│   └── AI-Playbook.md   # Master playbook. Source for offers & marketing concepts.
│
│  ── THE SITE (deploys to Vercel from this root) ──
├── index.html           # The website. HTML + CSS + JS, all inline, one file.
├── site.webmanifest     # PWA manifest (name, theme color, app icons).
├── vercel.json          # Static config: clean URLs + security headers.
├── assets/              # Favicons, app icons, OG image. Served at /assets/*.
│
│  ── REFERENCE & MEDIA ──
├── docs/
│   └── design-system.html   # Live style guide built from design.md. Open it before visual edits.
├── intro-movie/         # The 85s kinetic promo film + renders, QA shots, build scripts.
│
│  ── TOOLING ──
├── .agents/             # huashu-design skill (used to build the intro film).
├── skills-lock.json     # Pins the skill version.
└── .gitignore
```

### The three documents that matter most

- **`brandvoice.md`** — the voice. Blunt, sharp, funny, anti-corporate. It lists the words we use (*useful, practical, systems, automate, bottlenecks*) and the words that get you shot (*synergy, disruptive, transformative, paradigm*). **Every word that ships — site copy, social posts, offers, emails — follows this file.** No exceptions.
- **`design.md`** — the look. Near-black `#0B0B0B`, soft white `#F5F5F5`, acid-green `#A3FF12` accent, violet `#6B5BFF` for gradients only. Type, layout, motion, imagery rules. The HTML in `docs/design-system.html` is the live, copy-pasteable version of this.
- **`strategy/AI-Playbook.md`** — the business engine. Positioning, marketing, sales, fulfillment, hiring, expansion. **This is the raw material we turn into offers and marketing concepts.** When you pull from it, the output gets rewritten in `brandvoice.md` — the playbook is strategy, not voice.

> **The one rule:** Strategy comes from the playbook. Voice comes from `brandvoice.md`. Look comes from `design.md`. Don't mix them up — a great offer in the wrong voice is off-brand.

---

## Preview the site locally

Just open `index.html` in a browser — no server needed. If you'd rather serve it:

```bash
# Python
python3 -m http.server 8000   # then visit http://localhost:8000

# or Node
npx serve .
```

---

## Deploy to Vercel

This is a static site — **no framework, no build step** — so setup is short.

1. Go to **vercel.com/new** and **Import** the `jefferydhughes/amplifybrands` repo.
2. **Framework Preset:** **Other**.
3. **Build Command:** leave empty (override off).
4. **Output Directory:** leave default — Vercel serves the repo root, where `index.html` lives.
5. **Deploy.** You get a `*.vercel.app` URL in under a minute.

Every push to `main` auto-deploys to production. Pull requests get their own preview URLs.

> **Why assets live at `/assets/`:** `index.html` and `site.webmanifest` reference icons and the OG image by absolute path (`/assets/og-image.png`, etc.). Vercel serves the repo root, so those paths resolve. If you move a file out of `assets/`, update the reference in both files or you'll get broken icons and dead social previews.

---

## Point the custom domain

1. In the Vercel project: **Settings → Domains → Add**, enter `amplifybrands.io`.
2. Vercel shows the exact DNS records. Standard values:

   | Record  | Name / Host | Value |
   |---------|-------------|-------|
   | `A`     | `@` (apex)  | `76.76.21.21` |
   | `CNAME` | `www`       | `cname.vercel-dns.com` |

   **Use whatever Vercel displays** — if its values differ from the table, Vercel is right (these change).
3. Add the records at your registrar's DNS settings.
4. Wait for propagation (usually minutes, up to ~24–48h). Vercel provisions HTTPS automatically once DNS resolves.
5. Set your preferred primary (apex vs `www`) in Vercel; it 301-redirects the other.

**Tip:** to let Vercel manage DNS end-to-end, point your domain's nameservers at Vercel's (shown in the dashboard) instead of adding individual records.

---

## Site status — what's live, what's a placeholder

The required wiring is **done**. What's left is real content swaps.

**Done:**
- ✅ **Contact form** — `#bookForm` posts to Formspree (`xzdwjbbo` → delivers to jeff@amplifybrands.io). Live and working.
- ✅ **Favicons + app icons** — full set in `assets/`, wired in `<head>` and `site.webmanifest`.
- ✅ **Social / OG meta** — `og:title`, `og:description`, `og:image` set; preview image at `assets/og-image.png`.
- ✅ **Canonical** — set to `https://amplifybrands.io/`.

**Swap when you have the goods:**
- **Stats** (`#results`): `10+ hrs` and `30 days` come from the offer copy — replace with real client numbers when you have them. The `0 decks` line is intentional brand humor; keep or cut.
- **Proof:** the social-proof bar uses claims, not logos. Add client logos when you've got them.

---

## Editing the site without going off-brand

Open **`docs/design-system.html`** for the full visual system, then keep these in mind:

- **Tokens** live in the `:root{}` block at the top. Change a value once, it cascades. The design system's Handoff section has a copyable `tokens.css`.
- **Accent discipline:** one lime (primary) action per viewport. If two things are lime, nothing is. Violet is for gradients/hover — **never a CTA**.
- **Type:** Space Grotesk (headings) + Inter (body), from Google Fonts. Swap to Satoshi / Neue Montreal later by changing two variables.
- **Accessibility:** `#5E5E5E` fails WCAG AA on near-black, so it's for borders/disabled only. Body secondary text uses the accessible `#A1A1A1`. Don't move body text back to `#5E5E5E`.
- **Motion:** fast, subtle, never gimmicky. Every effect has a `prefers-reduced-motion` fallback — keep it that way.

### Voice guardrails (the short version — full rules in `brandvoice.md`)
- **Use:** useful, practical, systems, automate, bottlenecks, implementation, chaos. Short, punchy, honest, a little funny.
- **Never ship:** synergy, disruptive, transformative, paradigm, ecosystem, innovation, next-generation.
- Controlled profanity is on-brand — a scalpel, not a fire hose.

---

## Stack

Plain HTML + CSS + vanilla JS. No framework, no bundler, no `node_modules`. That's deliberate: it loads instantly, it's trivial to host, and there's nothing to break on deploy.
</content>
</invoke>
