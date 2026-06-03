import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button, Card, ErrorText, Field, H1, Pill, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { buildLocationDraft, upsertCrewLocation } from '@/lib/locations';
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
  const [locationLabel, setLocationLabel] = useState('');
  const [locationLat, setLocationLat] = useState('');
  const [locationLng, setLocationLng] = useState('');
  const [shareLocation, setShareLocation] = useState(true);
  const [certType, setCertType] = useState('');
  const [certs, setCerts] = useState<{ id: string; type: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadCerts = async () => {
    const { data } = await supabase.from('certifications').select('id, type').eq('crew_user_id', uid);
    setCerts(data ?? []);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('crew_profiles').select('*').eq('user_id', uid).maybeSingle();
      const { data: location } = await supabase
        .from('crew_locations')
        .select('label, lat, lng, share_with_owners')
        .eq('crew_user_id', uid)
        .maybeSingle();
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
      if (location) {
        setLocationLabel(location.label ?? '');
        setLocationLat(String(location.lat ?? ''));
        setLocationLng(String(location.lng ?? ''));
        setShareLocation(Boolean(location.share_with_owners));
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
    if (!error && (locationLabel.trim() || locationLat.trim() || locationLng.trim())) {
      const draft = buildLocationDraft(locationLabel, locationLat, locationLng, homeport || primaryRole || uid);
      await upsertCrewLocation(uid, draft, shareLocation);
    }
    setBusy(false);
    if (error) setError(error.message);
    else setSaved(true);
  };

  const addCert = async () => {
    if (!certType.trim()) return;
    await supabase.from('certifications').insert({ crew_user_id: uid, type: certType.trim().toUpperCase() });
    setCertType('');
    await loadCerts();
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()} className="mb-2 mt-2">
        <Text className="text-sm text-blue-800">‹ {t('common.back')}</Text>
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

      <Text className="mb-2 mt-4 text-xs uppercase text-slate-600">Location sharing</Text>
      <Card>
        <Text className="mb-3 text-base leading-relaxed text-slate-600">
          Add current port or preferred joining location. Owners see it only when sharing is on.
        </Text>
        <Field label="Current port" value={locationLabel} onChangeText={setLocationLabel} />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field label="Latitude" value={locationLat} onChangeText={setLocationLat} keyboardType="decimal-pad" />
          </View>
          <View className="flex-1">
            <Field label="Longitude" value={locationLng} onChangeText={setLocationLng} keyboardType="decimal-pad" />
          </View>
        </View>
        <Pressable onPress={() => setShareLocation((v) => !v)} className="flex-row items-center gap-3">
          <View
            className={`h-6 w-6 items-center justify-center rounded-md border ${
              shareLocation ? 'border-[#0F766E] bg-[#0F766E]' : 'border-slate-400'
            }`}>
            {shareLocation ? <Text className="text-white">✓</Text> : null}
          </View>
          <Text className="flex-1 text-base text-slate-700">Share location with owners</Text>
        </Pressable>
      </Card>

      <ErrorText>{error}</ErrorText>
      {saved ? (
        <View className="mb-3">
          <Pill tone="green">{t('crew.saved')}</Pill>
        </View>
      ) : null}
      <Button testID="save-profile" title={t('crew.save')} onPress={save} loading={busy} />

      <Text className="mb-2 mt-4 text-xs uppercase text-slate-600">{t('crew.certs')}</Text>
      <Card>
        {certs.length === 0 ? (
          <Text className="text-sm text-slate-500">—</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {certs.map((c) => (
              <Pill key={c.id}>{c.type}</Pill>
            ))}
          </View>
        )}
      </Card>
      <Field label={t('crew.addCert')} value={certType} onChangeText={setCertType} autoCapitalize="characters" />
      <Button title="+" variant="outline" onPress={addCert} />
    </Screen>
  );
}
