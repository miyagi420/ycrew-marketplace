import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button, ErrorText, Field, H1, Screen, Subtle } from '@/components/ui';
import type { AppRole } from '@/lib/auth';
import { useAuth } from '@/lib/auth';

export default function SignUp() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const { signUp } = useAuth();

  const [role, setRole] = useState<AppRole>(params.role === 'OWNER' ? 'OWNER' : 'CREW');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageOk, setAgeOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!ageOk) {
      setError(t('auth.needAge'));
      return;
    }
    setBusy(true);
    const { error } = await signUp(email.trim(), password, role, name.trim());
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    router.replace('/');
  };

  const Chip = ({ value, label }: { value: AppRole; label: string }) => (
    <Pressable
      onPress={() => setRole(value)}
      className={`flex-1 items-center rounded-xl border py-3 ${
        role === value ? 'border-gold-400 bg-gold-400/15' : 'border-navy-500/40 bg-navy-800'
      }`}>
      <Text className={role === value ? 'font-semibold text-gold-200' : 'text-navy-100'}>{label}</Text>
    </Pressable>
  );

  return (
    <Screen>
      <View className="mt-6">
        <H1>{t('auth.signUpTitle')}</H1>
        <Subtle>{t('landing.subtitle')}</Subtle>

        <View className="mb-5 flex-row gap-3">
          <Chip value="CREW" label={t('auth.asCrew')} />
          <Chip value="OWNER" label={t('auth.asOwner')} />
        </View>

        <Field label={t('auth.name')} value={name} onChangeText={setName} autoCapitalize="words" />
        <Field
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Field
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable onPress={() => setAgeOk((v) => !v)} className="mb-5 flex-row items-center gap-3">
          <View
            className={`h-6 w-6 items-center justify-center rounded-md border ${
              ageOk ? 'border-gold-400 bg-gold-400' : 'border-navy-500/60'
            }`}>
            {ageOk ? <Text className="text-navy-900">✓</Text> : null}
          </View>
          <Text className="flex-1 text-sm text-navy-100">{t('auth.ageConfirm')}</Text>
        </Pressable>

        <View className="mb-4 flex-row gap-4">
          <Link href="/legal/terms" className="text-xs text-gold-300">
            {t('legal.terms')}
          </Link>
          <Link href="/legal/privacy" className="text-xs text-gold-300">
            {t('legal.privacy')}
          </Link>
        </View>

        <ErrorText>{error}</ErrorText>
        <Button title={t('auth.createAccount')} onPress={onSubmit} loading={busy} />

        <Link href="/(auth)/sign-in" className="mt-2 text-center text-sm text-gold-300">
          {t('auth.haveAccountShort')}
        </Link>
      </View>
    </Screen>
  );
}
