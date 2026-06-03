# Yachtly — Yacht Crew Marketplace

A two-sided marketplace connecting yacht/maritime employers with crew. Crew
build verified profiles and apply to jobs; owners post jobs and review ranked
candidates; both sides chat in realtime. Cross-platform: **iOS, Android, and
web** from one Expo codebase, backed by Supabase.

> **Yachtly** is the app name. Run a trademark + App Store / Play Store name
> check before publishing to confirm it's clear in your markets.

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

## Maps and locations

Set `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` to render Google Maps on web. Restrict
the key to your production domains in Google Cloud. Without the key, the app
uses an offline chart-style fallback.

Location data is stored in Supabase:

- `job_locations`: public coordinates for open crew offers.
- `vessel_positions`: latest vessel positions for owned/open-job vessels.
- `crew_locations`: crew opt-in locations; owners only see shared rows.

Set `EXPO_PUBLIC_USE_MATCH_EDGE_FUNCTIONS=true` in production; local builds use
the client scorer unless you also run the Supabase Edge Function runtime.

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
