import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type TabKey = 'browse' | 'trips' | 'bookings' | 'messages' | 'account';

const nav = [
  { key: 'browse', label: 'Harbor', icon: '⌁', href: '/' },
  { key: 'trips', label: 'Voyages', icon: '≋', href: '/trips' },
  { key: 'bookings', label: 'Berths', icon: '▣', href: '/bookings' },
  { key: 'messages', label: 'Comms', icon: '□', href: '/messages' },
  { key: 'account', label: 'More', icon: '◉', href: '/account' },
] as const;

export function FriendlyPage({
  children,
  activeTab,
}: {
  children: ReactNode;
  activeTab?: TabKey;
}) {
  return (
    <View className="flex-1 bg-[#F7F4ED]">
      <View className="flex-1">{children}</View>
      {activeTab ? <BottomNav active={activeTab} /> : null}
    </View>
  );
}

export function PageHeader({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="border-b border-[#E7DED1] bg-[#F7F4ED] px-6 pb-4"
      style={{ paddingTop: insets.top + 18 }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-4xl font-semibold text-[#162B3A]">{title}</Text>
        {right}
      </View>
    </View>
  );
}

export function BackHeader({ onBack, right }: { onBack: () => void; right?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-center justify-between border-b border-[#E7DED1] bg-[#F7F4ED] px-6 pb-4"
      style={{ paddingTop: insets.top + 18 }}>
      <Pressable onPress={onBack} className="h-10 w-10 items-center justify-center">
        <Text className="text-4xl text-[#162B3A]">‹</Text>
      </Pressable>
      {right ?? <View className="h-10 w-10" />}
    </View>
  );
}

export function BottomNav({ active }: { active: TabKey }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-[#E7DED1] bg-[#FFFDF8] px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}>
      <View className="flex-row justify-between">
        {nav.map((item) => {
          const selected = active === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => router.push(item.href)}
              className="min-w-0 flex-1 items-center py-1">
              <View className="relative">
                <Text className={`text-3xl ${selected ? 'text-[#E66E3A]' : 'text-[#334B5C]'}`}>
                  {item.icon}
                </Text>
                {item.key === 'account' ? (
                  <View className="absolute -right-1 -top-1 h-4 w-4 items-center justify-center rounded-full bg-[#E66E3A]">
                    <Text className="text-[10px] font-semibold text-white">!</Text>
                  </View>
                ) : null}
              </View>
              <Text
                className={`mt-0.5 text-sm ${selected ? 'text-[#E66E3A]' : 'text-[#334B5C]'}`}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function SegmentedTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <View className="flex-row border-b border-[#E7DED1] bg-[#F7F4ED] px-4">
      {tabs.map((tab) => {
        const selected = active === tab;
        return (
          <Pressable key={tab} onPress={() => onChange(tab)} className="flex-1 items-center py-4">
            <Text className={`text-lg ${selected ? 'text-[#0F766E]' : 'text-[#162B3A]'}`}>
              {tab}
            </Text>
            <View
              className={`mt-3 h-1 rounded-full ${selected ? 'bg-[#0F766E]' : 'bg-transparent'}`}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export function ProgressBars({ step, total }: { step: number; total: number }) {
  return (
    <View className="flex-row gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-1.5 flex-1 rounded-full ${
            index <= step ? 'bg-[#E66E3A]' : 'bg-[#E7DED1]'
          }`}
        />
      ))}
    </View>
  );
}

export function FriendlyButton({
  title,
  onPress,
  testID,
  disabled,
}: {
  title: string;
  onPress: () => void;
  testID?: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      className={`items-center rounded-2xl bg-[#0F766E] py-4 active:opacity-80 ${
        disabled ? 'opacity-40' : ''
      }`}>
      <Text className="text-lg font-medium text-white">{title}</Text>
    </Pressable>
  );
}

export function InfoRow({
  icon,
  title,
  subtitle,
  onPress,
  badge,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  badge?: boolean;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-6 py-4">
      <View className="relative mr-4 w-10 items-center">
        <Text className="text-3xl text-slate-800">{icon}</Text>
        {badge ? (
          <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-[#E66E3A]">
            <Text className="text-xs font-semibold text-white">!</Text>
          </View>
        ) : null}
      </View>
      <View className="flex-1">
        <Text className="text-2xl text-slate-950">{title}</Text>
        {subtitle ? <Text className="mt-1 text-lg text-slate-500">{subtitle}</Text> : null}
      </View>
      <Text className="text-4xl text-slate-700">›</Text>
    </Pressable>
  );
}
