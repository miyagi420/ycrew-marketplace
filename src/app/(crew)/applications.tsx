import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FriendlyPage, PageHeader, SegmentedTabs } from '@/components/friendly';
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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const uid = session!.user.id;

  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Active');

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
    <FriendlyPage activeTab="trips">
      <PageHeader title="My Trips" />
      <SegmentedTabs tabs={['Active', 'Rejected', 'Archived']} active={tab} onChange={setTab} />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingHorizontal: 30, paddingTop: 70, paddingBottom: insets.bottom + 28 }}>
        {rows.length === 0 && !loading ? (
          <View>
            <Text className="mb-6 text-4xl font-normal leading-tight text-slate-950">
              Ready to join your first trip?
            </Text>
            <Text className="mb-5 text-2xl leading-snug text-slate-900">
              Browse open yacht roles, apply in one tap, and keep every request here.
            </Text>
            <Pressable onPress={() => router.push('/')} className="mt-6 self-start rounded-xl bg-blue-800 px-8 py-4">
              <Text className="text-xl text-white">Browse trips</Text>
            </Pressable>
          </View>
        ) : null}

        {rows.map((a) => (
          <Card key={a.id}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-2xl font-medium text-slate-950">{a.job?.title ?? '-'}</Text>
                <Text className="mt-1 text-base text-slate-500">{a.job?.role ?? ''}</Text>
              </View>
              <Pill tone={tone(a.status)}>{a.status}</Pill>
            </View>
            <Pressable onPress={() => message(a.job_id)} className="mt-3 self-start">
              <Text className="text-base text-blue-800">Message {'>'}</Text>
            </Pressable>
          </Card>
        ))}
      </ScrollView>
    </FriendlyPage>
  );
}
