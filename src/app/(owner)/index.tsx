import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Pill } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type OwnerJob = { id: string; title: string; role: string; status: string };

export default function OwnerHome() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, signOut } = useAuth();
  const uid = session!.user.id;

  const [jobs, setJobs] = useState<OwnerJob[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: members } = await supabase
      .from('owner_org_members')
      .select('org_id')
      .eq('user_id', uid);
    const orgIds = (members ?? []).map((m) => m.org_id);
    if (orgIds.length) {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, role, status')
        .in('owner_org_id', orgIds)
        .order('created_at', { ascending: false });
      setJobs(data ?? []);
    } else {
      setJobs([]);
    }
    setLoading(false);
  }, [uid]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View className="flex-1 bg-navy-900" style={{ paddingTop: insets.top + 12 }}>
      <View className="flex-row items-center justify-between px-5 pb-3">
        <Text className="text-2xl font-semibold text-white">{t('owner.jobs')}</Text>
        <Pressable
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}>
          <Text className="text-sm text-navy-100">{t('common.signOut')}</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#DBBC76" />}>
        <View className="mb-4">
          <Button title={t('owner.postJob')} onPress={() => router.push('/(owner)/post-job')} />
        </View>

        {jobs.length === 0 && !loading ? (
          <Text className="mt-10 text-center text-navy-100">{t('owner.noJobs')}</Text>
        ) : null}

        {jobs.map((j) => (
          <Pressable key={j.id} onPress={() => router.push(`/(owner)/job/${j.id}`)}>
            <Card>
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-lg font-semibold text-white">{j.title}</Text>
                  <Text className="text-sm text-navy-100">{j.role}</Text>
                </View>
                <Pill tone={j.status === 'OPEN' ? 'green' : 'muted'}>{j.status}</Pill>
              </View>
              <Text className="mt-2 text-xs text-gold-300">{t('owner.viewCandidates')} ›</Text>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
