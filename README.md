# KWIZ.LIVE website

The marketing site at https://kwiz.live. Split out of the game repo (`Quizup/landing/`,
history kept) on 2026-10-10.

A static page: `index.html`, `favicon.png`, `og-image.png`. No build step.

## Preview locally

```bash
python3 -m http.server 8080      # http://localhost:8080
```

## Deploy

Push to `main` → GitHub Actions builds `ghcr.io/asimhsidd/quizup-website:main` (nginx serving
the files) → Coolify pulls it. Secrets `COOLIFY_WEBHOOK` + `COOLIFY_TOKEN` enable the
auto-redeploy. The full runbook is `Quizup/docs/deployment.md`.

Roadmap step 4 (Google OAuth brand verification) adds the privacy policy, the terms and the
account-deletion page here.
