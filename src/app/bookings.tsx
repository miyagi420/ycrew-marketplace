import { useState } from 'react';
import { Text, View } from 'react-native';

import { FriendlyPage, PageHeader, SegmentedTabs } from '@/components/friendly';

export default function Bookings() {
  const [tab, setTab] = useState('Pending');
  return (
    <FriendlyPage activeTab="bookings">
      <PageHeader
        title="My Bookings"
        right={<Text className="text-4xl text-slate-800">i</Text>}
      />
      <SegmentedTabs
        tabs={['Pending', 'Approved', 'Confirmed', 'Completed']}
        active={tab}
        onChange={setTab}
      />
      <View className="flex-1 bg-white px-8 pt-12">
        <Text className="mb-5 text-4xl font-normal text-slate-950">
          No {tab.toLowerCase()} bookings
        </Text>
        <Text className="max-w-xl text-2xl leading-relaxed text-slate-900">
          Your booking requests that are waiting for the trip owner to review will appear here.
          The owner will decide whether to approve or decline your request.
        </Text>
      </View>
    </FriendlyPage>
  );
}
