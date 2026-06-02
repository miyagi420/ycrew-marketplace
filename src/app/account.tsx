import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, Text, View } from 'react-native';

import { Button, Card, ErrorText, H1, Pill, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function Account() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signOut } = useAuth();

  const [busy, setBusy] = useState(false);
  const [exported, setExported] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async () => {
    setError(null);
    setExported(false);
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('account', { body: { action: 'export' } });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (Platform.OS === 'web') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = globalThis as any;
      const blob = new g.Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const href = g.URL.createObjectURL(blob);
      const a = g.document.createElement('a');
      a.href = href;
      a.download = 'my-yachtcrew-data.json';
      a.click();
      g.URL.revokeObjectURL(href);
    }
    setExported(true);
  };

  const deleteAccount = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setBusy(true);
    const { error } = await supabase.functions.invoke('account', { body: { action: 'delete' } });
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    await signOut();
    router.replace('/');
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()} className="mb-2 mt-2">
        <Text className="text-sm text-gold-300">‹ {t('common.back')}</Text>
      </Pressable>
      <H1>{t('account.title')}</H1>
      <View className="h-4" />

      <Card>
        <Text className="mb-1 text-base font-semibold text-white">{t('account.exportData')}</Text>
        <Text className="mb-3 text-sm text-navy-100">{t('account.exportDesc')}</Text>
        {exported ? (
          <View className="mb-3">
            <Pill tone="green">{t('account.exported')}</Pill>
          </View>
        ) : null}
        <Button title={t('account.exportData')} variant="outline" onPress={exportData} loading={busy} />
      </Card>

      <Card>
        <Text className="mb-1 text-base font-semibold text-white">{t('account.deleteAccount')}</Text>
        <Text className="mb-3 text-sm text-navy-100">{t('account.deleteDesc')}</Text>
        <ErrorText>{error}</ErrorText>
        <Pressable
          onPress={deleteAccount}
          disabled={busy}
          className={`items-center rounded-2xl border py-4 ${
            confirming ? 'border-red-400 bg-red-500/15' : 'border-red-400/40'
          }`}>
          <Text className="text-base font-semibold text-red-300">
            {confirming ? t('account.confirmDelete') : t('account.deleteAccount')}
          </Text>
        </Pressable>
      </Card>

      <View className="mt-4 flex-row justify-center gap-4">
        <Pressable onPress={() => router.push('/legal/privacy')}>
          <Text className="text-sm text-gold-300">{t('legal.privacy')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/legal/terms')}>
          <Text className="text-sm text-gold-300">{t('legal.terms')}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
