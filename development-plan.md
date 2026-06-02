Yacht Crew Marketplace – Full Blueprint (MVP →

V1)

1\) Product Thesis

Problem: Owners and captains need vetted crew fast; crew need verified gigs without spam. Current tools

are fragmented, slow, and manual.

Solution: A two‑sided marketplace with verified profiles, AI‑assisted matching, compliance‑aware contracts,

and tiered subscriptions.

North Star: Time from job post → accepted hire. Target ≤ 72 hours for common roles.

Primary KPIs: - Time‑to‑match (median and p90) - Fill rate within 7 days - Qualified applicants per post

(QAP) - Activation rate (crew profile ≥80% complete + 3 verified docs) - MRR, churn, and LTV by cohort

2\) Target Segments \& Jobs‑To‑Be‑Done

Demand (employers): - Private yacht owners and family offices - Captains and first officers on superyachts -

Charter companies and management agencies

Supply (talent): - Deckhands, stews, engineers, chefs, skippers for sailboats, bosuns, pursers - Seasonal

crew and delivery skippers

JTBD: - Owners: “Find compliant, available crew that can embark on date X with the right tickets.” - Crew:

“Find legitimate, well‑paid roles that match my ticketing, vessel type, and itinerary.”

3\) Business Model \& Pricing (opinionated)

Crew tiers: - Free: Profile, 5 applications/month, basic messaging. - Pro €9.99/mo or €79/yr: Unlimited

apply, AI CV parser, calendar, cert reminders, priority in search. - Elite €29.99/mo: Document verification

badge, reference checks, boosted ranking, interview scheduling concierge.

Owner tiers: - Free: 1 live job at a time, up to 20 AI‑recommended matches. - Pro €99/mo: Unlimited jobs,

full messaging, bulk invites, shortlists, contract templates. - Agency/Enterprise €299/mo: Multi‑vessel org,

ATS import, team seats, API, priority support.

Add‑ons: - Background/ID verification at cost+margin. - Featured jobs €49/14 days. - Escrow for day‑rates

(optional, Stripe Connect).

1

4\) Compliance \& Risk

Certs: STCW, ENG1, CoC/CoE, flag‑state docs, visas (Schengen/B1/B2), ML5 (UK), yacht rating, food

safety for chefs.

Standards: MLC 2006, SOLAS basics, GDPR for EU users, age ≥18.

Verification: KYC/IDV (Onfido/Persona), document OCR + expiry tracking, manual spot checks for

Elite.

Policies: Anti‑discrimination, wage transparency optional but encouraged, harassment

zero‑tolerance.

Moderation: Takedown workflow, strike system, audit log.

5\) System Architecture (MVP opinionated stack)

Frontend: Next.js 14 (App Router), React Server Components, Vercel deploy.

Backend: Next.js API routes + Server Actions; background jobs with Inngest or Trigger.dev.

Data: Postgres (Neon/Supabase). PostGIS for geo. pgvector for semantic search.

ORM: Prisma.

Auth: NextAuth (email/password + OAuth). RBAC: crew, owner, agency, admin.

Storage: S3/Supabase Storage for CVs, certs, contracts.

Search: Meilisearch/Algolia for keyword; pgvector for AI similarity.

Messaging: Pusher/Ably/Supabase Realtime.

Payments: Stripe Subscriptions + Stripe Tax; optional Stripe Connect for escrow.

Notifications: Resend (email), Twilio (SMS), FCM/Web Push.

Observability: Sentry + PostHog.

Infra IaC: Minimal. Vercel + managed DB. Cron via Inngest.

6\) Data Model (core tables)

users (id, email, hash, role, status)

•

2

crew\_profiles (user\_id FK, name, nationality, languages\[], homeport, willingness\_to\_travel, min\_day\_rate,

min\_monthly, experience\_months, primary\_role, secondary\_roles\[], boat\_types\[], boat\_length\_min,

boat\_length\_max, availability\_start, availability\_end, bio, photo\_url)

owner\_orgs (id, name, type: owner|agency, billing\_account\_id)

vessels (id, owner\_org\_id, name, type, flag\_state, length\_m, build\_year, homeport, mmsi, notes)

certifications (id, crew\_user\_id, type, number, issuer, issue\_date, expiry\_date, doc\_url, verified:boolean)

jobs (id, owner\_org\_id, vessel\_id, title, role, contract\_type: day|seasonal|perm, start\_date, duration\_days,

itinerary\_geojson, requires\_cert\_types\[], min\_exp\_months, day\_rate, monthly\_rate, currency,

accommodation, posted\_at, status)

applications (id, job\_id, crew\_user\_id, status: applied|shortlisted|interview|offer|rejected|withdrawn,

cover\_text, expected\_rate, created\_at)

matches (job\_id, crew\_user\_id, score\_float, reasons\_json, created\_at)

messages (thread\_id, sender\_id, receiver\_id, body, sent\_at, read\_at)

availability (crew\_user\_id, start, end, location\_point, notes)

reviews (id, reviewer\_user\_id, subject\_user\_id, role, rating\_int, text, voyage\_start, voyage\_end)

