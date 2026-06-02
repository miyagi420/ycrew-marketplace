/**
 * Match service — calls the `match-crew-to-job` Edge Function (#8) and falls
 * back to the shared client-side scorer if the function is unreachable, so the
 * app keeps working offline / before the function is deployed.
 */
import { calculateMatchScore, type CrewForMatch, type JobForMatch } from './matching';
import { supabase } from './supabase';

export type RankedJob = {
  id: string;
  title: string;
  role: string;
  day_rate: number | null;
  currency: string;
  score: number;
  reasons: string[];
};

export type Candidate = {
  userId: string;
  name: string;
  role: string;
  score: number;
  reasons: string[];
  appliedStatus: string | null;
};

export async function getRankedJobsForCrew(uid: string): Promise<RankedJob[]> {
  const { data, error } = await supabase.functions.invoke('match-crew-to-job', {
    body: { crew_user_id: uid },
  });
  if (!error && data?.jobs) {
    return (data.jobs as { job_id: string; title: string; role: string; day_rate: number | null; currency: string; score: number; reasons: string[] }[]).map(
      (j) => ({ id: j.job_id, title: j.title, role: j.role, day_rate: j.day_rate, currency: j.currency, score: j.score, reasons: j.reasons }),
    );
  }
  return rankJobsClient(uid);
}

export async function getCandidatesForJob(jobId: string): Promise<Candidate[]> {
  const { data: apps } = await supabase
    .from('applications')
    .select('crew_user_id, status')
    .eq('job_id', jobId);
  const appMap = new Map<string, string>((apps ?? []).map((a) => [a.crew_user_id, a.status]));

  const { data, error } = await supabase.functions.invoke('match-crew-to-job', {
    body: { job_id: jobId },
  });
  if (!error && data?.candidates) {
    return (data.candidates as { crew_user_id: string; name: string; role: string | null; score: number; reasons: string[] }[]).map(
      (c) => ({
        userId: c.crew_user_id,
        name: c.name || 'Crew member',
        role: c.role || '—',
        score: c.score,
        reasons: c.reasons,
        appliedStatus: appMap.get(c.crew_user_id) ?? null,
      }),
    );
  }
  return rankCandidatesClient(jobId, appMap);
}

// --- Client-side fallbacks (use the same shared scorer) ---

async function vesselTypeMap(vesselIds: string[]): Promise<Map<string, string | null>> {
  const map = new Map<string, string | null>();
  const ids = vesselIds.filter(Boolean);
  if (!ids.length) return map;
  const { data } = await supabase.from('vessels').select('id, type').in('id', ids);
  (data ?? []).forEach((v) => map.set(v.id, v.type));
  return map;
}

async function rankJobsClient(uid: string): Promise<RankedJob[]> {
  const [{ data: profile }, { data: jobs }] = await Promise.all([
    supabase.from('crew_profiles').select('*, certifications(type)').eq('user_id', uid).maybeSingle(),
    supabase.from('jobs').select('*').eq('status', 'OPEN'),
  ]);
  const vmap = await vesselTypeMap((jobs ?? []).map((j) => j.vessel_id).filter((v): v is string => !!v));
  const crew = (profile ?? {}) as unknown as CrewForMatch;
  return (jobs ?? [])
    .map((j) => {
      const forMatch: JobForMatch = {
        role: j.role,
        requires_cert_types: j.requires_cert_types,
        min_exp_months: j.min_exp_months,
        start_date: j.start_date,
        itinerary: j.itinerary,
        vessel: j.vessel_id ? { type: vmap.get(j.vessel_id) ?? null } : null,
      };
      const { score, reasons } = calculateMatchScore(crew, forMatch);
      return { id: j.id, title: j.title, role: j.role, day_rate: j.day_rate, currency: j.currency, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

async function rankCandidatesClient(jobId: string, appMap: Map<string, string>): Promise<Candidate[]> {
  const { data: job } = await supabase.from('jobs').select('*').eq('id', jobId).maybeSingle();
  if (!job) return [];
  const vmap = await vesselTypeMap(job.vessel_id ? [job.vessel_id] : []);
  const forMatch: JobForMatch = {
    role: job.role,
    requires_cert_types: job.requires_cert_types,
    min_exp_months: job.min_exp_months,
    start_date: job.start_date,
    itinerary: job.itinerary,
    vessel: job.vessel_id ? { type: vmap.get(job.vessel_id) ?? null } : null,
  };
  const { data: crews } = await supabase.from('crew_profiles').select('*, certifications(type)');
  return (crews ?? [])
    .map((c) => {
      const { score, reasons } = calculateMatchScore(c as unknown as CrewForMatch, forMatch);
      return {
        userId: c.user_id,
        name: c.name || 'Crew member',
        role: c.primary_role || '—',
        score,
        reasons,
        appliedStatus: appMap.get(c.user_id) ?? null,
      };
    })
    .sort((a, b) => b.score - a.score);
}
