# KWIZ.LIVE website

The marketing site at https://kwiz.live, plus the legal pages Google Play and Google OAuth
verification need (privacy, terms, account deletion, community guidelines, child safety,
contact). Split out of the game repo (`Quizup/landing/`, history kept) on 2026-10-10.

Static HTML, no build step. nginx serves it (`nginx.conf`: relative redirects, a 404 page,
security headers, no-cache HTML).

## Preview locally

```bash
python3 -m http.server 8080      # http://localhost:8080
```

Port 8080 may be taken (Coolify's proxy on the dev box): use 8088, which the local backend also
allows for the waitlist and link previews. The share-link pages (`/c/<token>`, `/i/<code>`) need
nginx's routing, so preview those with the Docker image below (`-p 8088:80`), the game backend on
:3001, and a CSP that allows it (the image's CSP only allows api.kwiz.live).

Or exactly as production serves it:

```bash
docker build -t kwiz-website . && docker run --rm -p 8080:80 kwiz-website
```

## Deploy

Push to `main` → GitHub Actions builds `ghcr.io/asimhsidd/quizup-website:main` (nginx serving
the files) → Coolify pulls it. Secrets `COOLIFY_WEBHOOK` + `COOLIFY_TOKEN` enable the
auto-redeploy. The full runbook is `Quizup/docs/deployment.md`.
