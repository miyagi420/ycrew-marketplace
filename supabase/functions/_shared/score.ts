/**
 * Deterministic crew <-> job match scoring (blueprint section 9).
 *
 * SINGLE SOURCE OF TRUTH — imported by both the Supabase Edge Function
 * (Deno) and the app (`src/lib/matching.ts` re-exports this). Pure: no
 * imports, no runtime deps, so it runs identically in Deno, Node, and Metro.
 */

export interface CrewForMatch {
  primary_role: string | null;
  secondary_roles: string[] | null;
  experience_months: number | null;
  boat_types: string[] | null;
  availability_start: string | null;
  availability_end: string | null;
  homeport: string | null;
  languages: string[] | null;
  certifications?: { type: string }[] | null;
}

export interface JobForMatch {
  role: string;
  requires_cert_types: string[] | null;
  min_exp_months: number | null;
  start_date: string;
  itinerary: string | null;
  vessel?: { type: string | null } | null;
}

export interface MatchWeights {
  role: number;
  certifications: number;
  experience: number;
  boatType: number;
  availability: number;
  location: number;
  language: number;
  rating: number;
  recency: number;
  subscriptionBoost: number;
}

export interface MatchScore {
  score: number;
  reasons: string[];
}

export const DEFAULT_WEIGHTS: MatchWeights = {
  role: 0.25,
  certifications: 0.2,
  experience: 0.15,
  boatType: 0.1,
  availability: 0.1,
  location: 0.07,
  language: 0.05,
  rating: 0.03,
  recency: 0.03,
  subscriptionBoost: 0.02,
};

export function calculateMatchScore(
  crew: CrewForMatch,
  job: JobForMatch,
  weights: MatchWeights = DEFAULT_WEIGHTS,
): MatchScore {
  const reasons: string[] = [];
  let total = 0;

  if (crew.primary_role === job.role || (crew.secondary_roles ?? []).includes(job.role)) {
    total += weights.role * 100;
    reasons.push('Role matches your experience');
  }

  const required = job.requires_cert_types ?? [];
  const held = (crew.certifications ?? []).map((c) => c.type);
  if (required.length > 0 && required.every((c) => held.includes(c))) {
    total += weights.certifications * 100;
    reasons.push('All required certifications held');
  }

  const reqMonths = job.min_exp_months ?? 0;
  if ((crew.experience_months ?? 0) >= reqMonths) {
    const ratio = reqMonths > 0 ? Math.min((crew.experience_months ?? 0) / (reqMonths * 2), 1) : 1;
    total += weights.experience * 100 * ratio;
    reasons.push('Experience meets requirements');
  }

  if (job.vessel?.type && (crew.boat_types ?? []).includes(job.vessel.type)) {
    total += weights.boatType * 100;
    reasons.push('Experience on similar vessel type');
  }

  if (crew.availability_start && crew.availability_end) {
    const start = new Date(job.start_date).getTime();
    if (
      start >= new Date(crew.availability_start).getTime() &&
      start <= new Date(crew.availability_end).getTime()
    ) {
      total += weights.availability * 100;
      reasons.push('Available for the start date');
    }
  }

  if (crew.homeport && job.itinerary?.includes(crew.homeport)) {
    total += weights.location * 100;
    reasons.push('Located in the cruising area');
  }

  if ((crew.languages ?? []).length > 1) {
    total += weights.language * 100;
    reasons.push('Multilingual');
  }

  return { score: Math.min(Math.round(total), 100), reasons };
}

export function matchTier(score: number): string {
  if (score >= 90) return 'Excellent match';
  if (score >= 75) return 'Strong match';
  if (score >= 60) return 'Good match';
  return 'Partial match';
}
