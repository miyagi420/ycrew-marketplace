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
      <View className="flex-1 bg-navy-900 px-5" style={pad}>
        {children}
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-navy-900"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        className="flex-1 bg-navy-900"
        contentContainerStyle={{ paddingHorizontal: 20, ...pad }}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return <Text className="mb-1 text-3xl font-semibold text-white">{children}</Text>;
}

export function Subtle({ children }: { children: ReactNode }) {
  return <Text className="mb-6 text-base text-navy-100">{children}</Text>;
}

export function Label({ children }: { children: ReactNode }) {
  return <Text className="mb-1.5 text-xs uppercase tracking-wide text-gold-300">{children}</Text>;
}

export function Field({ label, ...props }: { label: string } & TextInputProps) {
  return (
    <View className="mb-4">
      <Label>{label}</Label>
      <TextInput
        placeholderTextColor="#4F6A8E"
        className="rounded-xl border border-navy-500/40 bg-navy-800 px-4 py-3 text-base text-white"
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
        primary ? 'bg-gold-400' : 'border border-gold-400/40'
      } ${disabled || loading ? 'opacity-50' : ''}`}>
      {loading ? (
        <ActivityIndicator color={primary ? '#0A1A2F' : '#DBBC76'} />
      ) : (
        <Text className={`text-base font-semibold ${primary ? 'text-navy-900' : 'text-gold-200'}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <View className="mb-3 rounded-2xl border border-navy-500/30 bg-navy-800 p-4">{children}</View>
  );
}

export function Pill({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'green' | 'muted' }) {
  const tones = {
    gold: 'bg-gold-400/15 text-gold-200',
    green: 'bg-emerald-500/15 text-emerald-300',
    muted: 'bg-white/10 text-navy-100',
  } as const;
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${tones[tone].split(' ')[0]}`}>
      <Text className={`text-xs font-medium ${tones[tone].split(' ')[1]}`}>{children}</Text>
    </View>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <Text className="mb-3 text-sm text-red-400">{children}</Text>;
}
