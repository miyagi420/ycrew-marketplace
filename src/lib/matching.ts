/**
 * Deterministic crew <-> job match scoring (blueprint section 9).
 * Ported from the legacy prototype, typed against the DB row shapes.
 *
 * NOTE: #8 hardens this into a Supabase Edge Function with contract tests.
 * For local end-to-end testing it runs client-side over RLS-filtered rows.
 */
import type { Database } from './database.types';

type CrewRow = Database['public']['Tables']['crew_profiles']['Row'];
type JobRow = Database['public']['Tables']['jobs']['Row'];

export type CrewForMatch = Pick<
  CrewRow,
  | 'primary_role'
  | 'secondary_roles'
  | 'experience_months'
  | 'boat_types'
  | 'availability_start'
  | 'availability_end'
  | 'homeport'
  | 'languages'
> & {
  certifications?: { type: string }[];
};

export type JobForMatch = Pick<
  JobRow,
  'role' | 'requires_cert_types' | 'min_exp_months' | 'start_date' | 'itinerary'
> & {
  vessel?: { type: string | null } | null;
};

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

  // Role
  if (crew.primary_role === job.role || (crew.secondary_roles ?? []).includes(job.role)) {
    total += weights.role * 100;
    reasons.push('Role matches your experience');
  }

  // Certifications — all required must be held
  const required = job.requires_cert_types ?? [];
  const held = (crew.certifications ?? []).map((c) => c.type);
  if (required.length > 0 && required.every((c) => held.includes(c))) {
    total += weights.certifications * 100;
    reasons.push('All required certifications held');
  }

  // Experience
  const reqMonths = job.min_exp_months ?? 0;
  if ((crew.experience_months ?? 0) >= reqMonths) {
    const ratio = reqMonths > 0 ? Math.min((crew.experience_months ?? 0) / (reqMonths * 2), 1) : 1;
    total += weights.experience * 100 * ratio;
    reasons.push('Experience meets requirements');
  }

  // Boat type
  if (job.vessel?.type && (crew.boat_types ?? []).includes(job.vessel.type)) {
    total += weights.boatType * 100;
    reasons.push('Experience on similar vessel type');
  }

  // Availability covers the start date
  if (crew.availability_start && crew.availability_end) {
    const start = new Date(job.start_date).getTime();
    if (start >= new Date(crew.availability_start).getTime() && start <= new Date(crew.availability_end).getTime()) {
      total += weights.availability * 100;
      reasons.push('Available for the start date');
    }
  }

  // Location / itinerary
  if (crew.homeport && job.itinerary?.includes(crew.homeport)) {
    total += weights.location * 100;
    reasons.push('Located in the cruising area');
  }

  // Language
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
