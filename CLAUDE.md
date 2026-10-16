# CLAUDE.md — KWIZ.LIVE website

The marketing site for KWIZ.LIVE (https://kwiz.live), split out of `/home/asim/Quizup`
(`landing/`). Static HTML, no build. The game is `/home/asim/Quizup`, the admin panel
`/home/asim/Quizup-Operator`.

- **Look: Showdown, same as the game.** Cream halftone ground (`#FFF1D0`), 3px ink
  (`#14142B`) outlines, hard offset shadows, Lilita One + Nunito, Press Start 2P for short caps
  labels. Inline SVG icons, no emoji.
- **The logo is `kwiz-logo.svg`** (pink bolt on a yellow tile). Pages inline the same drawing
  (`viewBox="40 40 432 432"`); the game's `LogoIcon.jsx` uses it too. Keep them identical.
- **The game is Android-only and not on Play yet.** No "play in the browser", PWA or
  play.kwiz.live links. CTAs are the `.store-cta` "Coming soon to Google Play" sticker; at
  launch turn it into a link to the Play listing (see the comment in `index.html`).
- Claims about the game (ranks, XP thresholds, lifelines, dock tabs, the deletion flow) must
  match the game. Check `Quizup/backend/services/configService.js` and `Profile.jsx`.
- `index.html` is large (~50 KB). Grep for the section, then read with an offset.
- Legal pages (privacy, terms, account deletion, community guidelines, child safety,
  contact) share `legal.css`. Bump "Last updated" when their content changes, and add new
  pages to `sitemap.xml`.
- Deploy: push to `main` → GitHub Actions → GHCR → Coolify. The image copies the whole repo
  (`.dockerignore` keeps plumbing out), so new files ship without touching the Dockerfile.
  Runbook: `Quizup/docs/deployment.md`.
