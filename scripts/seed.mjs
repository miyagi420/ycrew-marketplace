/**
 * Seeds the LOCAL Supabase stack with demo data and asserts RLS behavior.
 * Doubles as the acceptance check for the schema + RLS slice (#3).
 *
 * Run: npm run seed   (after `npx supabase start`)
 *
 * Uses well-known local-only keys from `npx supabase status`. Never prod.
 */
import { createClient } from '@supabase/supabase-js';

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';
const ANON =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const SERVICE =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const admin = createClient(URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });

const checks = [];
const assert = (name, cond) => {
  checks.push({ name, ok: !!cond });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
};

async function ensureUser(email, password, meta) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: meta,
  });
  if (error) {
    if (/already|registered|exists/i.test(error.message)) {
      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const found = list.users.find((u) => u.email === email);
      return found.id;
    }
    throw error;
  }
  return data.user.id;
}

function clientFor() {
  return createClient(URL, ANON, { auth: { autoRefreshToken: false, persistSession: false } });
}
async function signIn(email, password) {
  const c = clientFor();
  const { error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return c;
}

const PW = 'Passw0rd!';

async function main() {
  // --- Identities (trigger creates public.users + crew_profiles) ---
  const crewId = await ensureUser('crew@demo.test', PW, { role: 'CREW', name: 'Alex Rivera' });
  const crew2Id = await ensureUser('crew2@demo.test', PW, { role: 'CREW', name: 'Sam Okafor' });
  const ownerId = await ensureUser('owner@demo.test', PW, { role: 'OWNER', name: 'Marina Hart' });
  console.log('users:', { crewId, crew2Id, ownerId });

  // Trigger runs async-ish; give it a beat, then confirm rows exist.
  await new Promise((r) => setTimeout(r, 400));
  const { data: appUsers } = await admin.from('users').select('id, role').in('id', [crewId, ownerId]);
  assert('signup trigger created public.users rows', appUsers?.length === 2);
  const { data: crewRow } = await admin.from('crew_profiles').select('user_id').eq('user_id', crewId).maybeSingle();
  assert('signup trigger created crew_profile for CREW', !!crewRow);

  // --- Crew fills profile + a certification ---
  const crew = await signIn('crew@demo.test', PW);
  await crew
    .from('crew_profiles')
    .update({
      name: 'Alex Rivera',
      primary_role: 'Deckhand',
      experience_months: 24,
      languages: ['English', 'Spanish'],
      boat_types: ['motor'],
      boat_length_min: 30,
      boat_length_max: 90,
      min_day_rate: 180,
      availability_start: '2026-06-01',
      availability_end: '2026-10-31',
      profile_completeness: 80,
    })
    .eq('user_id', crewId);
  await crew.from('certifications').insert({ crew_user_id: crewId, type: 'STCW', verified: true });

  // --- Owner creates org + vessel + posts an OPEN job ---
  const owner = await signIn('owner@demo.test', PW);
  const { data: org, error: orgErr } = await owner.rpc('create_owner_org', {
    p_name: 'Blue Horizon Yachting',
    p_type: 'owner',
  });
  if (orgErr) throw orgErr;
  const { data: vessel } = await owner
    .from('vessels')
    .insert({ owner_org_id: org.id, name: 'MY Serenity', type: 'motor', length_m: 60, flag_state: 'Malta' })
    .select()
    .single();
  const { data: job } = await owner
    .from('jobs')
    .insert({
      owner_org_id: org.id,
      vessel_id: vessel.id,
      title: 'Experienced Deckhand — Med Season',
      role: 'Deckhand',
      contract_type: 'SEASONAL',
      start_date: '2026-06-15',
      duration_days: 120,
      requires_cert_types: ['STCW'],
      min_exp_months: 12,
      day_rate: 190,
      status: 'OPEN',
    })
    .select()
    .single();
  // A draft job that crew must NOT see.
  await owner.from('jobs').insert({
    owner_org_id: org.id,
    title: 'Draft — Chief Stew',
    role: 'Stew',
    contract_type: 'SEASONAL',
    start_date: '2026-07-01',
    status: 'DRAFT',
  });
  assert('owner created org via RPC', !!org?.id);
  assert('owner posted a job', !!job?.id);

  // --- RLS assertions ---
  // Crew sees the OPEN job, not the DRAFT.
  const { data: crewJobs } = await crew.from('jobs').select('id, status');
  assert('crew sees published job', crewJobs?.some((j) => j.id === job.id));
  assert('crew does NOT see draft jobs', !crewJobs?.some((j) => j.status === 'DRAFT'));

  // Crew sees only own profile (owner-role bypass not applicable to crew).
  const { data: crewVisibleProfiles } = await crew.from('crew_profiles').select('user_id');
  assert('crew sees only own profile', crewVisibleProfiles?.length === 1 && crewVisibleProfiles[0].user_id === crewId);

  // crew2 cannot read crew1's profile.
  const crew2 = await signIn('crew2@demo.test', PW);
  const { data: leaked } = await crew2.from('crew_profiles').select('user_id').eq('user_id', crewId);
  assert('crew2 cannot read another crew profile', (leaked?.length ?? 0) === 0);

  // Owner CAN read crew profiles (candidate browsing).
  const { data: ownerSeesCrew } = await owner.from('crew_profiles').select('user_id').eq('user_id', crewId);
  assert('owner can read crew profile (candidates)', (ownerSeesCrew?.length ?? 0) === 1);

  // Crew applies; owner sees the applicant; crew2 cannot see crew1's application.
  await crew.from('applications').insert({ job_id: job.id, crew_user_id: crewId, cover_text: 'Available immediately.' });
  const { data: ownerApps } = await owner.from('applications').select('id, crew_user_id').eq('job_id', job.id);
  assert('owner sees applicant for own job', ownerApps?.some((a) => a.crew_user_id === crewId));
  const { data: crew2Apps } = await crew2.from('applications').select('id').eq('job_id', job.id);
  assert('crew2 cannot see others applications', (crew2Apps?.length ?? 0) === 0);

  const failed = checks.filter((c) => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
  if (failed.length) {
    console.error('FAILED:', failed.map((f) => f.name).join('; '));
    process.exit(1);
  }
  console.log('\nDemo logins (password for all: Passw0rd!):');
  console.log('  crew@demo.test   (CREW)');
  console.log('  owner@demo.test  (OWNER)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
