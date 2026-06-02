import { Redirect, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth';

export default function Index() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-navy-900">
        <ActivityIndicator color="#DBBC76" />
      </View>
    );
  }

  if (session) {
    return <Redirect href={role === 'OWNER' || role === 'AGENCY' ? '/(owner)' : '/(crew)'} />;
  }

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
          <Pressable
            onPress={() => router.push('/(auth)/sign-up?role=CREW')}
            className="items-center rounded-2xl bg-gold-400 py-4 active:opacity-80">
            <Text className="text-base font-semibold text-navy-900">{t('landing.ctaCrew')}</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(auth)/sign-up?role=OWNER')}
            className="items-center rounded-2xl border border-gold-400/40 py-4 active:opacity-70">
            <Text className="text-base font-semibold text-gold-200">{t('landing.ctaOwner')}</Text>
          </Pressable>
        </View>
      </MotiView>

      <Pressable onPress={() => router.push('/(auth)/sign-in')} className="items-center py-2">
        <Text className="text-sm text-navy-100">
          {t('landing.haveAccount')} <Text className="text-gold-300">{t('landing.signIn')}</Text>
        </Text>
      </Pressable>
    </View>
  );
}
