import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Pill } from '@/components/ui';
import {
  calculateMatchScore,
  type CrewForMatch,
  type JobForMatch,
  matchTier,
} from '@/lib/matching';
import { supabase } from '@/lib/supabase';

type Candidate = {
  userId: string;
  name: string;
  role: string;
  score: number;
  reasons: string[];
  appliedStatus: string | null;
};

export default function JobCandidates() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [jobTitle, setJobTitle] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: job } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
      if (!job) {
        setLoading(false);
        return;
      }
      setJobTitle(job.title);

      let vesselType: string | null = null;
      if (job.vessel_id) {
        const { data: v } = await supabase.from('vessels').select('type').eq('id', job.vessel_id).maybeSingle();
        vesselType = v?.type ?? null;
      }
      const forMatch: JobForMatch = {
        role: job.role,
        requires_cert_types: job.requires_cert_types,
        min_exp_months: job.min_exp_months,
        start_date: job.start_date,
        itinerary: job.itinerary,
        vessel: vesselType ? { type: vesselType } : null,
      };

      const [{ data: crews }, { data: apps }] = await Promise.all([
        supabase.from('crew_profiles').select('*, certifications(type)'),
        supabase.from('applications').select('crew_user_id, status').eq('job_id', id),
      ]);
      const appMap = new Map<string, string>();
      (apps ?? []).forEach((a) => appMap.set(a.crew_user_id, a.status));

      const out: Candidate[] = (crews ?? []).map((c) => {
        const { score, reasons } = calculateMatchScore(c as unknown as CrewForMatch, forMatch);
        return {
          userId: c.user_id,
          name: c.name || 'Crew member',
          role: c.primary_role || '—',
          score,
          reasons,
          appliedStatus: appMap.get(c.user_id) ?? null,
        };
      });
      out.sort((a, b) => b.score - a.score);
      setCandidates(out);
      setLoading(false);
    })();
  }, [id]);

  return (
    <View className="flex-1 bg-navy-900" style={{ paddingTop: insets.top + 12 }}>
      <View className="px-5 pb-3">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-sm text-gold-300">‹ {t('common.back')}</Text>
        </Pressable>
        <Text className="text-2xl font-semibold text-white">{t('owner.candidates')}</Text>
        <Text className="text-sm text-navy-100">{jobTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        {candidates.length === 0 && !loading ? (
          <Text className="mt-10 text-center text-navy-100">{t('owner.noCandidates')}</Text>
        ) : null}

        {candidates.map((c) => (
          <Card key={c.userId}>
            <View className="mb-2 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-lg font-semibold text-white">{c.name}</Text>
                <Text className="text-sm text-navy-100">{c.role}</Text>
              </View>
              <View className="items-end gap-1">
                <Pill tone={c.score >= 75 ? 'green' : 'gold'}>
                  {c.score}% {matchTier(c.score)}
                </Pill>
                {c.appliedStatus ? <Pill tone="muted">{c.appliedStatus}</Pill> : null}
              </View>
            </View>
            {c.reasons.slice(0, 3).map((r) => (
              <Text key={r} className="text-xs text-navy-100">
                • {r}
              </Text>
            ))}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
