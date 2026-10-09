# CLAUDE.md — KWIZ.LIVE website

The marketing site for KWIZ.LIVE (https://kwiz.live), split out of `/home/asim/Quizup`
(`landing/`). Static HTML, no build. The game is `/home/asim/Quizup`, the admin panel
`/home/asim/Quizup-Operator`.

- Keep the site's own palette (`#08080F` background). The game's `bg-game-bg` rule doesn't
  apply here.
- `index.html` is large (~70 KB). Grep for the section, then read with an offset.
- Deploy: push to `main` → GitHub Actions → GHCR → Coolify. Runbook: `Quizup/docs/deployment.md`.
- Roadmap step 4 adds the privacy policy, terms and account-deletion page here.
