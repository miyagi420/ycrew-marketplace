# PRD — Yacht Crew Marketplace (Cross-Platform)

**Status:** Draft · **Owner:** founder · **Last updated:** 2026-06-02

A two-sided marketplace that brokers the "handshake" between yacht/maritime employers (owners, captains, charter/management companies) and crew (deckhands, stews, engineers, chefs, skippers, etc.). Crew build verified profiles and apply to jobs; employers post jobs and review/recruit candidates. Full production target: native **iOS + Android** apps (App Store + Google Play) **and** web, premium/luxury UX. Functional peer: ycabin.com (independent implementation — no copied assets/code/brand).

---

## 1. Locked decisions (from grilling session)

| Area | Decision |
|---|---|
| **Build goal** | One real vertical slice end-to-end (depth) + real backend, before breadth |
| **Platform** | Expo (React Native + Expo Router) + react-native-web → iOS, Android, web from one codebase |
| **Backend/DB** | Supabase (Postgres). Existing relational `prisma/schema.prisma` is the source-of-truth data model |
| **Data access** | Supabase-native: client SDK + Row-Level Security (RLS) + Edge Functions (Deno) for privileged logic |
| **Auth** | Supabase Auth — email/password + Google + Apple (Apple required by App Store rule 4.8 once Google present) |
| **UI** | NativeWind + React Native Reusables; Reanimated + Moti for motion; luxury maritime palette (deep navy/charcoal + gold/brass) |
| **i18n** | i18next + expo-localization; launch EN / FR / IT / ES; RTL-ready; strings externalized day one |
| **Payments** | RevenueCat (Apple IAP + Google Play Billing + Stripe via Web Billing). Same price all platforms. Scaffold now, enforce later |
| **Tiers (launch)** | Crew: Free / Pro (€9.99mo·€79yr) / Elite (€29.99mo). Owner: Free / Pro (€99mo). Defer Owner Agency/Enterprise |
| **Pipeline** | EAS Build + Submit + Update (OTA); web → Vercel; CI via GitHub (`miyagi420/ycrew-marketplace`) |
| **Dev tooling** | graphify (codebase graph), /save + /resume, Supabase MCP + Context7 MCP |

**Superseded:** Next.js-web-only, NextAuth, in-app Stripe, Airtable. The 22 existing Next.js mock pages become design reference, not shipped code.

---

## 2. Scope

### First vertical slice (the depth target)
A real, working path on a live Supabase DB, across native + web:

1. **Register** (crew or owner) → real account in Supabase Auth
2. **Login** → real session (email/password to start)
3. **Crew:** build profile (name, role, experience, certs metadata, availability, day-rate)
4. **Owner:** create org + post a job (role, certs required, dates, rate)
5. **Match:** deterministic `calculateMatchScore` runs crew↔job, produces ranked matches with reasons
6. **Apply:** crew applies to a job; owner sees the candidate in their candidates view
7. Paywall + RevenueCat entitlement scaffolding visible but not hard-enforced

### MVP (after slice proven) — plan §16
Profile/CV ingest + cert expiry reminders · AI JD assistant · matches feed + messaging · subscriptions enforced · basic moderation + verification queue · analytics funnel.

### Out of scope (now)
Escrow, e-sign contracts, agencies API, Owner Agency/Enterprise tiers, semantic (pgvector) matching, SMS, push (beyond scaffolding).

---

## 3. Build order

### Phase 0 — Foundation (prereqs, partly external)
- [ ] **Pick original app name** + check App Store / trademark availability (legal — cannot be "YCabin"/"Yacht Cabin")
- [ ] Register **Apple Developer** ($99/yr — start early, identity approval slow) + **Google Play Developer** ($25)
- [ ] Create **Supabase project**; set `SUPABASE_PROJECT_REF` + `SUPABASE_ACCESS_TOKEN` env vars → activates Supabase MCP
- [ ] Convert repo to Expo on new branch; archive Next.js pages under `reference/`; keep `prisma/schema.prisma`, `docs/`, `CLAUDE.md`

