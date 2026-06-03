import { Text, View } from 'react-native';

import { FriendlyPage, PageHeader } from '@/components/friendly';

export default function Messages() {
  return (
    <FriendlyPage activeTab="messages">
      <PageHeader title="Messages" />
      <View className="flex-1 bg-white px-8 pt-20">
        <Text className="mb-5 text-4xl font-normal text-slate-950">No messages yet</Text>
        <Text className="max-w-xl text-2xl leading-relaxed text-slate-900">
          Conversations with trip owners and crew will appear here after an application or booking
          request starts.
        </Text>
      </View>
    </FriendlyPage>
  );
}
