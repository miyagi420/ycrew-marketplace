import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Pill } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type AppRow = {
  id: string;
  status: string;
  created_at: string;
  job_id: string;
  job: { title: string; role: string } | null;
};

export default function CrewApplications() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const uid = session!.user.id;

  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('applications')
        .select('id, status, created_at, job_id, job:jobs(title, role)')
        .eq('crew_user_id', uid)
        .order('created_at', { ascending: false });
      setRows((data ?? []) as unknown as AppRow[]);
      setLoading(false);
    })();
  }, [uid]);

  const message = async (jobId: string) => {
    const { data } = await supabase.rpc('job_owner', { p_job: jobId });
    if (data) router.push(`/chat/${data}`);
  };

  const tone = (status: string) =>
    status === 'ACCEPTED' || status === 'OFFER'
      ? 'green'
      : status === 'REJECTED' || status === 'WITHDRAWN'
        ? 'muted'
        : 'gold';

  return (
    <View className="flex-1 bg-navy-900" style={{ paddingTop: insets.top + 12 }}>
      <View className="px-5 pb-3">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-sm text-gold-300">‹ {t('common.back')}</Text>
        </Pressable>
        <Text className="text-2xl font-semibold text-white">{t('crew.applicationsTitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        {rows.length === 0 && !loading ? (
          <Text className="mt-10 text-center text-navy-100">{t('crew.noApplications')}</Text>
        ) : null}

        {rows.map((a) => (
          <Card key={a.id}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-lg font-semibold text-white">{a.job?.title ?? '—'}</Text>
                <Text className="text-sm text-navy-100">{a.job?.role ?? ''}</Text>
              </View>
              <Pill tone={tone(a.status)}>{a.status}</Pill>
            </View>
            <Pressable onPress={() => message(a.job_id)} className="mt-3 self-start">
              <Text className="text-sm text-gold-300">{t('common.message')} ›</Text>
            </Pressable>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
