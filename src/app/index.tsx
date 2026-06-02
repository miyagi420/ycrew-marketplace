import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isSupabaseConfigured } from '@/lib/env';
import { supabase } from '@/lib/supabase';

export default function Landing() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [connected, setConnected] = useState(false);

  // Foundation slice: prove the client -> Supabase path is live once configured.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    supabase.auth.getSession().then(({ error }) => {
      if (active && !error) setConnected(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <View
      className="flex-1 bg-navy-900 px-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}>
      <MotiView
        from={{ opacity: 0, translateY: 14 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 650 }}
        className="flex-1 justify-center">
        <Text className="mb-4 text-sm uppercase tracking-[3px] text-gold-400">
          {t('landing.brand')}
        </Text>
        <Text className="mb-3 text-4xl font-semibold leading-tight text-white">
          {t('landing.tagline')}
        </Text>
        <Text className="mb-10 text-base leading-relaxed text-navy-100">
          {t('landing.subtitle')}
        </Text>

        <View className="gap-3">
          <Pressable className="items-center rounded-2xl bg-gold-400 py-4 active:opacity-80">
            <Text className="text-base font-semibold text-navy-900">{t('landing.ctaCrew')}</Text>
          </Pressable>
          <Pressable className="items-center rounded-2xl border border-gold-400/40 py-4 active:opacity-70">
            <Text className="text-base font-semibold text-gold-200">{t('landing.ctaOwner')}</Text>
          </Pressable>
        </View>
      </MotiView>

      <View className="items-center">
        <View
          className={`flex-row items-center gap-2 rounded-full px-3 py-1.5 ${
            connected ? 'bg-emerald-500/15' : 'bg-white/10'
          }`}>
          <View className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-gold-400'}`} />
          <Text className="text-xs text-navy-100">
            {connected ? t('landing.backendConnected') : t('landing.backendPending')}
          </Text>
        </View>
      </View>
    </View>
  );
}
