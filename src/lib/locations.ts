import { supabase } from './supabase';

export type MapPointKind = 'job' | 'vessel' | 'crew';

export type MapPoint = {
  id: string;
  kind: MapPointKind;
  title: string;
  subtitle?: string;
  lat: number;
  lng: number;
  status?: string;
  updatedAt?: string;
};

export type LocationDraft = {
  label: string;
  lat: number;
  lng: number;
  country?: string;
};

const fallbackPorts: LocationDraft[] = [
  { label: 'Marseille, France', country: 'France', lat: 43.2965, lng: 5.3698 },
  { label: 'Palma, Spain', country: 'Spain', lat: 39.5696, lng: 2.6502 },
  { label: 'Athens, Greece', country: 'Greece', lat: 37.9838, lng: 23.7275 },
  { label: 'Tortola, BVI', country: 'British Virgin Islands', lat: 18.4207, lng: -64.64 },
  { label: 'Fort Lauderdale, USA', country: 'United States', lat: 26.1224, lng: -80.1373 },
  { label: 'Tahiti, French Polynesia', country: 'France', lat: -17.6509, lng: -149.426 },
];

export function parseCoordinate(value: string): number | null {
  const n = Number(value.trim());
  return Number.isFinite(n) ? n : null;
}

export function fallbackLocation(seed: string): LocationDraft {
  const hash = Array.from(seed || 'voyage').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackPorts[hash % fallbackPorts.length];
}

export function buildLocationDraft(label: string, latText: string, lngText: string, seed: string): LocationDraft {
  const lat = parseCoordinate(latText);
  const lng = parseCoordinate(lngText);
  if (lat != null && lng != null) {
    return { label: label.trim() || 'Shared position', lat, lng };
  }
  const fallback = fallbackLocation(seed);
  return { ...fallback, label: label.trim() || fallback.label };
}

export async function fetchJobLocationPoints() {
  const { data } = await supabase
    .from('job_locations')
    .select('job_id, label, country, lat, lng, updated_at, job:jobs(title, role, status)')
    .order('updated_at', { ascending: false });

  return ((data ?? []) as any[]).map<MapPoint>((row) => ({
    id: row.job_id,
    kind: 'job',
    title: row.job?.title ?? row.label,
    subtitle: row.job?.role ?? row.label,
    lat: row.lat,
    lng: row.lng,
    status: row.job?.status,
    updatedAt: row.updated_at,
  }));
}

export async function fetchVesselPositionPoints() {
  const { data } = await supabase
    .from('vessel_positions')
    .select('vessel_id, job_id, label, lat, lng, speed_knots, heading, source, observed_at')
    .order('observed_at', { ascending: false });

  return ((data ?? []) as any[]).map<MapPoint>((row) => ({
    id: row.vessel_id,
    kind: 'vessel',
    title: row.label ?? 'Vessel position',
    subtitle: row.speed_knots != null ? `${row.speed_knots} kn` : row.source,
    lat: row.lat,
    lng: row.lng,
    updatedAt: row.observed_at,
  }));
}

export async function fetchCrewLocationPoints() {
  const { data } = await supabase
    .from('crew_locations')
    .select('crew_user_id, label, country, lat, lng, updated_at, crew:crew_profiles(name, primary_role)')
    .order('updated_at', { ascending: false });

  return ((data ?? []) as any[]).map<MapPoint>((row) => ({
    id: row.crew_user_id,
    kind: 'crew',
    title: row.crew?.name || 'Available crew',
    subtitle: row.crew?.primary_role || row.label,
    lat: row.lat,
    lng: row.lng,
    updatedAt: row.updated_at,
  }));
}

export async function upsertJobLocation(jobId: string, location: LocationDraft) {
  await supabase.from('job_locations').upsert({
    job_id: jobId,
    label: location.label,
    country: location.country ?? null,
    lat: location.lat,
    lng: location.lng,
    source: 'owner-entry',
  } as any);
}

export async function upsertCrewLocation(crewUserId: string, location: LocationDraft, shareWithOwners: boolean) {
  await supabase.from('crew_locations').upsert({
    crew_user_id: crewUserId,
    label: location.label,
    country: location.country ?? null,
    lat: location.lat,
    lng: location.lng,
    share_with_owners: shareWithOwners,
  } as any);
}
