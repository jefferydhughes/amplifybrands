# Amplify Brands — Website

The Amplify Brands marketing site plus the design system it's built on. Static HTML/CSS/JS, no build step, no dependencies. Ships to Vercel as-is.

> **Tagline:** Less busywork. More business.
> **Repo:** https://github.com/jefferydhughes/amplifybrands

---

## What's in here

```
amplify-brands-site/
├── index.html              # The website (single file — HTML + CSS + JS inline)
├── vercel.json             # Static config: clean URLs + basic security headers
├── .gitignore
└── docs/
    └── design-system.html  # Live style guide: tokens, components, motion, voice
```

Two files do the work:

- **`index.html`** — the live site. Hero, "Dear business owner" letter, What We Do, Why Us, Results, the AI Implementation Sprint offer, and the contact CTA. Everything is inline, so it runs by opening the file.
- **`docs/design-system.html`** — the source of truth for color, type, spacing, components, motion, imagery, and voice. Open it before making any visual change so edits stay on-brand. (Not linked from the site; it's a reference doc.)

---

## Preview locally

Just open `index.html` in a browser — no server needed. If you'd rather serve it:

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000

# or Node
npx serve .
```

---

## Push to GitHub

From inside the `amplify-brands-site` folder:

```bash
git init
git add .
git commit -m "Amplify Brands site + design system"
git branch -M main
git remote add origin https://github.com/jefferydhughes/amplifybrands.git
git push -u origin main
```

If you already initialized the repo on GitHub with a README/license, sync first:

```bash
git pull --rebase origin main
git push -u origin main
```

---

## Deploy to Vercel (new project)

This is a static site — there is **no framework and no build step**, so the setup is short.

1. Go to **vercel.com/new** and **Import** the `jefferydhughes/amplifybrands` repo.
2. **Framework Preset:** select **Other**.
3. **Build Command:** leave empty (or toggle the override off).
4. **Output Directory:** leave default — Vercel serves the repo root, where `index.html` lives.
5. Click **Deploy.** You'll get a `*.vercel.app` URL in under a minute.

Every push to `main` auto-deploys to production. Pull requests get their own preview URLs.

---

## Point your custom domain

1. In the Vercel project: **Settings → Domains → Add**, and enter your domain (e.g. `amplifybrands.com`).
2. Vercel shows the exact DNS records to add. Standard values are:

   | Record | Name / Host | Value |
   |--------|-------------|-------|
   | `A`    | `@` (apex)  | `76.76.21.21` |
   | `CNAME`| `www`       | `cname.vercel-dns.com` |

   **Use whatever Vercel displays** — if its values differ from the table above, Vercel is right (these can change).
3. Add the records at your domain registrar's DNS settings.
4. Wait for propagation (usually minutes, up to ~24–48h). Vercel provisions HTTPS/SSL automatically once DNS resolves.
5. Set your preferred primary (apex vs `www`) in Vercel; it 301-redirects the other.

**Tip:** if you want Vercel to manage DNS end-to-end, change your domain's nameservers to Vercel's (shown in the dashboard) instead of adding individual records.

---

## ⚠️ Before you call it live — one required wire-up + a few swaps

### 1. Wire the contact form (required)
Right now the "Book An AI Breakdown" form validates the email and shows a success message, but **it doesn't send anywhere yet.** Look for this marker in `index.html`:

```js
/* TODO(handoff): POST email to your CRM / booking backend here. */
```

Two easy paths:

- **No backend (fastest):** use a form service like Formspree/Basin/Getform. Give the `<form id="bookForm">` an `action="https://formspree.io/f/XXXX" method="POST"`, add `name="email"` to the input, and either let it submit natively or `fetch()` to that endpoint at the TODO line.
- **Booking link instead of capture:** if you'd rather send people straight to Calendly/Cal.com, swap the form for an anchor button pointing at your booking URL.

### 2. Swap placeholder content
- **Stats** (`#results`): `10+ hrs` and `30 days` are pulled from the offer copy — replace with real client numbers when you have them. The `0 decks` line is intentional brand humor; keep or cut.
- **Logos / proof:** the social-proof bar uses claims, not logos. Add client logos when available.
- **Favicon:** add a `favicon.ico` / SVG and a `<link rel="icon">` in `<head>`.
- **Social/OG meta:** add `og:title`, `og:description`, and an `og:image` for link previews.
- **Canonical / domain:** once the domain is set, add `<link rel="canonical">` and update meta as needed.

---

## Design system reference

Open **`docs/design-system.html`** for the full system. Quick rules so edits stay on-brand:

- **Tokens** live in the `:root{}` block at the top of both files. Change a value once and it cascades. The design system's Handoff section has a copyable `tokens.css`.
- **Palette:** near-black `#0B0B0B` background, soft white `#F5F5F5` text, acid green `#A3FF12` accent. Violet `#6B5BFF` is for gradients/hover only — never a CTA.
- **Accent discipline:** one lime (primary) action per viewport. If two things are lime, nothing is.
- **Type:** Space Grotesk (headings) + Inter (body), loaded from Google Fonts. Swap to Satoshi / Neue Montreal later by changing two variables.
- **Accessibility note:** `#5E5E5E` (the notes' original "secondary text") fails WCAG AA on near-black, so it's reassigned to borders/disabled here; `#A1A1A1` is the accessible secondary-text color. Don't move body text back to `#5E5E5E`.
- **Motion:** fast, subtle, never gimmicky. Every effect has a `prefers-reduced-motion` fallback — keep it that way.

### Brand voice — quick guardrails
- **Use:** useful, practical, systems, automate, bottlenecks, implementation, chaos. Short, punchy, honest, a little funny.
- **Never ship:** synergy, disruptive, transformative, paradigm, ecosystem, innovation, next-generation.
- Controlled profanity is on-brand — a scalpel, not a fire hose.

---

## Stack

Plain HTML + CSS + vanilla JS. No framework, no bundler, no `node_modules`. That's deliberate: it loads instantly, it's trivial to host, and there's nothing to break on deploy.
