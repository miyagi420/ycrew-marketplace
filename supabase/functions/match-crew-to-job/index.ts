// Supabase Edge Function: match-crew-to-job (#8)
//
// POST { job_id }       -> ranked candidate crew for that job; upserts matches.
// POST { crew_user_id } -> ranked OPEN jobs for that crew.
//
// Deterministic scoring is the shared source of truth in ../_shared/score.ts.
import { createClient } from 'jsr:@supabase/supabase-js@2';

import { calculateMatchScore, type CrewForMatch, type JobForMatch } from '../_shared/score.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { job_id, crew_user_id } = await req.json().catch(() => ({}));
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const vesselType = async (vesselId: string | null) => {
      if (!vesselId) return null;
      const { data } = await supabase.from('vessels').select('type').eq('id', vesselId).maybeSingle();
      return data?.type ?? null;
    };

    // ---- Candidates for a job ----
    if (job_id) {
      const { data: job } = await supabase.from('jobs').select('*').eq('id', job_id).maybeSingle();
      if (!job) return json({ error: 'job not found' }, 404);

      const forMatch: JobForMatch = {
        role: job.role,
        requires_cert_types: job.requires_cert_types,
        min_exp_months: job.min_exp_months,
        start_date: job.start_date,
        itinerary: job.itinerary,
        vessel: { type: await vesselType(job.vessel_id) },
      };

      const { data: crews } = await supabase.from('crew_profiles').select('*, certifications(type)');
      const ranked = (crews ?? [])
        .map((c: CrewForMatch & { user_id: string; name: string }) => {
          const { score, reasons } = calculateMatchScore(c, forMatch);
          return { crew_user_id: c.user_id, name: c.name, role: c.primary_role, score, reasons };
        })
        .sort((a, b) => b.score - a.score);

      // Persist for reuse / analytics (idempotent on (job_id, crew_user_id)).
      if (ranked.length) {
        await supabase.from('matches').upsert(
          ranked.map((r) => ({
            job_id,
            crew_user_id: r.crew_user_id,
            score: r.score,
            reasons: r.reasons,
          })),
          { onConflict: 'job_id,crew_user_id' },
        );
      }
      return json({ candidates: ranked });
    }

    // ---- Jobs for a crew member ----
    if (crew_user_id) {
      const { data: crew } = await supabase
        .from('crew_profiles')
        .select('*, certifications(type)')
        .eq('user_id', crew_user_id)
        .maybeSingle();
      if (!crew) return json({ error: 'crew not found' }, 404);

      const { data: jobs } = await supabase.from('jobs').select('*').eq('status', 'OPEN');
      const ranked = await Promise.all(
        (jobs ?? []).map(async (j) => {
          const forMatch: JobForMatch = {
            role: j.role,
            requires_cert_types: j.requires_cert_types,
            min_exp_months: j.min_exp_months,
            start_date: j.start_date,
            itinerary: j.itinerary,
            vessel: { type: await vesselType(j.vessel_id) },
          };
          const { score, reasons } = calculateMatchScore(crew as CrewForMatch, forMatch);
          return {
            job_id: j.id,
            title: j.title,
            role: j.role,
            day_rate: j.day_rate,
            currency: j.currency,
            score,
            reasons,
          };
        }),
      );
      ranked.sort((a, b) => b.score - a.score);
      return json({ jobs: ranked });
    }

    return json({ error: 'provide job_id or crew_user_id' }, 400);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
