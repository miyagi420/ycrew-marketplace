# Deployment Runbook

How to take the app from local to something you can actually try — on the web
(public URL) and on an Android phone — using only **free** accounts. iOS and
the app stores need paid developer accounts and come last.

## What you need

| Service | Cost | Used for | When |
|---|---|---|---|
| **Supabase** (cloud) | Free (no card) | Database, auth, storage, edge functions | **Required first** |
| **Vercel** | Free | Public web URL to try in a browser | Web deploy |
| **Expo (EAS)** | Free | Android preview APK to try on your phone | Android |
| Apple Developer | $99/yr | iOS builds + App Store | Later |
| Google Play | $25 once | Play Store submission | Later |

The single hard prerequisite is a **cloud Supabase project**. Everything else
builds on it.

---

## Step 1 — Create the cloud Supabase project

1. Go to <https://supabase.com> → **New project**. Pick a name, region, and a
   strong database password (save it).
2. When it's ready, open **Project Settings → API** and copy:
   - **Project URL** → `https://<ref>.supabase.co`
   - **anon / publishable key** (public, safe to ship)
   - **service_role key** (secret — never ship in the app)
   - The **project ref** is the `<ref>` in the URL.
3. **Auth → Providers → Email**: for quick testing, turn **Confirm email = OFF**
   (so signups work instantly, like local). Turn it back on before real launch.

> The `anon`/publishable key is safe in the app — Row-Level Security is what
> protects data. The `service_role` key is admin; keep it server-side only.

## Step 2 — Push the schema + functions to the cloud

From the project root:

```bash
npx supabase login                      # opens browser, one time
npx supabase link --project-ref <ref>   # enter the DB password when asked
npm run db:push                         # applies supabase/migrations/* to the cloud
npm run functions:deploy                # deploys match-crew-to-job + account
```

This creates all 13 tables, RLS policies, triggers, the matching/GDPR edge
functions, and enables realtime for messaging — exactly what was verified
locally. (`npm run deploy:supabase` does the last two in one go.)

## Step 3 — (Optional) Seed demo data in the cloud

To try it with sample crew/jobs and the demo logins:

```bash
# PowerShell
$env:EXPO_PUBLIC_SUPABASE_URL="https://<ref>.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="<service_role key>"
npm run seed
```

Creates `crew@demo.test`, `crew2@demo.test`, `owner@demo.test` (password
`Passw0rd!`), an org, and a published job — and re-runs the 11 RLS assertions
against the cloud project.

## Step 4 — Deploy the web app (public URL)

The repo has `vercel.json` (build = `expo export`, output = `dist`, SPA
rewrites). Two options:

**A. Vercel dashboard (easiest)**
1. <https://vercel.com> → **Add New → Project** → import `miyagi420/ycrew-marketplace`.
2. **Settings → Environment Variables**, add:
   - `EXPO_PUBLIC_SUPABASE_URL` = `https://<ref>.supabase.co`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = your anon/publishable key
3. **Deploy.** You get a public URL — open it and try the app.

**B. Vercel CLI**
```bash
npm i -g vercel
vercel link
vercel env add EXPO_PUBLIC_SUPABASE_URL
vercel env add EXPO_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

> Any static host works (Netlify, Cloudflare Pages): build with
> `npm run web:build`, deploy the `dist/` folder, and add an SPA fallback
> (all routes → `index.html`).

## Step 5 — Try it on an Android phone (free)

1. Put your cloud values into **`eas.json`** (replace the `YOUR-PROJECT-REF` /
   `YOUR-...-KEY` placeholders in the `preview` profile).
2. Build the APK:
   ```bash
   npm i -g eas-cli
   eas login                 # free Expo account
   eas init                  # links the project, writes the EAS projectId
   npm run build:android     # eas build -p android --profile preview
   ```
3. EAS returns a QR code / download link. Open it on your Android phone and
   install the APK (allow "install from unknown sources"). It talks to your
   cloud Supabase — fully working.

> iOS preview needs an Apple Developer account; once you have one:
> `npm run build:ios`.

## Step 6 — App stores (later, paid)

When you're ready to publish:

1. **Choose the real app name** (trademark-clear) and set `name` in `app.json`
   (bundle id `com.ycrew.app` is already set — change if needed).
2. Apple Developer ($99/yr) + Google Play ($25). Start Apple early (identity
   review is slow).
3. Production builds + submit:
   ```bash
   eas build -p android --profile production
   eas build -p ios --profile production
   eas submit -p android
   eas submit -p ios
   ```
4. **Payments (#11):** set up RevenueCat + store products, then wire the SDK.
5. Fill out store listings, privacy questionnaire (the app already exposes
   GDPR export/delete), screenshots, and review notes.

---

## Environment variable reference

| Variable | Where | Secret? |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Vercel, EAS (`eas.json`), `.env` | No |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Vercel, EAS (`eas.json`), `.env` | No |
| `SUPABASE_SERVICE_ROLE_KEY` | your shell when seeding only | **Yes** |

## Notes & gotchas

- **Email confirmation**: cloud Supabase defaults to ON. Leave OFF while
  testing, or sign up with a real inbox (check the Supabase Auth users list).
- **Matching function**: the app calls the `match-crew-to-job` edge function
  and falls back to client-side scoring if it's unreachable — so the app works
  even before `functions:deploy`.
- **Realtime messaging** requires the `messages` table in the realtime
  publication; the migration does this automatically on `db:push`.
- **CI** (`.github/workflows/ci.yml`) runs tsc + tests + a full Supabase/
  Playwright E2E on every PR — keep it green before deploying.
- Re-running `db:push` only applies *new* migrations; it won't wipe data.
