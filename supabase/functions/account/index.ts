// Supabase Edge Function: account (#12 GDPR)
//
// POST { action: 'export' } -> all data we hold about the authenticated user.
// POST { action: 'delete' } -> permanently delete the user (cascades all rows).
//
// The caller is identified from their JWT; privileged reads/deletes run with
// the service role but are always scoped to that user id.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const authHeader = req.headers.get('Authorization') ?? '';

    // Identify the caller from their JWT.
    const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: 'unauthorized' }, 401);
    const uid = user.id;

    const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { action } = await req.json().catch(() => ({ action: 'export' }));

    if (action === 'delete') {
      const { error } = await admin.auth.admin.deleteUser(uid);
      if (error) return json({ error: error.message }, 500);
      return json({ deleted: true });
    }

    // export (default)
    const [appUser, crew, certs, applications, memberships, verifications, subscriptions] =
      await Promise.all([
        admin.from('users').select('*').eq('id', uid).maybeSingle(),
        admin.from('crew_profiles').select('*').eq('user_id', uid).maybeSingle(),
        admin.from('certifications').select('*').eq('crew_user_id', uid),
        admin.from('applications').select('*').eq('crew_user_id', uid),
        admin.from('owner_org_members').select('org_id, role').eq('user_id', uid),
        admin.from('verifications').select('*').eq('user_id', uid),
        admin.from('subscriptions').select('*').eq('user_id', uid),
      ]);

    const orgIds = (memberships.data ?? []).map((m) => m.org_id);
    let orgs: unknown[] = [];
    let jobs: unknown[] = [];
    if (orgIds.length) {
      const [{ data: o }, { data: j }] = await Promise.all([
        admin.from('owner_orgs').select('*').in('id', orgIds),
        admin.from('jobs').select('*').in('owner_org_id', orgIds),
      ]);
      orgs = o ?? [];
      jobs = j ?? [];
    }

    return json({
      exported_at: new Date().toISOString(),
      account: { id: uid, email: user.email },
      user: appUser.data,
      crew_profile: crew.data,
      certifications: certs.data ?? [],
      applications: applications.data ?? [],
      memberships: memberships.data ?? [],
      orgs,
      jobs,
      verifications: verifications.data ?? [],
      subscriptions: subscriptions.data ?? [],
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
