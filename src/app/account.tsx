import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { FriendlyPage, InfoRow, PageHeader } from '@/components/friendly';
import { ErrorText } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function Account() {
  const router = useRouter();
  const { signOut, role } = useAuth();

  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async () => {
    setError(null);
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
    <FriendlyPage activeTab="account">
      <PageHeader title="More" />
      <View className="flex-1 bg-white pt-10">
        <InfoRow
          icon="♙"
          title="My Profile"
          subtitle="edit your profile"
          onPress={() => router.push(role === 'CREW' ? '/(crew)/profile' : '/(owner)')}
        />
        <InfoRow icon="♙" title="ID Verification" subtitle="verify your identity" badge />
        <InfoRow icon="⛵" title="My Boats" subtitle="manage your boats" onPress={() => router.push('/(owner)/post-job')} />
        <InfoRow
          icon="▭"
          title="Payment Methods"
          subtitle="manage your payment methods"
          onPress={() => router.push('/payment-success')}
        />
        <InfoRow icon="i" title="Term & Conditions" onPress={() => router.push('/legal/terms')} />
        <InfoRow icon="i" title="Privacy Policy" onPress={() => router.push('/legal/privacy')} />
        <InfoRow icon="✉" title="Contact Us" subtitle="hello@yachtcrew.test" />
        <InfoRow icon="⇩" title="Data Export" subtitle="download your account data" onPress={exportData} />

        <View className="mt-6 items-center px-8">
          <ErrorText>{error}</ErrorText>
          <Pressable
            disabled={busy}
            onPress={async () => {
              await signOut();
              router.replace('/');
            }}
            className="rounded-xl bg-indigo-100 px-14 py-4">
            <Text className="text-xl text-slate-950">Log Out</Text>
          </Pressable>
          <Pressable disabled={busy} onPress={deleteAccount} className="mt-10">
            <Text className="text-xl text-red-200">
              {confirming ? 'Tap again to delete' : 'Delete Account'}
            </Text>
          </Pressable>
        </View>
      </View>
    </FriendlyPage>
  );
}
