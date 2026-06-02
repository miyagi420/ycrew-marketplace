import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Pill } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { getThreads, type Thread } from '@/lib/messages';

export default function Messages() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const uid = session!.user.id;

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setThreads(await getThreads(uid));
    setLoading(false);
  }, [uid]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View className="flex-1 bg-navy-900" style={{ paddingTop: insets.top + 12 }}>
      <View className="px-5 pb-3">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-sm text-gold-300">‹ {t('common.back')}</Text>
        </Pressable>
        <Text className="text-2xl font-semibold text-white">{t('inbox.title')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#DBBC76" />}>
        {threads.length === 0 && !loading ? (
          <Text className="mt-10 text-center text-navy-100">{t('inbox.empty')}</Text>
        ) : null}

        {threads.map((th) => (
          <Pressable key={th.threadId} onPress={() => router.push(`/chat/${th.otherId}`)}>
            <Card>
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 pr-3 text-base font-semibold text-white">
                  {th.name ?? t('inbox.conversation')}
                </Text>
                {th.unread > 0 ? <Pill tone="gold">{th.unread}</Pill> : null}
              </View>
              <Text className="mt-1 text-sm text-navy-100" numberOfLines={1}>
                {th.lastBody}
              </Text>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
