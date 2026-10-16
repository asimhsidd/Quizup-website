# CLAUDE.md — KWIZ.LIVE website

The marketing site for KWIZ.LIVE (https://kwiz.live), split out of `/home/asim/Quizup`
(`landing/`). Static HTML, no build. The game is `/home/asim/Quizup`, the admin panel
`/home/asim/Quizup-Operator`.

- **Look: Showdown, same as the game.** Cream halftone ground (`#FFF1D0`), 3px ink
  (`#14142B`) outlines, hard offset shadows, Lilita One + Nunito, Press Start 2P for short caps
  labels. Inline SVG icons, no emoji.
- **The core message is neighbourhood play.** KWIZ's USP is playing the people near you: the
  "Near you" list, the Clans map (topics as landmarks, crown holders) and city clans. Every
  section leads with it; the rest of the game (lifelines, any topic, ranks) supports it. Clans
  are live in Australia first, so say "Starting in Australia". Privacy claims must stay true:
  location is opt-in, others see the city only (never the suburb or coordinates), and both
  hiding and nearby challenges are toggles in Profile → Settings.
- **App screens are real captures** (`img/`, from `scripts/capture-app.mjs` against the game's
  local stack). Recapture when the Clans tab changes; don't hand-draw the map.
- **The logo is `kwiz-logo.svg`** (pink bolt on a yellow tile). Pages inline the same drawing
  (`viewBox="40 40 432 432"`); the game's `LogoIcon.jsx` uses it too. Keep them identical.
- **The game is Android-only and not on Play yet.** No "play in the browser", PWA or
  play.kwiz.live links. CTAs are the `.store-cta` "Coming soon to Google Play" sticker; at
  launch turn it into a link to the Play listing (see the comment in `index.html`).
- Claims about the game (ranks, XP thresholds, lifelines, dock tabs, the deletion flow) must
  match the game. Check `Quizup/backend/services/configService.js` and `Profile.jsx`.
- `index.html` is large (~50 KB). Grep for the section, then read with an offset.
- **Fonts are self-hosted** (`fonts/`, `fonts.css`): the same files the game bundles. No Google
  Fonts link; the CSP only allows `font-src 'self'`.
- **The launch waitlist** form (`#notify` in the CTA) posts to `https://api.kwiz.live/api/waitlist`
  (`Quizup/backend/routes/waitlist.js`; locally `localhost:3001`). The CSP's `connect-src` allows
  that origin. The privacy policy's `#waitlist` item covers it.
- Legal pages (privacy, terms, account deletion, community guidelines, child safety,
  contact) share `legal.css`. Bump "Last updated" when their content changes, and add new
  pages to `sitemap.xml`.
- Deploy: push to `main` → GitHub Actions → GHCR → Coolify. The image copies the whole repo
  (`.dockerignore` keeps plumbing out), so new files ship without touching the Dockerfile.
  Runbook: `Quizup/docs/deployment.md`.
