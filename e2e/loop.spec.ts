import { expect, test } from '@playwright/test';

// Full vertical-slice smoke: owner posts a job, crew signs up and applies.
// Runs against the local web build + local Supabase stack.
//
// Expo Router keeps prior screens mounted (hidden) in the DOM, so labels and
// testIDs can resolve to multiple nodes — always scope to the visible one.
test('owner posts a job and a crew member applies', async ({ page }) => {
  const tid = (id: string) => page.getByTestId(id).filter({ visible: true }).first();
  const txt = (s: string) => page.getByText(s).filter({ visible: true }).first();

  const stamp = Date.now();
  const ownerEmail = `e2e_owner_${stamp}@e2e.test`;
  const crewEmail = `e2e_crew_${stamp}@e2e.test`;
  const jobTitle = `E2E Deckhand ${stamp}`;

  const fillSignup = async (name: string, email: string) => {
    await tid('name').fill(name);
    await tid('email').fill(email);
    await tid('password').fill('Passw0rd!');
    await tid('age').click();
    await tid('submit').click();
  };

  // --- Owner signs up and posts a job ---
  await page.goto('/');
  await tid('cta-owner').click();
  await fillSignup('E2E Owner', ownerEmail);

  await txt('Post a job').click();
  await tid('job-title').fill(jobTitle);
  await tid('job-role').fill('Deckhand');
  await tid('job-start').fill('2026-07-01');
  await tid('publish').click();
  await expect(txt(jobTitle)).toBeVisible();

  // --- Owner signs out (group guard sends us to Sign in) ---
  await txt('Sign out').click();
  await expect(txt('No account? Sign up')).toBeVisible();

  // --- Crew signs up via the sign-up link, sees the job, applies ---
  await txt('No account? Sign up').click();
  await tid('role-CREW').click();
  await fillSignup('E2E Crew', crewEmail);

  await expect(txt(jobTitle)).toBeVisible();
  await tid('apply').click();
  await expect(txt('Applied')).toBeVisible();
});
