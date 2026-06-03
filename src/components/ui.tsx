import { ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 };
  if (!scroll) {
    return (
      <View className="flex-1 bg-[#F7F4ED] px-5" style={pad}>
        {children}
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F7F4ED]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        className="flex-1 bg-[#F7F4ED]"
        contentContainerStyle={{ paddingHorizontal: 20, ...pad }}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return <Text className="mb-1 text-4xl font-semibold leading-tight text-[#162B3A]">{children}</Text>;
}

export function Subtle({ children }: { children: ReactNode }) {
  return <Text className="mb-6 text-base leading-relaxed text-[#5C6E7A]">{children}</Text>;
}

export function Label({ children }: { children: ReactNode }) {
  return <Text className="mb-1.5 text-xs uppercase text-[#5C6E7A]">{children}</Text>;
}

export function Field({ label, ...props }: { label: string } & TextInputProps) {
  return (
    <View className="mb-4">
      <Label>{label}</Label>
      <TextInput
        placeholderTextColor="#94A3B8"
        className="rounded-2xl border border-[#D9CFC0] bg-[#FFFDF8] px-4 py-3 text-base text-[#162B3A]"
        {...props}
      />
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  testID,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
}) {
  const primary = variant === 'primary';
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      className={`mb-3 items-center rounded-2xl py-4 active:opacity-80 ${
        primary ? 'bg-[#0F766E]' : 'border border-[#0F766E]/40 bg-[#FFFDF8]'
      } ${disabled || loading ? 'opacity-50' : ''}`}>
      {loading ? (
        <ActivityIndicator color={primary ? '#FFFFFF' : '#0F766E'} />
      ) : (
        <Text className={`text-base font-semibold ${primary ? 'text-white' : 'text-[#0F766E]'}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <View className="mb-3 rounded-3xl border border-[#E7DED1] bg-[#FFFDF8] p-4 shadow-sm">{children}</View>
  );
}

export function Pill({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'green' | 'muted' }) {
  const tones = {
    gold: 'bg-[#FFE8D8] text-[#B45125]',
    green: 'bg-emerald-100 text-emerald-700',
    muted: 'bg-slate-100 text-slate-600',
  } as const;
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${tones[tone].split(' ')[0]}`}>
      <Text className={`text-xs font-medium ${tones[tone].split(' ')[1]}`}>{children}</Text>
    </View>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <Text className="mb-3 text-sm text-red-600">{children}</Text>;
}
