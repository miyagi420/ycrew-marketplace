# ADR 0001 — Cross-platform stack: Expo + Supabase

- **Status:** Accepted
- **Date:** 2026-06-02
- **Context doc:** `docs/PRD.md`

## Context

The product target changed from a web-only Next.js app to a **full-production app published on the Apple App Store and Google Play, plus web**, with a luxury UX. The existing codebase was a v0-generated Next.js web shell: ~22 mock pages, a rich but unmigrated `prisma/schema.prisma`, mock auth (plaintext passwords, `getCurrentUser` returns null), a deterministic but unwired `matching.ts`, and only auth/billing API stubs. No database, no migrations, no `.env`.

Two foundational constraints forced a re-platform:

1. **App stores reject wrapped websites / PWAs.** Shipping to both stores requires a real native codebase, not a webview over the Next.js site.
2. **Stores forbid Stripe for in-app digital subscriptions** (must use Apple IAP / Google Play Billing). Stripe is web-only here.

## Decision

- **Client:** Expo (React Native + Expo Router) with react-native-web → one TypeScript codebase for iOS, Android, and web.
- **Backend/DB:** Supabase (Postgres). Keep the relational data model in `prisma/schema.prisma`; port to Supabase migrations.
- **Access:** Supabase-native — client SDK + Row-Level Security + Edge Functions for privileged logic (matching, RevenueCat webhooks, KYC). No separate API server.
- **Auth:** Supabase Auth (email/password + Google + Apple). Replaces NextAuth and the mock `lib/auth.ts`.
- **UI:** NativeWind + React Native Reusables + Reanimated/Moti.
- **Payments:** RevenueCat unifying Apple IAP + Google Play Billing + Stripe (web).

## Consequences

**Positive:** single codebase to all three targets; relational model (and the §9 matching logic) preserved; Supabase bundles Auth + Storage + Realtime + pgvector, covering the AI-matching roadmap without a second datastore; RLS removes a hand-built authz layer.

**Negative / costs:** the 22 Next.js pages are rebuilt in RN primitives (kept only as design reference); team works in React Native, not web React; Supabase + Expo + RevenueCat are new operational surfaces; native release requires paid Apple/Google developer accounts and store review.

**Rejected alternatives:** Next.js + Capacitor (webview undercuts the luxury-native feel); Flutter (discards all existing React/TS); Firebase/Firestore (NoSQL fights the relational matching/search model, no pgvector); Airtable (not a production backend — hard rate/row limits).
