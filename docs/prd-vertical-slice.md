## Problem Statement

Yacht/maritime employers (owners, captains, charter and management companies) need vetted, available crew fast, and crew need legitimate, well-matched gigs without spam. Today the connection is fragmented, slow, and manual. We have a product blueprint, a rich data model, and a UI shell — but nothing works end-to-end: auth is mocked (plaintext passwords, no session), no database exists, screens don't read or write real data, and matching is unwired. A founder cannot demo, validate, or ship anything because no single real path exists from "sign up" to "apply to a job."

## Solution

Build one **real vertical slice** end-to-end on a live backend, on the production stack (Expo + Supabase), proving the riskiest mechanics before breadth: a person registers, logs in with a real session, and — depending on role — either builds a crew profile and applies to a job, or creates an org and posts a job; the system computes deterministic matches with human-readable reasons; the employer sees the applicant. Subscription paywalls are scaffolded but not hard-enforced. The slice runs on iOS, Android, and web from a single codebase.

## User Stories

1. As a new user, I want to register with email and password, so that I have a real account.
2. As a registering user, I want to choose whether I am crew or an owner/recruiter, so that the app shows me the correct experience.
3. As a returning user, I want to log in and have my session persist, so that I am not asked to re-authenticate every launch.
4. As a user, I want to log in with Google, so that I can onboard without creating a new password.
5. As an iOS user, I want to sign in with Apple, so that I have a native, private login option.
6. As a logged-in user, I want to be routed to the crew app or the owner app based on my role, so that I only see relevant features.
7. As a crew member, I want to create and edit my profile (name, nationality, languages, primary/secondary roles, experience, boat types, home port), so that employers understand my background.
8. As a crew member, I want to set my availability window and minimum day-rate/monthly rate, so that I am matched to jobs I would actually accept.
9. As a crew member, I want to add my certifications (type, number, issuer, dates), so that I can be matched to jobs that require them.
10. As a crew member, I want to see how complete my profile is, so that I know what to finish to be competitive.
11. As an owner/recruiter, I want to create an organization, so that my vessels and jobs belong to my account.
12. As an owner, I want to add a vessel (name, type, flag state, length), so that jobs reference the right boat.
13. As an owner, I want to post a job (role, contract type, start date, duration, required certs, experience, rate), so that crew can find and apply to it.
14. As an owner, I want my draft jobs hidden until I publish them, so that I control what crew see.
15. As a crew member, I want a ranked feed of jobs that match me, so that I spend time only on relevant roles.
16. As a crew member, I want to see *why* a job matched (role fit, certs covered, experience, availability), so that I trust the ranking.
17. As an owner, I want a ranked list of candidate crew for a job, so that I can shortlist quickly.
18. As a crew member, I want to apply to a job with an optional note and expected rate, so that I can express interest.
19. As a crew member, I want to see the status of my applications (applied, shortlisted, etc.), so that I know where I stand.
20. As an owner, I want to see applicants for each of my jobs, so that I can review and progress them.
21. As an owner, I want to move an application through statuses (shortlist, interview, offer, reject), so that I can manage my pipeline.
22. As a crew member, I should not be able to view another crew member's private profile, so that my data stays private.
23. As an owner, I should only see applicants for jobs my organization owns, so that pipelines stay isolated.
24. As any user, I should only be able to modify data I own, so that the marketplace is trustworthy.
25. As a free crew member, I want to see what Pro and Elite unlock, so that I can decide whether to upgrade.
26. As a free owner, I want to see what Owner Pro unlocks, so that I understand the value of upgrading.
27. As a paying user, I want my purchase to grant the right entitlement across app and web, so that I get what I paid for everywhere.
28. As a user in France, Italy, or Spain, I want the app in my language, so that it is comfortable to use.
29. As a user, I want the app to feel premium and polished (smooth motion, refined visuals), so that it matches the luxury maritime market.
30. As a user, I want the same experience whether I open the iOS app, Android app, or website, so that I can switch devices freely.
31. As a prospective user, I must confirm I am 18 or older and accept the privacy policy and terms, so that the service is compliant.
32. As an EU user, I want to export or delete my account data, so that my privacy rights are respected.

## Implementation Decisions

