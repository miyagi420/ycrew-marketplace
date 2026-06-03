import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FriendlyPage, PageHeader, SegmentedTabs } from '@/components/friendly';
import { VoyageMap } from '@/components/voyage-map';
import { Button, Card, Pill } from '@/components/ui';
import { fetchCrewLocationPoints, type MapPoint } from '@/lib/locations';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type OwnerJob = { id: string; title: string; role: string; status: string };

export default function OwnerHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, signOut } = useAuth();
  const uid = session!.user.id;

  const [jobs, setJobs] = useState<OwnerJob[]>([]);
  const [crewPoints, setCrewPoints] = useState<MapPoint[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<MapPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Active');

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: members }, sharedCrew] = await Promise.all([
      supabase.from('owner_org_members').select('org_id').eq('user_id', uid),
      fetchCrewLocationPoints(),
    ]);
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
    setCrewPoints(sharedCrew);
    setSelectedCrew((current) => current ?? sharedCrew[0] ?? null);
    setLoading(false);
  }, [uid]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    const topic = `owner-voyage-desk-${uid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(topic)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crew_locations' }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return (
    <FriendlyPage activeTab="trips">
      <PageHeader
        title="Voyage Desk"
        right={
          <Pressable
            onPress={async () => {
              await signOut();
              router.replace('/');
            }}>
            <Text className="text-base text-[#5C6E7A]">Sign out</Text>
          </Pressable>
        }
      />
      <SegmentedTabs tabs={['Active', 'Crew Map', 'Archived']} active={tab} onChange={setTab} />
      <ScrollView
        className="flex-1 bg-[#F7F4ED]"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#0F766E" />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: insets.bottom + 28 }}>
        {tab === 'Crew Map' ? (
          <View>
            <Text className="mb-2 text-3xl font-semibold text-[#162B3A]">Shared crew locations</Text>
            <Text className="mb-4 text-base leading-relaxed text-[#5C6E7A]">
              Crew appears here only after they save a location and allow owners to see it.
            </Text>
            <VoyageMap points={crewPoints} selectedId={selectedCrew?.id} onSelect={setSelectedCrew} audience="owner" />
            <View className="-mt-12 rounded-[28px] bg-white p-5 shadow">
              <Text className="text-xl font-semibold text-[#162B3A]">
                {selectedCrew?.title ?? 'No shared crew yet'}
              </Text>
              <Text className="mt-1 text-base text-[#5C6E7A]">
                {selectedCrew?.subtitle ?? 'Ask crew to add current port or preferred joining location.'}
              </Text>
            </View>
          </View>
        ) : null}

        {tab !== 'Crew Map' && jobs.length === 0 && !loading ? (
          <View className="pt-16">
            <Text className="mb-6 text-4xl font-semibold leading-tight text-[#162B3A]">
              Build your first voyage offer
            </Text>
            <Benefit label="Broadcast" text="Publish a real port location so crew can discover your route on the map." />
            <Benefit label="Realtime" text="Vessel and offer markers update as saved positions change." />
            <Benefit label="Privacy" text="Crew locations stay hidden until each crew member shares them." />
            <View className="mt-8 w-56">
              <Button title="Post a job" onPress={() => router.push('/(owner)/post-job')} />
            </View>
          </View>
        ) : null}

        {tab !== 'Crew Map' && jobs.length > 0 ? (
          <View>
            <View className="mb-4">
              <Button title="Post a job" onPress={() => router.push('/(owner)/post-job')} />
            </View>
            {jobs.map((j) => (
              <Pressable key={j.id} onPress={() => router.push(`/(owner)/job/${j.id}`)}>
                <Card>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text className="text-2xl font-semibold text-[#162B3A]">{j.title}</Text>
                      <Text className="mt-1 text-base text-[#5C6E7A]">{j.role}</Text>
                    </View>
                    <Pill tone={j.status === 'OPEN' ? 'green' : 'muted'}>{j.status}</Pill>
                  </View>
                  <Text className="mt-3 text-base font-semibold text-[#E66E3A]">View candidates {'>'}</Text>
                </Card>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </FriendlyPage>
  );
}

function Benefit({ label, text }: { label: string; text: string }) {
  return (
    <View className="mb-4 rounded-2xl border border-white bg-white p-4 shadow-sm">
      <Text className="text-base font-semibold uppercase text-[#E66E3A]">{label}</Text>
      <Text className="mt-2 text-xl leading-snug text-[#162B3A]">{text}</Text>
    </View>
  );
}
