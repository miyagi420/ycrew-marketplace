import { supabase } from './supabase';

export type CertStatus = 'valid' | 'expiring' | 'expired' | 'none';

const DAY = 24 * 60 * 60 * 1000;
export const EXPIRING_WINDOW_DAYS = 90;

/** Classify a certification by its expiry date. */
export function certStatus(expiry: string | null): CertStatus {
  if (!expiry) return 'none';
  const diff = new Date(expiry).getTime() - Date.now();
  if (diff < 0) return 'expired';
  if (diff <= EXPIRING_WINDOW_DAYS * DAY) return 'expiring';
  return 'valid';
}

/** How many of a crew member's certs are expired or expiring soon. */
export async function expiringCertCount(uid: string): Promise<number> {
  const { data } = await supabase.from('certifications').select('expiry_date').eq('crew_user_id', uid);
  return (data ?? []).filter((c) => {
    const s = certStatus(c.expiry_date);
    return s === 'expired' || s === 'expiring';
  }).length;
}
