# YachtCrew — Yacht Crew Marketplace

A two-sided marketplace connecting yacht/maritime employers with crew. Crew
build verified profiles and apply to jobs; owners post jobs and review ranked
candidates; both sides chat in realtime. Cross-platform: **iOS, Android, and
web** from one Expo codebase, backed by Supabase.

> `YachtCrew` is a working title — pick a trademark-clear brand before store
> submission.

## Stack

- **App**: Expo (React Native + Expo Router), NativeWind, i18n (EN/FR/IT/ES)
- **Backend**: Supabase (Postgres + RLS, Auth, Realtime, Edge Functions)
- **Matching**: deterministic scorer in a Supabase Edge Function (+ client fallback)
- **Payments** (scaffolded): RevenueCat — Apple IAP / Google Play / Stripe web
- **Tests**: Node contract tests + Playwright E2E, run in CI on every PR

## Quick start (local)

Prerequisites: Node 20+, Docker Desktop (for local Supabase).

```bash
npm install
npx supabase start          # local Postgres + Auth + Storage + Realtime
npm run seed                # demo data + 11 RLS assertions
npm run web                 # open the app (http://localhost:8081)
```

Demo logins (password `Passw0rd!`): `crew@demo.test`, `owner@demo.test`.

Run on a device: `npm run ios` / `npm run android` (Expo).

## Scripts

| Script | Does |
|---|---|
| `npm run web` / `ios` / `android` | Run the app |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Node contract tests (matching) |
| `npm run e2e` | Playwright end-to-end (needs `dist/` + local Supabase) |
| `npm run db:start` / `db:stop` / `db:reset` | Local Supabase stack |
| `npm run seed` | Seed demo data + RLS checks |
| `npm run web:build` | Export the web build to `dist/` |
| `npm run db:push` / `functions:deploy` | Push schema / deploy edge functions to cloud |
| `npm run build:android` / `build:ios` | EAS native builds |

## Deploying / trying it beyond local

See **[docs/DEPLOY.md](docs/DEPLOY.md)** — a step-by-step runbook to deploy with
free accounts: cloud Supabase → public web URL (Vercel) → Android preview APK
(EAS). iOS and the app stores come later (paid developer accounts).

## Project docs

- [docs/PRD.md](docs/PRD.md) — product decisions + build order
- [docs/prd-vertical-slice.md](docs/prd-vertical-slice.md) — the slice PRD (issue #1)
- [docs/adr/0001-cross-platform-expo-supabase.md](docs/adr/0001-cross-platform-expo-supabase.md) — stack decision
- [development-plan.md](development-plan.md) — full product blueprint
- `reference/legacy-next/` — the original Next.js mockup, kept as design reference
