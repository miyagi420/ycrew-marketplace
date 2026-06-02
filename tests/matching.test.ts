import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateMatchScore,
  type CrewForMatch,
  DEFAULT_WEIGHTS,
  type JobForMatch,
  matchTier,
} from '../supabase/functions/_shared/score.ts';

const crew = (over: Partial<CrewForMatch> = {}): CrewForMatch => ({
  primary_role: 'Deckhand',
  secondary_roles: [],
  experience_months: 24,
  boat_types: ['motor'],
  availability_start: '2026-06-01',
  availability_end: '2026-10-31',
  homeport: 'Antibes',
  languages: ['English', 'Spanish'],
  certifications: [{ type: 'STCW' }],
  ...over,
});

const job = (over: Partial<JobForMatch> = {}): JobForMatch => ({
  role: 'Deckhand',
  requires_cert_types: ['STCW'],
  min_exp_months: 12,
  start_date: '2026-06-15',
  itinerary: 'Antibes to Monaco',
  vessel: { type: 'motor' },
  ...over,
});

test('role match contributes a reason; mismatch does not', () => {
  const matched = calculateMatchScore(crew(), job());
  assert.ok(matched.reasons.includes('Role matches your experience'));
  const mismatch = calculateMatchScore(crew({ primary_role: 'Chef', secondary_roles: [] }), job());
  assert.ok(!mismatch.reasons.includes('Role matches your experience'));
});

test('secondary role also counts as a role match', () => {
  const r = calculateMatchScore(crew({ primary_role: 'Stew', secondary_roles: ['Deckhand'] }), job());
  assert.ok(r.reasons.includes('Role matches your experience'));
});

test('certifications must all be held', () => {
  const full = calculateMatchScore(crew({ certifications: [{ type: 'STCW' }, { type: 'ENG1' }] }), job({ requires_cert_types: ['STCW', 'ENG1'] }));
  assert.ok(full.reasons.includes('All required certifications held'));
  const partial = calculateMatchScore(crew({ certifications: [{ type: 'STCW' }] }), job({ requires_cert_types: ['STCW', 'ENG1'] }));
  assert.ok(!partial.reasons.includes('All required certifications held'));
});

test('experience threshold gates the experience reason', () => {
  const ok = calculateMatchScore(crew({ experience_months: 24 }), job({ min_exp_months: 12 }));
  assert.ok(ok.reasons.includes('Experience meets requirements'));
  const under = calculateMatchScore(crew({ experience_months: 6 }), job({ min_exp_months: 12 }));
  assert.ok(!under.reasons.includes('Experience meets requirements'));
});

test('availability overlap detects start date inside the window', () => {
  const inside = calculateMatchScore(crew({ availability_start: '2026-06-01', availability_end: '2026-09-01' }), job({ start_date: '2026-06-15' }));
  assert.ok(inside.reasons.includes('Available for the start date'));
  const outside = calculateMatchScore(crew({ availability_start: '2026-07-01', availability_end: '2026-09-01' }), job({ start_date: '2026-06-15' }));
  assert.ok(!outside.reasons.includes('Available for the start date'));
});

test('changing weights changes the score', () => {
  const base = calculateMatchScore(crew(), job());
  const boosted = calculateMatchScore(crew(), job(), { ...DEFAULT_WEIGHTS, role: 0.6 });
  assert.notEqual(base.score, boosted.score);
  assert.ok(boosted.score >= base.score);
});

test('score is clamped to 0..100 and a perfect profile is a strong match', () => {
  const r = calculateMatchScore(crew(), job());
  assert.ok(r.score >= 0 && r.score <= 100);
  assert.equal(matchTier(95), 'Excellent match');
  assert.equal(matchTier(50), 'Partial match');
});

test('a wholly unrelated crew scores low', () => {
  const r = calculateMatchScore(
    crew({ primary_role: 'Chef', secondary_roles: [], certifications: [], experience_months: 0, boat_types: [], availability_start: null, availability_end: null, homeport: null, languages: [] }),
    job(),
  );
  assert.ok(r.score < 20, `expected low score, got ${r.score}`);
});
