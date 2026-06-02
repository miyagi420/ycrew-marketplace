import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { Button, ErrorText, Field, H1, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const csv = (s: string) =>
  s
    .split(',')
    .map((x) => x.trim().toUpperCase())
    .filter(Boolean);

export default function PostJob() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const uid = session!.user.id;

  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [minExp, setMinExp] = useState('');
  const [dayRate, setDayRate] = useState('');
  const [certs, setCerts] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ensureOrg = async (): Promise<string | null> => {
    const { data: members } = await supabase
      .from('owner_org_members')
      .select('org_id')
      .eq('user_id', uid)
      .limit(1);
    if (members && members.length) return members[0].org_id;
    const orgName = (session!.user.user_metadata?.name as string | undefined)?.trim();
    const { data, error } = await supabase.rpc('create_owner_org', {
      p_name: orgName ? `${orgName}'s Fleet` : 'My Fleet',
      p_type: 'owner',
    });
    if (error) {
      setError(error.message);
      return null;
    }
    return data.id;
  };

  const submit = async (publish: boolean) => {
    setError(null);
    if (!title.trim() || !role.trim() || !startDate.trim()) {
      setError('Title, role and start date are required.');
      return;
    }
    setBusy(true);
    const orgId = await ensureOrg();
    if (!orgId) {
      setBusy(false);
      return;
    }
    const { error } = await supabase.from('jobs').insert({
      owner_org_id: orgId,
      title: title.trim(),
      role: role.trim(),
      contract_type: 'SEASONAL',
      start_date: startDate.trim(),
      min_exp_months: minExp ? parseInt(minExp, 10) : null,
      day_rate: dayRate ? Number(dayRate) : null,
      requires_cert_types: csv(certs),
      status: publish ? 'OPEN' : 'DRAFT',
      posted_at: publish ? new Date().toISOString() : null,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace('/(owner)');
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()} className="mb-2 mt-2">
        <Text className="text-sm text-gold-300">‹ {t('common.back')}</Text>
      </Pressable>
      <H1>{t('owner.postJob')}</H1>
      <Text className="mb-5 text-sm text-navy-100">{t('landing.subtitle')}</Text>

      <Field label={t('owner.jobTitle')} value={title} onChangeText={setTitle} />
      <Field label={t('owner.role')} value={role} onChangeText={setRole} />
      <Field
        label={t('owner.startDate')}
        value={startDate}
        onChangeText={setStartDate}
        autoCapitalize="none"
        placeholder="2026-06-15"
      />
      <Field label={t('owner.minExp')} value={minExp} onChangeText={setMinExp} keyboardType="number-pad" />
      <Field label={t('owner.dayRate')} value={dayRate} onChangeText={setDayRate} keyboardType="decimal-pad" />
      <Field label={t('owner.requiresCerts')} value={certs} onChangeText={setCerts} autoCapitalize="characters" />

      <ErrorText>{error}</ErrorText>
      <Button title={t('owner.publishNow')} onPress={() => submit(true)} loading={busy} />
      <Button title={t('owner.saveDraft')} variant="outline" onPress={() => submit(false)} loading={busy} />
    </Screen>
  );
}
