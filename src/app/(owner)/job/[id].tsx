import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Pill } from '@/components/ui';
import { type Candidate, getCandidatesForJob } from '@/lib/match-service';
import { matchTier } from '@/lib/matching';
import { supabase } from '@/lib/supabase';

type Action = { label: string; status: string };

function nextActions(status: string): Action[] {
  switch (status) {
    case 'APPLIED':
      return [
        { label: 'Shortlist', status: 'SHORTLISTED' },
        { label: 'Reject', status: 'REJECTED' },
      ];
    case 'SHORTLISTED':
      return [
        { label: 'Interview', status: 'INTERVIEW' },
        { label: 'Reject', status: 'REJECTED' },
      ];
    case 'INTERVIEW':
      return [
        { label: 'Offer', status: 'OFFER' },
        { label: 'Reject', status: 'REJECTED' },
      ];
    case 'OFFER':
      return [
        { label: 'Accept', status: 'ACCEPTED' },
        { label: 'Reject', status: 'REJECTED' },
      ];
    default:
      return [];
  }
}

export default function JobCandidates() {
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

  const setStatus = async (userId: string, status: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: status as never })
      .eq('job_id', id)
      .eq('crew_user_id', userId);
    if (!error) {
      setCandidates((prev) =>
        prev.map((c) => (c.userId === userId ? { ...c, appliedStatus: status } : c)),
      );
    }
  };

  const applicants = candidates.filter((c) => c.appliedStatus);
  const others = candidates.filter((c) => !c.appliedStatus);

  const renderCard = (c: Candidate, withActions: boolean) => (
    <Card key={c.userId}>
      <View className="mb-2 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-semibold text-slate-950">{c.name}</Text>
          <Text className="text-sm text-slate-500">{c.role}</Text>
        </View>
        <View className="items-end gap-1">
          <Pill tone={c.score >= 75 ? 'green' : 'gold'}>
            {c.score}% {matchTier(c.score)}
          </Pill>
          {c.appliedStatus ? <Pill tone="muted">{c.appliedStatus}</Pill> : null}
        </View>
      </View>
      {c.reasons.slice(0, 3).map((r) => (
        <Text key={r} className="text-xs text-slate-600">
          - {r}
        </Text>
      ))}
      <Pressable onPress={() => router.push(`/chat/${c.userId}`)} className="mt-3 self-start">
        <Text className="text-sm text-blue-800">Message {'>'}</Text>
      </Pressable>
      {withActions && c.appliedStatus ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {nextActions(c.appliedStatus).map((a) => (
            <Pressable
              key={a.status}
              onPress={() => setStatus(c.userId, a.status)}
              className={`rounded-xl px-3 py-2 ${
                a.status === 'REJECTED' ? 'border border-red-400/40' : 'bg-blue-800'
              }`}>
              <Text className={`text-sm font-semibold ${a.status === 'REJECTED' ? 'text-red-600' : 'text-white'}`}>
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </Card>
  );

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <View className="px-5 pb-3">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-sm text-blue-800">‹ Back</Text>
        </Pressable>
        <Text className="text-2xl font-semibold text-slate-950">Candidates</Text>
        <Text className="text-sm text-slate-500">{jobTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        {applicants.length > 0 ? (
          <>
            <Text className="mb-2 text-xs uppercase text-slate-600">
              Applicants ({applicants.length})
            </Text>
            {applicants.map((c) => renderCard(c, true))}
          </>
        ) : null}

        <Text className="mb-2 mt-4 text-xs uppercase text-slate-600">All candidates</Text>
        {others.length === 0 && !loading ? (
          <Text className="mt-4 text-center text-slate-500">No candidates yet.</Text>
        ) : null}
        {others.map((c) => renderCard(c, false))}
      </ScrollView>
    </View>
  );
}