subscriptions (user\_id/org\_id, plan, status, renewal\_date, stripe\_sub\_id)

verifications (user\_id, kyc\_status, last\_reviewed\_at)

attachments (id, owner\_id, type, url, meta\_json)

audit\_logs (id, actor\_id, action, entity, entity\_id, diff\_json, at)

7\) JSON Schemas (selected)

CrewProfile

{

"$schema": "https://json-schema.org/draft/2020-12/schema",

"type": "object",

"required": \["userId", "name", "primaryRole"],

"properties": {

"userId": {"type": "string", "format": "uuid"},

"name": {"type": "string"},

3

"nationality": {"type": "string"},

"languages": {"type": "array", "items": {"type": "string"}},

"homeport": {"type": "string"},

"primaryRole": {"type": "string", "enum": \["Captain","First

Officer","Engineer","Chef","Deckhand","Stew","Bosun","Skipper","Purser"]},

"secondaryRoles": {"type": "array", "items": {"type": "string"}},

"experienceMonths": {"type": "integer", "minimum": 0},

"boatTypes": {"type": "array", "items": {"type": "string"}},

"boatLengthRange": {"type": "object", "properties": {"min": {"type":

"integer"}, "max": {"type": "integer"}}},

"availability": {"type": "object", "properties": {"start": {"type":

"string", "format": "date"}, "end": {"type": "string", "format": "date"}}},

"comp": {"type": "object", "properties": {"minDayRate": {"type": "number"},

"minMonthly": {"type": "number"}, "currency": {"type": "string"}}}

}

}

JobPosting

{

"type": "object",

"required": \["ownerOrgId","role","startDate"],

"properties": {

"ownerOrgId": {"type": "string", "format": "uuid"},

"vesselId": {"type": "string", "format": "uuid"},

"role": {"type": "string"},

"contractType": {"type": "string", "enum": \["day","seasonal","perm"]},

"startDate": {"type": "string", "format": "date"},

"durationDays": {"type": "integer"},

"requiresCertTypes": {"type": "array", "items": {"type": "string"}},

"minExpMonths": {"type": "integer"},

"rates": {"type": "object", "properties": {"day": {"type": "number"},

"monthly": {"type": "number"}, "currency": {"type": "string"}}},

"itinerary": {"type": "string"}

}

}

8\) API Surface (MVP)

Auth - POST /api/auth/register - POST /api/auth/login - POST /api/auth/verify‑kyc (admin‑guarded)

Crew - GET /api/crew/me - PUT /api/crew/me - POST /api/crew/certs - GET /api/crew/matches?limit=20

4

Owners/Jobs - POST /api/orgs - POST /api/jobs - GET /api/jobs/:id - GET /api/jobs?status=open - POST /api/

jobs/:id/invite/:crewId

Applications - POST /api/jobs/:id/apply - PATCH /api/applications/:id (status)

Messaging - POST /api/threads - POST /api/messages - GET /api/threads/:id

Payments - POST /api/billing/checkout‑session - POST /api/billing/webhook (Stripe)

Search - GET /api/search/crew?q=engineer+stcw - GET /api/search/jobs?q=chef+60m

9\) Matching Logic (deterministic + vector)

Score = W1 role match + W2 cert coverage + W3 experience + W4 boat type/length + W5 availability overlap

\+ W6 location/visa + W7 language + W8 rating + W9 recency + W10 subscription boost

Default weights (tune per role): - Role 0.25 - Certs 0.20 - Experience 0.15 - Boat type/length 0.10 -

Availability 0.10 - Location/visa 0.07 - Language 0.05 - Rating 0.03 - Recency 0.03 - Boost 0.02

Semantic layer: embed job + profile summaries → pgvector. Retrieve top‑K, then re‑rank with deterministic

score.

10\) UX Flows (MVP screens)

Public: Landing, Pricing, Role catalogs, Blog, Legal, Login/Register.

Crew app: Onboarding wizard → import CV → AI parse → fix fields → upload certs → set availability \&

day‑rate → verify → matches feed → apply → chat → contract.

Owner app: Create org + vessel → post job → AI JD assistant → view matches → shortlist → schedule

interviews → offer → contract template → archive.

Admin: User review, verification queue, abuse reports, refunds.

11\) Next.js App Skeleton

/app

/(public)

page.tsx

pricing/page.tsx

legal/(privacy|terms)/page.tsx

5

/(auth)

sign-in/page.tsx

sign-up/page.tsx

/(crew)

dashboard/page.tsx

profile/page.tsx

matches/page.tsx

applications/page.tsx

messages/\[threadId]/page.tsx

/(owner)

orgs/\[orgId]/page.tsx

vessels/\[vesselId]/page.tsx

jobs/new/page.tsx

jobs/\[jobId]/(view|candidates|messages)/page.tsx

/api/\* (route handlers)

/lib (db, auth, payments, search)

/components (forms, tables, cards, uploaders)

/styles, /hooks, /utils

12\) Prisma Schema (excerpt)

