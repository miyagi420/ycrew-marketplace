import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Pill } from '@/components/ui';
import { type Candidate, getCandidatesForJob } from '@/lib/match-service';
import { matchTier } from '@/lib/matching';
import { supabase } from '@/lib/supabase';

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
      const [{ data: job }, cands] = await Promise.all([
        supabase.from('jobs').select('title').eq('id', id).maybeSingle(),
        getCandidatesForJob(id),
      ]);
      setJobTitle(job?.title ?? '');
      setCandidates(cands);
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
