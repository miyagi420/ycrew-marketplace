# Google setup: Maps API key + Play Store deployment

Two separate Google things, both needed eventually:

1. **Google Maps API key** (Google **Cloud** Console) — makes the voyage map
   render real map tiles instead of the offline fallback.
2. **Google Play** (Google **Play Console**) — publishing the Android app.

---

## Part 1 — Google Maps API key

### Get the key
1. Go to <https://console.cloud.google.com> and sign in (any Google account;
   no charge until you exceed the generous free tier, but a billing account is
   required — Maps gives a large monthly free credit).
2. **Create a project** (e.g. "Yachtly").
3. **APIs & Services → Library** → enable:
   - **Maps JavaScript API** — the only API the web app needs.
   - **Maps SDK for Android** — only when you ship native Android maps (later).
   - (Places, Roads, Directions, Geocoding are **not** used — skip them.)
4. **APIs & Services → Credentials → Create credentials → API key.** Copy it.
5. **Restrict the key** (important — the key ships in the web bundle):
   - *Application restrictions* → **HTTP referrers** → add your domains, e.g.
     `http://localhost:8081/*`, and your Vercel domain `https://*.vercel.app/*`
     plus your final domain.
   - *API restrictions* → restrict to the APIs you enabled above.
   - For a separate **Android** key later: *Application restrictions* → Android
     apps → add package `com.yachtly.app` + your signing SHA-1.

### Use the key

**Local / web:** add to `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your-key
```
Restart `npm run web`. The map now renders live tiles (without the key it shows
the "Set Google Maps key for live map" chart fallback).

**Vercel (web deploy):** add `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` in the project's
Environment Variables, then redeploy.

**EAS (native builds):** the key is already referenced in `eas.json` under each
build profile's `env` — replace the placeholder with your key.

> The web map uses the **JavaScript** Maps API (key via `EXPO_PUBLIC_*`).
> Native Android maps use the **Maps SDK for Android** and a key placed in
> `app.json` (see "Native maps" below) — that's a later step; today the native
> app shows the offline chart fallback.

---

## Part 2 — Publish to Google Play

### A. One-time account + tooling
1. **Google Play Developer account** — <https://play.google.com/console/signup>,
   **$25 one-time**. Provide identity details (can take a day or two to verify).
2. Install EAS: `npm i -g eas-cli`, then `eas login` (free Expo account).
3. In the project: `eas init` (links the project, writes the EAS project id into
   `app.json`).

### B. Build the Android app
- **Preview APK** (sideload on your own phone to test — no Play account needed):
  ```bash
  npm run build:android        # eas build -p android --profile preview
  ```
  EAS returns a QR/download link → install the APK directly.
- **Production AAB** (the format Play requires):
  ```bash
  eas build -p android --profile production
  ```
  EAS manages the app-signing keystore for you (Play App Signing).

### C. Create the app in Play Console
1. **Play Console → Create app**: name, default language, "App", "Free".
2. Complete the required declarations (most are forms):
   - **App content**: privacy policy URL (the app has Privacy/Terms screens —
     host them or link the Vercel URLs), data safety, ads (none), content rating
     questionnaire, target audience (18+; the app enforces 18+ at signup),
     government apps (no).
   - **Store listing**: short + full description, app icon (512×512), feature
     graphic (1024×500), at least 2 phone screenshots.

### D. Release to a test track first
1. **Testing → Internal testing → Create release.**
2. Upload the **AAB** from EAS (or `eas submit -p android` to upload directly —
   see below).
3. Add testers by email, share the opt-in link, install from Play on a real
   device. Iterate here freely.

### E. Submit / promote to production
```bash
eas submit -p android            # uploads the latest production build to Play
```
Then in Play Console: **Production → Create release** → roll out. First review
typically takes a few hours to a few days.

> **Payments note:** once subscriptions are enabled, Play requires **Google Play
> Billing** for them (via RevenueCat, already scaffolded) — not an external
> processor. Set up the subscription products in Play Console before that
> release.

---

## Native maps (Android) — later

The voyage map currently renders real tiles on **web** only; native shows the
offline chart. To enable real maps in the Android app:

1. Enable **Maps SDK for Android** + make an Android-restricted key (above).
2. Add to `app.json`:
   ```json
   "android": {
     "package": "com.yachtly.app",
     "config": { "googleMaps": { "apiKey": "YOUR_ANDROID_MAPS_KEY" } }
   }
   ```
3. Add `react-native-maps` and render it on native in `src/components/voyage-map.tsx`
   (the web branch stays as-is). Then rebuild with EAS.

---

## What's missing for the map to be "fully working"

| Item | Status |
|---|---|
| Owners set a job's location on posting | ✅ done (`upsertJobLocation`) |
| Crew share their location (opt-in) | ✅ done (`upsertCrewLocation`) |
| Map renders points + realtime updates | ✅ done (web) |
| Fallback when no coords / no key | ✅ done (deterministic ports + chart) |
| **Real Google tiles on web** | ⏳ needs `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` |
| **Real tiles on native Android** | ⏳ needs Maps SDK for Android + `react-native-maps` (later) |
| Cloud DB has the location tables | ⏳ apply the 2 location migrations to the cloud project |