model User {

id String @id @default(uuid())

email String @unique

passwordHash String

role Role

status String @default("active")

createdAt DateTime @default(now())

CrewProfile CrewProfile?

Orgs OwnerOrg\[]

}

enum Role { CREW OWNER AGENCY ADMIN }

model CrewProfile {

userId String @id

user User @relation(fields: \[userId], references: \[id])

name String

primaryRole String

experienceMonths Int

languages String\[]

minDayRate Float?

minMonthly Float?

availabilityStart DateTime?

6

availabilityEnd DateTime?

Certifications Certification\[]

}

model OwnerOrg {

id String @id @default(uuid())

name String

type String // owner|agency

users User\[]

Jobs Job\[]

}

model Job {

id String @id @default(uuid())

ownerOrgId String

ownerOrg OwnerOrg @relation(fields: \[ownerOrgId], references: \[id])

role String

contractType String

startDate DateTime

durationDays Int?

minExpMonths Int?

dayRate Float?

monthlyRate Float?

currency String?

createdAt DateTime @default(now())

Applications Application\[]

}

model Application {

id String @id @default(uuid())

jobId String

job Job @relation(fields: \[jobId], references: \[id])

crewUserId String

status String @default("applied")

createdAt DateTime @default(now())

}

13\) AI Features Roadmap

Day 0: CV parsing to profile fields; cert type extraction; redaction of PII in public mode.

Day 30: AI match explanations (“fit because: STCW valid, 60m motor, Med itinerary”).

Day 60: Interview Q generation per role; salary benchmarking by vessel type/length/region.

Day 90: Risk heuristics (fake jobs, spam, pay anomalies) + automatic moderation cues.

•

7

14\) Security \& Privacy

PII minimization, field‑level encryption for ID docs.

Signed URLs for downloads, short TTL.

Rate limiting + bot protection (Turnstile).

RBAC + admin approval for mass messaging.

GDPR: DSR endpoints, data export, delete account, retention 24 months post‑inactivity.

15\) Go‑To‑Market

Seed supply via yacht schools and chef academies; give 6‑month Pro.

Partner with marinas and management firms for owner side.

Referral engine: owner invites captain → both get 1 free month.

Content: “How to hire a Med season crew”, “STCW checklist”.

16\) MVP Scope (8–10 weeks)

1\) Auth + onboarding wizards (crew/owner) 2) Profile/CV ingest + cert uploads and expiry reminders 3) Job

posting + AI JD assistant 4) Matching feed + applications + messaging 5) Stripe subscriptions + receipts +

VAT 6) Basic moderation + verification queue 7) Analytics: funnel, match metrics dashboard

Out of scope for MVP: Escrow, contracts e‑sign, mobile apps, agencies API.

17\) Risk Register

Cold start liquidity → mitigate with pre‑onboarding and BD partnerships.

Fraudulent jobs → KYC + small paywall to post + manual review for first post.

Compliance complexity → start with EU/Med and expand.

Seasonality → off‑season training content and job categories (refit/yard work).

18\) Contracts \& Documents (V1)

Offer letter templates per role + NDAs.

Day‑rate confirmation slips with per‑diem and tips fields.

Simple MLC‑aligned clauses set. E‑sign via DocuSign or Signaturely.

19\) Analytics \& Admin

Admin dashboard: growth KPIs, fraud flags, KYC queue, refund tool, content CMS.

•

8

Cohort retention, paywall conversion, match quality scoring.

20\) Execution Plan – First 14 Days (POC)

Day 1–2: Repo, Next.js skeleton, Prisma + Neon, NextAuth, Stripe test mode.

Day 3–5: Crew onboarding wizard + CV parser (server action + OpenAI), cert upload.

Day 6–7: Owner org + vessel + create job; AI JD generator; Meilisearch index.

Day 8–10: Matching v0 (keyword + filters) → record scores; applications; messaging.

Day 11–12: Stripe subscriptions; limits enforcement by tier.

Day 13–14: Admin panel lite + KYC stub + email templates + PostHog.

21\) Founder Checklist

Pricing page live from day one.

Verify first 50 crew and 20 owners manually.

Add “Hire me now” calendar slots for Elite.

Build 10 canned job templates by vessel type and size.

Record 3 demo videos (crew, owner, admin).

22\) Open Questions to Resolve

Regions at launch (e.g., Med + Caribbean) and visa handling scope.

Escrow appetite among owners.

Depth of verification for Elite: phone references vs formal letters.

Agency workflows and permissions hierarchy.

23\) Quick UI Wireframe Notes

Crew dashboard: profile completeness ring, expiring certs, next availability, “Top 10 matches”.

Owner dashboard: pipeline (new → shortlisted → interview → offer), budget tracker, vessel roster.

Job card: vessel type/length, itinerary snippet, must‑have certs, start date, rate.

•

9

24\) Tech Debt Guardrails

Strict TypeScript everywhere; Zod on inputs.

E2E with Playwright on core flows.

Feature flags for AI components.

25\) Success Definition for MVP

≥ 200 active crew profiles with verified docs.

≥ 50 active owners with at least one posted job.

≥ 30 hires in first 90 days.

Median time‑to‑match ≤ 5 days.

•

10