### Phase 1 — App skeleton
- [ ] `npx create-expo-app` (Expo Router, TypeScript) in repo
- [ ] NativeWind + React Native Reusables + Reanimated/Moti configured; base theme (navy/gold), typography, spacing tokens
- [ ] i18next + expo-localization; EN base strings + locale switcher; FR/IT/ES stub files
- [ ] react-native-web verified (app runs in browser)

### Phase 2 — Supabase backend
- [ ] Port `prisma/schema.prisma` → Supabase migrations (keep `postgis` + `vector` extensions for later phases)
- [ ] Enable RLS; write policies: crew RW own `crew_profile`; owner RW own `owner_org`/`jobs`; applications visible to job owner + applicant
- [ ] Supabase client in app; typed via generated types
- [ ] Seed script: a few sample crew + jobs for testing the slice

### Phase 3 — Auth
- [ ] Supabase Auth: email/password sign-up/sign-in screens
- [ ] Session persistence (expo-secure-store) + auth context replacing mock `lib/auth.ts`
- [ ] Role on signup (CREW / OWNER) → routes to correct app shell
- [ ] Google + Apple OAuth (deep-link redirect; native Apple sign-in for iOS)

### Phase 4 — Crew + Owner core
- [ ] Crew profile screen → reads/writes `crew_profile` (real data)
- [ ] Certifications add/list (metadata only; file upload later via Supabase Storage)
- [ ] Owner: create org + vessel + post job screens → write `jobs`
- [ ] Role-based navigation (crew vs owner views)

### Phase 5 — Match + Apply
- [ ] Move `lib/matching.ts` into an **Edge Function** `match-crew-to-job` (typed, no `any`); deterministic weights from §9
- [ ] Crew matches feed (ranked, with reasons) · Owner candidates view per job
- [ ] Apply flow → `applications` row; status transitions; owner sees applicant

### Phase 6 — Payments scaffold
- [ ] RevenueCat SDK + products/entitlements (crew_pro, crew_elite, owner_pro)
- [ ] Paywall UI per tier; entitlement check helper (soft gates only for now)
- [ ] Stripe Web Billing for the web build

### Phase 7 — Ship pipeline
- [ ] EAS Build (dev + preview profiles); run on real devices
- [ ] Privacy policy + terms live; GDPR data-export/delete stubs; 18+ gate
- [ ] EAS Submit to TestFlight + Play Internal Testing
- [ ] Vercel deploy for web

---

## 4. Data model
Source of truth: `prisma/schema.prisma` (already rich — User, CrewProfile, OwnerOrg, Vessel, Job, Application, Certification, Availability, Review, Subscription, Verification, Message, AuditLog; enums for Role/JobStatus/ApplicationStatus/ContractType/SubscriptionPlan). Ported to Supabase migrations; RLS layered on top. Subscription state synced from RevenueCat webhooks via Edge Function.

## 5. Legal / compliance checklist
- [ ] Original brand, logo, copy, UI — zero assets/code/text copied from ycabin or others
- [ ] Distinct, trademark-clear app name
- [ ] GDPR: privacy policy, terms, consent, data export + account delete, 24-mo retention
- [ ] 18+ minimum age
- [ ] Encrypted storage + signed short-TTL URLs for ID/KYC/cert documents
- [ ] Store payment rules respected (IAP/Play Billing in-app; Stripe web only)
- [ ] Anti-discrimination + harassment policy; takedown/strike + audit log (moderation phase)

## 6. Open questions (revisit)
- Launch regions + visa-handling depth (Med + Caribbean?)
- KYC/IDV provider (Onfido vs Persona) and when to introduce
- Drop `--read-only` on Supabase MCP once migrations are agent-driven?

## 7. Success criteria
**Slice:** a real user registers, logs in, builds a profile / posts a job, sees matches, and applies — data persisted in Supabase, working on iOS, Android, and web.
**MVP (plan §25):** ≥200 verified crew, ≥50 active owners with a posted job, ≥30 hires in 90 days, median time-to-match ≤5 days.
