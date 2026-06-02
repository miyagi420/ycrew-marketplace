import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button, Card, ErrorText, Field, H1, Pill, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { certStatus } from '@/lib/certs';
import { supabase } from '@/lib/supabase';

const csv = (s: string) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

export default function CrewProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const uid = session!.user.id;

  const [primaryRole, setPrimaryRole] = useState('');
  const [experience, setExperience] = useState('');
  const [homeport, setHomeport] = useState('');
  const [languages, setLanguages] = useState('');
  const [boatTypes, setBoatTypes] = useState('');
  const [minDayRate, setMinDayRate] = useState('');
  const [availFrom, setAvailFrom] = useState('');
  const [availTo, setAvailTo] = useState('');
  const [certType, setCertType] = useState('');
  const [certExpiry, setCertExpiry] = useState('');
  const [certs, setCerts] = useState<{ id: string; type: string; expiry_date: string | null }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadCerts = async () => {
    const { data } = await supabase
      .from('certifications')
      .select('id, type, expiry_date')
      .eq('crew_user_id', uid);
    setCerts(data ?? []);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('crew_profiles').select('*').eq('user_id', uid).maybeSingle();
      if (data) {
        setPrimaryRole(data.primary_role ?? '');
        setExperience(String(data.experience_months ?? ''));
        setHomeport(data.homeport ?? '');
        setLanguages((data.languages ?? []).join(', '));
        setBoatTypes((data.boat_types ?? []).join(', '));
        setMinDayRate(data.min_day_rate != null ? String(data.min_day_rate) : '');
        setAvailFrom(data.availability_start ?? '');
        setAvailTo(data.availability_end ?? '');
      }
      await loadCerts();
    })();
  }, [uid]);

  const save = async () => {
    setError(null);
    setSaved(false);
    setBusy(true);
    const completeness = [primaryRole, experience, homeport, languages, boatTypes].filter(Boolean).length;
    const { error } = await supabase
      .from('crew_profiles')
      .update({
        primary_role: primaryRole,
        experience_months: experience ? parseInt(experience, 10) : 0,
        homeport: homeport || null,
        languages: csv(languages),
        boat_types: csv(boatTypes),
        min_day_rate: minDayRate ? Number(minDayRate) : null,
        availability_start: availFrom || null,
        availability_end: availTo || null,
        profile_completeness: Math.round((completeness / 5) * 100),
      })
      .eq('user_id', uid);
    setBusy(false);
    if (error) setError(error.message);
    else setSaved(true);
  };

  const addCert = async () => {
    if (!certType.trim()) return;
    await supabase.from('certifications').insert({
      crew_user_id: uid,
      type: certType.trim().toUpperCase(),
      expiry_date: certExpiry.trim() || null,
    });
    setCertType('');
    setCertExpiry('');
    await loadCerts();
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()} className="mb-2 mt-2">
        <Text className="text-sm text-gold-300">‹ {t('common.back')}</Text>
      </Pressable>
      <H1>{t('crew.profileTitle')}</H1>
      <View className="h-3" />

      <Field testID="primary-role" label={t('crew.primaryRole')} value={primaryRole} onChangeText={setPrimaryRole} />
      <Field
        testID="experience"
        label={t('crew.experienceMonths')}
        value={experience}
        onChangeText={setExperience}
        keyboardType="number-pad"
      />
      <Field label={t('crew.homeport')} value={homeport} onChangeText={setHomeport} />
      <Field label={t('crew.languagesCsv')} value={languages} onChangeText={setLanguages} />
      <Field label={t('crew.boatTypesCsv')} value={boatTypes} onChangeText={setBoatTypes} />
      <Field
        label={t('crew.minDayRate')}
        value={minDayRate}
        onChangeText={setMinDayRate}
        keyboardType="decimal-pad"
      />
      <Field label={t('crew.availFrom')} value={availFrom} onChangeText={setAvailFrom} autoCapitalize="none" />
      <Field label={t('crew.availTo')} value={availTo} onChangeText={setAvailTo} autoCapitalize="none" />

      <ErrorText>{error}</ErrorText>
      {saved ? (
        <View className="mb-3">
          <Pill tone="green">{t('crew.saved')}</Pill>
        </View>
      ) : null}
      <Button testID="save-profile" title={t('crew.save')} onPress={save} loading={busy} />

      <Text className="mb-2 mt-4 text-xs uppercase tracking-wide text-gold-300">{t('crew.certs')}</Text>
      <Card>
        {certs.length === 0 ? (
          <Text className="text-sm text-navy-100">—</Text>
        ) : (
          <View className="gap-2">
            {certs.map((c) => {
              const s = certStatus(c.expiry_date);
              const tone =
                s === 'expired'
                  ? 'bg-red-500/15 text-red-300'
                  : s === 'expiring'
                    ? 'bg-amber-500/15 text-amber-300'
                    : s === 'valid'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-white/10 text-navy-100';
              return (
                <View key={c.id} className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-white">{c.type}</Text>
                  {s === 'none' ? null : (
                    <View className={`rounded-full px-2.5 py-1 ${tone.split(' ')[0]}`}>
                      <Text className={`text-xs ${tone.split(' ')[1]}`}>{t(`certStatus.${s}`)}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </Card>
      <Field label={t('crew.addCert')} value={certType} onChangeText={setCertType} autoCapitalize="characters" />
      <Field
        label={t('crew.certExpiry')}
        value={certExpiry}
        onChangeText={setCertExpiry}
        autoCapitalize="none"
        placeholder="2027-01-31"
      />
      <Button title="+" variant="outline" onPress={addCert} />
    </Screen>
  );
}
