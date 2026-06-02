import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import type { Database } from './database.types';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env';

// Fallbacks keep createClient from throwing when env is unset (pre-config).
// Real calls only happen behind `isSupabaseConfigured` guards.
export const supabase = createClient<Database>(
  SUPABASE_URL || 'http://localhost:54321',
  SUPABASE_ANON_KEY || 'public-anon-placeholder',
  {
    auth: {
      // No SecureStore/AsyncStorage on web SSR; web uses localStorage by default.
      storage: Platform.OS === 'web' ? undefined : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  },
);