- **Platform:** Single Expo (React Native + Expo Router) codebase targeting iOS, Android, and web (react-native-web). Supersedes the Next.js-web-only shell; existing mock pages are archived as design reference only. See ADR 0001.
- **Backend:** Supabase (Postgres). The relational data model in `prisma/schema.prisma` is the source of truth and is ported to Supabase migrations. PostGIS and pgvector extensions retained for later phases (geo, semantic matching) but unused in this slice.
- **Data access:** Supabase-native — client SDK plus Row-Level Security; no bespoke API server. Privileged/secret logic runs in Edge Functions.
- **Authorization:** RLS policies enforce ownership: crew read/write own `crew_profile`; owners read/write own `owner_org`, `vessels`, `jobs`; an `application` is visible to the applicant and to the owner of its job; nobody can mutate rows they do not own.
- **Auth:** Supabase Auth. Email/password to start, then Google and Apple OAuth (Apple required by App Store guideline 4.8 once Google is offered). The mock `lib/auth.ts` and custom login/register routes are removed. Role (CREW/OWNER) captured at signup drives navigation.
- **Matching:** The deterministic scorer from `lib/matching.ts` is moved into an Edge Function `match-crew-to-job`, strongly typed (no `any`). Contract: input = crew profile + job + optional weights; output = `{ score: number, reasons: string[] }`. Default weights per blueprint §9 (role .25, certs .20, experience .15, boat .10, availability .10, location .07, language .05, rating .03, recency .03, boost .02). Semantic/pgvector re-ranking is deferred.
- **Application state:** `application.status` transitions APPLIED → SHORTLISTED → INTERVIEW → OFFER → {ACCEPTED | REJECTED}, plus WITHDRAWN, matching the `ApplicationStatus` enum already in the schema.
- **Payments:** RevenueCat is the single entitlement layer (Apple IAP + Google Play Billing in-app; Stripe via Web Billing on web). Launch tiers: Crew Free/Pro/Elite, Owner Free/Pro; Owner Agency/Enterprise deferred. Same price on all platforms. This slice scaffolds SDK, products, paywall UI, and an entitlement-check helper; gates are soft (visible, not enforced). Subscription state will later sync from RevenueCat webhooks via an Edge Function.
- **UI/i18n:** NativeWind + React Native Reusables; Reanimated/Moti for motion; luxury maritime palette (deep navy/charcoal with gold/brass accents). i18next + expo-localization; launch languages EN/FR/IT/ES; all user-facing strings externalized from the start.
- **Pipeline:** EAS Build/Submit/Update for native; Vercel for web; CI via the existing GitHub repo.

## Testing Decisions

A good test asserts **external behavior at the highest available seam** and survives refactors — it does not assert implementation details, internal call order, or component structure. Tests prefer real infrastructure (a Supabase test database) over heavy mocking, because the riskiest behavior here is authorization and data flow, not pure functions in isolation.

- **Matching (primary seam):** Test `match-crew-to-job` purely through its input→output contract: given crew + job + weights, assert the score and the set of `reasons`. Cover role match/mismatch, full vs partial cert coverage, experience thresholds, availability overlap, and weight changes. This is the existing `calculateMatchScore` seam, lifted to the function boundary — no UI involved.
- **Authorization (RLS):** Test through the Supabase client acting as different authenticated roles. Assert behavior: a crew user cannot read another crew profile; an owner cannot read applicants for a job they do not own; a user cannot update rows they do not own; an applicant and the job's owner can both read that application. Run against a seeded test database.
- **Auth + routing:** Test at the auth-client boundary — register, obtain a session, and assert role-based entry — not screen internals.
- **End-to-end slice:** Maestro (native) and Playwright (web) drive the full path: register → build profile / post job → view ranked matches → apply → owner sees applicant.
- **Prior art:** There are currently no tests in the repo; these establish the patterns. The matching unit/contract tests and the RLS integration tests become the reference for future features.

## Out of Scope

- Real-time messaging/chat between crew and owners (scaffolded later).
- CV parsing / AI features (JD assistant, match explanations beyond the deterministic reasons, salary benchmarking, risk heuristics).
- Semantic/vector matching (pgvector) and PostGIS geo matching.
- Document/file uploads to Supabase Storage (certifications are metadata-only in the slice).
- KYC/IDV verification, document OCR, expiry reminders, moderation/abuse tooling.
- Hard enforcement of subscription limits; escrow; e-sign contracts.
- Owner Agency/Enterprise tiers, multi-seat orgs, agencies API.
- Push notifications, SMS, email beyond what auth requires.
- Admin dashboard and analytics funnels.

## Further Notes

- **External prerequisites (founder-owned, partly blocking release):** an original, trademark-clear app name (not "YCabin"); Apple Developer ($99/yr, start early due to identity review) and Google Play ($25) accounts; a Supabase project with access-token env vars set (also activates the Supabase MCP server).
- **Legal/compliance baked in from day one:** original brand/assets/copy (no reproduction of competitor IP); GDPR privacy policy, terms, data export/delete; 18+ gate; encrypted storage and short-TTL signed URLs for ID/cert documents when uploads land; store payment rules (IAP/Play in-app, Stripe web only).
- **Reference, not source of truth:** `development-plan.md` (full blueprint), `docs/PRD.md` (decision log + phased build order), ADR 0001 (stack pivot rationale).
- **Success for this slice:** a real user completes register → profile/post-job → matches → apply with data persisted in Supabase, working on iOS, Android, and web.
