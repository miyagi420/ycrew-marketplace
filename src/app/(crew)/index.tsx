import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Pill } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { getRankedJobsForCrew, type RankedJob } from '@/lib/match-service';
import { matchTier } from '@/lib/matching';
import { supabase } from '@/lib/supabase';

export default function CrewHome() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, signOut } = useAuth();
  const uid = session!.user.id;

  const [ranked, setRanked] = useState<RankedJob[]>([]);
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [jobs, { data: apps }] = await Promise.all([
      getRankedJobsForCrew(uid),
      supabase.from('applications').select('job_id').eq('crew_user_id', uid),
    ]);
    setRanked(jobs);
    setApplied(new Set((apps ?? []).map((a) => a.job_id)));
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    load();
  }, [load]);

  const apply = async (jobId: string) => {
    const { error } = await supabase.from('applications').insert({ job_id: jobId, crew_user_id: uid });
    if (!error) setApplied((prev) => new Set(prev).add(jobId));
  };

  return (
    <View className="flex-1 bg-navy-900" style={{ paddingTop: insets.top + 12 }}>
      <View className="flex-row items-center justify-between px-5 pb-3">
        <Text className="text-2xl font-semibold text-white">{t('crew.matches')}</Text>
        <View className="flex-row gap-3">
          <Pressable onPress={() => router.push('/(crew)/applications')}>
            <Text className="text-sm text-gold-300">{t('crew.myApplications')}</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(crew)/profile')}>
            <Text className="text-sm text-gold-300">{t('crew.profile')}</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              await signOut();
              router.replace('/');
            }}>
            <Text className="text-sm text-navy-100">{t('common.signOut')}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#DBBC76" />}>
        <Text className="mb-4 text-sm text-navy-100">{t('crew.matchesSub')}</Text>

        {ranked.length === 0 && !loading ? (
          <Text className="mt-10 text-center text-navy-100">{t('crew.noMatches')}</Text>
        ) : null}

        {ranked.map((j) => (
          <Card key={j.id}>
            <View className="mb-2 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-lg font-semibold text-white">{j.title}</Text>
                <Text className="text-sm text-navy-100">{j.role}</Text>
              </View>
              <Pill tone={j.score >= 75 ? 'green' : 'gold'}>
                {j.score}% {matchTier(j.score)}
              </Pill>
            </View>
            {j.day_rate ? (
              <Text className="mb-2 text-sm text-gold-200">
                {j.currency} {j.day_rate}/day
              </Text>
            ) : null}
            {j.reasons.slice(0, 3).map((r) => (
              <Text key={r} className="text-xs text-navy-100">
                • {r}
              </Text>
            ))}
            <View className="mt-3">
              {applied.has(j.id) ? (
                <Pill tone="muted">{t('crew.applied')}</Pill>
              ) : (
                <Button title={t('crew.apply')} onPress={() => apply(j.id)} />
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
