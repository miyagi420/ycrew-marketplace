import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/lib/auth';

export default function TripsRedirect() {
  const { loading, role } = useAuth();
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#1E3A8A" />
      </View>
    );
  }
  return <Redirect href={role === 'OWNER' || role === 'AGENCY' ? '/(owner)' : '/(crew)/applications'} />;
}
