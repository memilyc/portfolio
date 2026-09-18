# Portfolio Project Memory

This file captures repo-local context for future Codex sessions working in
`/Users/chang/Documents/repos/portfolio`.

## Project Identity

- Personal portfolio for M. Emily Chang, presented as both a reader-friendly
  portfolio and an interactive terminal.
- Current public URL metadata points to `https://memilyc.github.io/portfolio/`.
- The site positions Emily as a Senior Support Engineer with enterprise SaaS,
  fintech, DevSecOps, incident response, customer support, and tooling
  experience.

## Architecture

- Frontend is a single static file: `index.html`.
- No build step and no frontend package manager are currently required.
- Styling is plain CSS in `index.html` using CSS variables and themes.
- JavaScript is vanilla ES6+ in `index.html`; Supabase JS is loaded from a CDN.
- Assets expected by the app/docs include:
  - `assets/em.png`
  - `assets/em.ico`
  - `assets/preview-resume.png`
- Backend uses Supabase PostgreSQL, RLS, and Deno Edge Functions under
  `supabase/functions/`.
- Shared function helpers live in `supabase/functions/_shared/util.ts`.
- Database migrations live under `supabase/migrations/` and should be applied in
  filename order.

## Core User-Facing Features

- Reader view is the default first screen.
- Terminal view provides command history, autocomplete/fuzzy matching, mock Linux
  commands, and a mock filesystem rooted around `/home/emily/portfolio`.
- Themes include dark, light, brown, and a purple theme in CSS. README currently
  documents dark/light/brown and the `?theme=brown` URL path.
- Interactive features include:
  - Adventure mode terminal tutorial.
  - Supabase-backed trivia quiz with difficulty modes.
  - Timed Easter egg hunt with server-side scoring.
  - Leaderboard filters.
  - Guestbook with moderation/spam controls.
  - Testimonials carousel in reader and terminal views.
  - Privacy-friendly analytics and opt-out.

## Supabase Notes

- Edge functions documented in README:
  - `start-quiz`
  - `submit-quiz`
  - `post-guestbook`
  - `track-page-view`
  - `start-egg-hunt`
  - `register-egg`
  - `submit-egg-hunt`
- Deploy functions with `--no-verify-jwt` unless the architecture changes.
- `CONFIG.supabase` in `index.html` stores the Supabase URL and anon key.
- Service-role logic should stay server-side inside Edge Functions.
- Shared CORS allows all origins and common Supabase/client headers.
- `clientIp()` uses `x-forwarded-for`, then `x-real-ip`, then `unknown`.
- IP hashes use SHA-256 in Edge Functions.
- Guestbook nickname validation is currently `^[a-zA-Z0-9 _-]{3,20}$`.
- Guestbook moderation includes profanity filtering, link redaction, honeypot,
  rate limiting, and a `hidden` soft-hide column.

## Privacy And Security Expectations

- Analytics should remain cookie-free and use only localStorage for opt-out.
- Do not add third-party analytics unless explicitly requested.
- Preserve the footer privacy notice and user opt-out mechanism.
- Public visitors should only be able to insert analytics data, not read it.
- Continue escaping user-supplied and database-sourced content before rendering.
- Quiz sessions and egg hunt scoring should remain server-validated to avoid
  client-side score spoofing.

## Development Notes

- Because the frontend is a static single HTML file, validate JavaScript inside
  `index.html` carefully after edits. Do not assume `node --check index.html`
  is meaningful.
- A simple local preview can use Python's static server from the repo root, for
  example `python3 -m http.server 8010 --bind 127.0.0.1`.
- Keep changes scoped: this repo intentionally avoids a build pipeline.
- Before relying on README claims, check `index.html` because the single file is
  the implementation source of truth.

## Current Snapshot

- `git status --short` was clean before this file was added.
- Created on 2026-09-15 from the current repo contents.
