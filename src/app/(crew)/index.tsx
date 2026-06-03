import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FriendlyPage } from '@/components/friendly';
import { VoyageMap } from '@/components/voyage-map';
import { Button, Card, Pill } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import {
  fallbackLocation,
  fetchJobLocationPoints,
  fetchVesselPositionPoints,
  type MapPoint,
} from '@/lib/locations';
import { getRankedJobsForCrew, type RankedJob } from '@/lib/match-service';
import { matchTier } from '@/lib/matching';
import { supabase } from '@/lib/supabase';

export default function CrewHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const uid = session!.user.id;

  const [ranked, setRanked] = useState<RankedJob[]>([]);
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'map' | 'list'>('map');

  const load = useCallback(async () => {
    setLoading(true);
    const [jobs, { data: apps }, jobPoints, vesselPoints] = await Promise.all([
      getRankedJobsForCrew(uid),
      supabase.from('applications').select('job_id').eq('crew_user_id', uid),
      fetchJobLocationPoints(),
      fetchVesselPositionPoints(),
    ]);

    const locatedJobIds = new Set(jobPoints.map((point) => point.id));
    const fallbackJobPoints = jobs
      .filter((job) => !locatedJobIds.has(job.id))
      .map<MapPoint>((job) => {
        const loc = fallbackLocation(job.title);
        return {
          id: job.id,
          kind: 'job',
          title: job.title,
          subtitle: `${job.role} - ${loc.label}`,
          lat: loc.lat,
          lng: loc.lng,
          status: 'OPEN',
        };
      });
    const nextPoints = [...jobPoints, ...fallbackJobPoints, ...vesselPoints];

    setRanked(jobs);
    setApplied(new Set((apps ?? []).map((a) => a.job_id)));
    setMapPoints(nextPoints);
    setSelectedPoint((current) => current ?? nextPoints[0] ?? null);
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const topic = `browse-map-locations-${uid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(topic)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_locations' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vessel_positions' }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const apply = async (jobId: string) => {
    const { error } = await supabase.from('applications').insert({ job_id: jobId, crew_user_id: uid });
    if (!error) setApplied((prev) => new Set(prev).add(jobId));
  };

  return (
    <FriendlyPage activeTab="browse">
      <ScrollView
        className="flex-1 bg-[#F7F4ED]"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#0F766E" />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View className="bg-[#F7F4ED] px-4 pt-5">
          <View className="absolute left-6 right-6 top-8 z-10 flex-row justify-between">
            <MapButton title={view === 'map' ? 'List' : 'Map'} icon="☰" onPress={() => setView(view === 'map' ? 'list' : 'map')} />
            <MapButton title="Filter" icon="⌄" onPress={() => router.push('/(crew)/profile')} />
          </View>

          {view === 'map' ? (
            <View className="pt-16">
              <VoyageMap points={mapPoints} selectedId={selectedPoint?.id} onSelect={setSelectedPoint} />
              <TripPreview
                point={selectedPoint ?? mapPoints[0]}
                job={ranked.find((job) => job.id === selectedPoint?.id) ?? ranked[0]}
              />
            </View>
          ) : (
            <View className="pt-24">
              <Text className="px-2 text-4xl font-semibold text-[#162B3A]">Open voyages</Text>
              <Text className="px-2 pb-4 pt-2 text-base text-[#5C6E7A]">
                Same live offers, shown as a scannable list.
              </Text>
            </View>
          )}
        </View>

        <View className="px-5 pt-6">
          <View className="mb-5 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-3xl font-semibold text-[#162B3A]">
                {view === 'map' ? 'Voyage board' : 'Available roles'}
              </Text>
              <Text className="mt-1 text-base text-[#5C6E7A]">
                Live offer locations update from Supabase in realtime.
              </Text>
            </View>
            <Pressable onPress={() => router.push('/(crew)/profile')} testID="nav-profile">
              <Text className="text-base font-semibold text-[#E66E3A]">Profile</Text>
            </Pressable>
          </View>

          {ranked.length === 0 && !loading ? (
            <Card>
              <Text className="text-2xl text-[#162B3A]">No open trips yet</Text>
              <Text className="mt-2 text-base leading-relaxed text-[#5C6E7A]">
                Complete your profile and shared voyage locations will appear here.
              </Text>
            </Card>
          ) : null}

          {ranked.map((j) => (
            <Card key={j.id}>
              <View className="mb-2 flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-2xl font-semibold text-[#162B3A]">{j.title}</Text>
                  <Text className="text-base text-[#5C6E7A]">{j.role}</Text>
                </View>
                <Pill tone={j.score >= 75 ? 'green' : 'gold'}>
                  {j.score}% {matchTier(j.score)}
                </Pill>
              </View>
              {j.day_rate ? (
                <Text className="mb-2 text-base font-semibold text-[#0F766E]">
                  {j.currency} {j.day_rate}/day
                </Text>
              ) : null}
              {j.reasons.slice(0, 3).map((r) => (
                <Text key={r} className="text-sm leading-relaxed text-[#5C6E7A]">
                  - {r}
                </Text>
              ))}
              <View className="mt-4">
                {applied.has(j.id) ? (
                  <Pill tone="muted">Applied</Pill>
                ) : (
                  <Button testID="apply" title="Apply" onPress={() => apply(j.id)} />
                )}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </FriendlyPage>
  );
}

function MapButton({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center rounded-full bg-white/95 px-6 py-3 shadow">
      <Text className="mr-3 text-xl text-[#162B3A]">{icon}</Text>
      <Text className="text-lg font-semibold text-[#162B3A]">{title}</Text>
    </Pressable>
  );
}

function TripPreview({ point, job }: { point?: MapPoint; job?: RankedJob }) {
  return (
    <View className="-mt-28 mx-4 rounded-[28px] border border-white/70 bg-white p-5 shadow-lg">
      <View className="mb-4 flex-row items-center">
        <View className="mr-3 h-9 w-9 rounded-full bg-[#F5A55A]" />
        <Text className="flex-1 text-xl font-semibold text-[#162B3A]">
          {point?.title ?? job?.title ?? 'New voyage'}
        </Text>
      </View>
      <View className="h-px bg-slate-200" />
      <View className="flex-row items-center justify-between py-3">
        <View className="flex-row items-center">
          <Text className="mr-4 text-2xl text-[#0F766E]">▶</Text>
          <View>
            <Text className="text-2xl text-[#162B3A]">{point?.subtitle ?? 'Open role'}</Text>
            <Text className="text-lg text-[#5C6E7A]">{job?.role ?? point?.kind ?? 'Crew needed'}</Text>
          </View>
        </View>
        <Text className="rounded-full bg-[#EAF5F3] px-3 py-1 text-sm font-semibold text-[#0F766E]">
          {point?.kind === 'vessel' ? 'Vessel' : 'Offer'}
        </Text>
      </View>
      <Text className="text-center text-base text-slate-400">Tap markers to inspect live positions</Text>
    </View>
  );
}
