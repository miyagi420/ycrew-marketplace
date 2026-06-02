/**
 * Public client env. Expo inlines EXPO_PUBLIC_* at build time.
 * The anon/publishable key is safe to ship; RLS is what protects data.
 * Set these in `.env` (see `.env.example`).
 */
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
