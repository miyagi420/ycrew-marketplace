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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#1E3A8A" />
      </View>
    );
  }

  if (session) {
    return <Redirect href={role === 'OWNER' || role === 'AGENCY' ? '/(owner)' : '/(crew)'} />;
  }

  return (
    <View
      className="flex-1 bg-white px-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}>
      <MotiView
        from={{ opacity: 0, translateY: 14 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 650 }}
        className="flex-1 justify-center">
        <View className="mb-8 h-64 overflow-hidden rounded-3xl bg-sky-100">
          <View className="absolute left-8 top-10 h-24 w-24 rounded-full bg-white/80" />
          <View className="absolute right-8 top-12 h-16 w-32 rounded-full bg-white/90" />
          <View className="absolute bottom-8 left-6 right-6 h-20 rounded-[32px] bg-blue-800" />
          <View className="absolute bottom-16 left-14 h-12 w-40 rounded-full bg-white" />
          <View className="absolute bottom-20 left-24 h-8 w-8 rounded-full bg-orange-500" />
          <View className="absolute bottom-20 right-20 h-10 w-10 rounded-full bg-emerald-600" />
        </View>

        <Text className="mb-4 text-sm uppercase text-orange-600">
          {t('landing.brand')}
        </Text>
        <Text className="mb-3 text-5xl font-normal leading-tight text-slate-950">
          {t('landing.tagline')}
        </Text>
        <Text className="mb-10 text-lg leading-relaxed text-slate-600">
          {t('landing.subtitle')}
        </Text>

        <View className="gap-3">
          <Pressable
            testID="cta-crew"
            onPress={() => router.push('/(auth)/sign-up?role=CREW')}
            className="items-center rounded-2xl bg-blue-800 py-4 active:opacity-80">
            <Text className="text-base font-semibold text-white">{t('landing.ctaCrew')}</Text>
          </Pressable>
          <Pressable
            testID="cta-owner"
            onPress={() => router.push('/(auth)/sign-up?role=OWNER')}
            className="items-center rounded-2xl border border-blue-800/30 py-4 active:opacity-70">
            <Text className="text-base font-semibold text-blue-800">{t('landing.ctaOwner')}</Text>
          </Pressable>
        </View>
      </MotiView>

      <Pressable onPress={() => router.push('/(auth)/sign-in')} className="items-center py-2">
        <Text className="text-sm text-slate-600">
          {t('landing.haveAccount')} <Text className="text-blue-800">{t('landing.signIn')}</Text>
        </Text>
      </Pressable>
    </View>
  );
}
