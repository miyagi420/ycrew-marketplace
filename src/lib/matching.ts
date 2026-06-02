/**
 * App-facing match scoring. Re-exports the single source of truth shared with
 * the Supabase Edge Function (supabase/functions/_shared/score.ts) so the
 * client-side fallback and the server compute can never drift.
 *
 * #8 hardens matching into the Edge Function `match-crew-to-job`; this client
 * scorer remains as a resilient fallback (see src/lib/match-service.ts).
 */
export {
  calculateMatchScore,
  DEFAULT_WEIGHTS,
  matchTier,
  type CrewForMatch,
  type JobForMatch,
  type MatchScore,
  type MatchWeights,
} from '../../supabase/functions/_shared/score';
