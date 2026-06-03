import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button, ErrorText, Field, H1, Screen, Subtle } from '@/components/ui';
import { useAuth } from '@/lib/auth';

export default function SignIn() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    router.replace('/');
  };

  return (
    <Screen>
      <View className="mt-10">
        <H1>{t('auth.signInTitle')}</H1>
        <Subtle>{t('landing.brand')}</Subtle>

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

        <ErrorText>{error}</ErrorText>
        <Button title={t('auth.doSignIn')} onPress={onSubmit} loading={busy} />

        <Link href="/(auth)/sign-up" className="mt-2 text-center text-sm text-blue-800">
          {t('auth.noAccount')}
        </Link>
      </View>
    </Screen>
  );
}
