import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/lib/auth';

export default function OwnerLayout() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-navy-900">
        <ActivityIndicator color="#DBBC76" />
      </View>
    );
  }
  if (!session) return <Redirect href="/(auth)/sign-in" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
