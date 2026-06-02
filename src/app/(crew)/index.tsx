import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Pill } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import {
  calculateMatchScore,
  type CrewForMatch,
  type JobForMatch,
  matchTier,
} from '@/lib/matching';
import { supabase } from '@/lib/supabase';

type RankedJob = {
  id: string;
  title: string;
  role: string;
  day_rate: number | null;
  currency: string;
  score: number;
  reasons: string[];
};

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
    const [{ data: profile }, { data: jobs }, { data: apps }] = await Promise.all([
      supabase.from('crew_profiles').select('*, certifications(type)').eq('user_id', uid).maybeSingle(),
      supabase.from('jobs').select('*').eq('status', 'OPEN'),
      supabase.from('applications').select('job_id').eq('crew_user_id', uid),
    ]);

    const vesselIds = (jobs ?? []).map((j) => j.vessel_id).filter((v): v is string => !!v);
    const vesselMap = new Map<string, string | null>();
    if (vesselIds.length) {
      const { data: vessels } = await supabase.from('vessels').select('id, type').in('id', vesselIds);
      (vessels ?? []).forEach((v) => vesselMap.set(v.id, v.type));
    }

    const crew = (profile ?? {}) as unknown as CrewForMatch;
    const out: RankedJob[] = (jobs ?? []).map((j) => {
      const forMatch: JobForMatch = {
        role: j.role,
        requires_cert_types: j.requires_cert_types,
        min_exp_months: j.min_exp_months,
        start_date: j.start_date,
        itinerary: j.itinerary,
        vessel: j.vessel_id ? { type: vesselMap.get(j.vessel_id) ?? null } : null,
      };
      const { score, reasons } = calculateMatchScore(crew, forMatch);
      return {
        id: j.id,
        title: j.title,
        role: j.role,
        day_rate: j.day_rate,
        currency: j.currency,
        score,
        reasons,
      };
    });
    out.sort((a, b) => b.score - a.score);

    setRanked(out);
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
