import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Text, TextInput, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorText, Field } from '@/components/ui';
import { BackHeader, FriendlyButton, ProgressBars } from '@/components/friendly';
import type { AppRole } from '@/lib/auth';
import { useAuth } from '@/lib/auth';

const interestsList = [
  'Regattas',
  'Boat Delivery',
  'Miles Building',
  'Day Sailing',
  'Cruising',
  'Learn Sailing',
  'Transoceanic',
  'Other',
];
const experienceList = ['No experience', 'Little experience', 'Solid experience', 'Professional'];
const lifestyleList = ['Non-drinker', 'Non-nudist', 'Non-smoker', 'Non-spiritual', 'Non-vegan'];

export default function SignUp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ role?: string }>();
  const { signUp } = useAuth();

  const [step, setStep] = useState(0);
  const [role, setRole] = useState<AppRole>(params.role === 'OWNER' ? 'OWNER' : 'CREW');
  const [interests, setInterests] = useState<string[]>(['Regattas']);
  const [experience, setExperience] = useState('Little experience');
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [languageDraft, setLanguageDraft] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [currency, setCurrency] = useState('Euro');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageOk, setAgeOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const toggle = (value: string, values: string[], setter: (next: string[]) => void) => {
    setter(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
  };

  const addLanguage = () => {
    const next = languageDraft.trim();
    if (!next || languages.includes(next)) return;
    setLanguages([...languages, next]);
    setLanguageDraft('');
  };

  const onSubmit = async () => {
    setError(null);
    if (!ageOk) {
      setError('Please confirm you are 18 or older.');
      return;
    }
    if (!name.trim() || !email.trim() || !password) {
      setError('Name, email and password are required.');
      return;
    }

    setBusy(true);
    const { error } = await signUp(email.trim(), password, role, name.trim(), {
      onboarding: { interests, experience, lifestyle, languages, gender, dob, currency },
    });
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    router.replace('/');
  };

  const next = () => {
    setError(null);
    if (step < 4) setStep((s) => s + 1);
    else onSubmit();
  };

  return (
    <View className="flex-1 bg-white">
      <BackHeader
        onBack={() => (step === 0 ? router.back() : setStep((s) => s - 1))}
        right={
          <Pressable onPress={() => router.push('/(auth)/sign-in')} className="h-10 w-10 items-center justify-center">
            <Text className="text-3xl text-slate-700">⇥</Text>
          </Pressable>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 40, paddingBottom: 180 }}
        keyboardShouldPersistTaps="handled">
        {step === 0 ? (
          <View>
            <Text className="mb-6 text-5xl font-normal leading-tight text-slate-950">
              What are you here for?
            </Text>

            <RoleRow
              testID="role-OWNER"
              title="Find a crew"
              selected={role === 'OWNER'}
              onPress={() => setRole('OWNER')}
            />
            <RoleRow
              testID="role-CREW"
              title="Join a sailing trip"
              selected={role === 'CREW'}
              onPress={() => setRole('CREW')}
            />

            <Text className="mb-4 mt-4 text-5xl font-normal leading-tight text-slate-950">
              What are your interests?
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {interestsList.map((interest) => (
                <Chip
                  key={interest}
                  title={interest}
                  selected={interests.includes(interest)}
                  onPress={() => toggle(interest, interests, setInterests)}
                />
              ))}
            </View>
          </View>
        ) : null}

        {step === 1 ? (
          <View>
            <Text className="mb-8 text-5xl font-normal leading-tight text-slate-950">
              What is your sailing experience?
            </Text>
            <Fieldset label="Experience">
              {experienceList.map((item) => (
                <RadioRow
                  key={item}
                  title={item}
                  selected={experience === item}
                  onPress={() => setExperience(item)}
                />
              ))}
            </Fieldset>
          </View>
        ) : null}

        {step === 2 ? (
          <View>
            <Text className="mb-8 text-5xl font-normal leading-tight text-slate-950">
              What is your lifestyle?
            </Text>
            <Fieldset label="Preferences (optional)">
              <View className="flex-row flex-wrap gap-3">
                {lifestyleList.map((item) => (
                  <Chip
                    key={item}
                    title={item}
                    selected={lifestyle.includes(item)}
                    onPress={() => toggle(item, lifestyle, setLifestyle)}
                  />
                ))}
              </View>
            </Fieldset>
          </View>
        ) : null}

        {step === 3 ? (
          <View>
            <Text className="mb-8 text-5xl font-normal leading-tight text-slate-950">
              Which languages can you speak confidently?
            </Text>
            <Fieldset label="Languages">
              <View className="flex-row flex-wrap gap-3">
                {languages.map((language) => (
                  <Pressable
                    key={language}
                    onPress={() => setLanguages(languages.filter((item) => item !== language))}
                    className="flex-row items-center rounded-xl border border-indigo-200 bg-indigo-100 px-5 py-4">
                    <Text className="mr-3 text-xl text-slate-900">{language}</Text>
                    <Text className="text-xl font-semibold text-slate-700">x</Text>
                  </Pressable>
                ))}
                <TextInput
                  value={languageDraft}
                  onChangeText={setLanguageDraft}
                  placeholder="Add language"
                  placeholderTextColor="#64748B"
                  className="min-w-36 rounded-xl border border-slate-300 px-4 py-4 text-xl text-slate-950"
                  onSubmitEditing={addLanguage}
                />
                <Pressable onPress={addLanguage} className="rounded-xl bg-blue-800 px-6 py-4">
                  <Text className="text-xl text-white">Add</Text>
                </Pressable>
              </View>
            </Fieldset>
          </View>
        ) : null}

        {step === 4 ? (
          <View>
            <Text className="mb-8 text-5xl font-normal leading-tight text-slate-950">
              Add some information about yourself.
            </Text>

            <Fieldset label="Profile Photo (optional)">
              <View className="h-52 items-center justify-center bg-slate-200">
                <Text className="text-4xl text-blue-800">▣</Text>
              </View>
            </Fieldset>

            <Fieldset label="Gender">
              <View className="flex-row flex-wrap gap-4">
                {['Male', 'Female', 'Other'].map((item) => (
                  <RadioPill
                    key={item}
                    title={item}
                    selected={gender === item}
                    onPress={() => setGender(item)}
                  />
                ))}
              </View>
            </Fieldset>

            <TextInput
              value={dob}
              onChangeText={setDob}
              placeholder="Date Of Birth (optional)"
              placeholderTextColor="#475569"
              className="mb-2 rounded-2xl border border-slate-700 px-5 py-5 text-2xl text-slate-950"
            />
            <Text className="mb-6 text-base text-slate-500">
              Not visible to anyone. Used for age calculation.
            </Text>

            <Field label="Full name" testID="name" value={name} onChangeText={setName} autoCapitalize="words" />
            <Field
              label="Email"
              testID="email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Field
              label="Password"
              testID="password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable testID="age" onPress={() => setAgeOk((v) => !v)} className="mb-5 flex-row items-center gap-3">
              <View
                className={`h-6 w-6 items-center justify-center rounded-md border ${
                  ageOk ? 'border-blue-800 bg-blue-800' : 'border-slate-400'
                }`}>
                {ageOk ? <Text className="text-white">✓</Text> : null}
              </View>
              <Text className="flex-1 text-sm text-slate-600">
                I am 18 or older and accept the Terms & Privacy Policy
              </Text>
            </Pressable>

            <View className="mb-4 flex-row gap-4">
              <Link href="/legal/terms" className="text-xs text-blue-800">
                Terms
              </Link>
              <Link href="/legal/privacy" className="text-xs text-blue-800">
                Privacy Policy
              </Link>
            </View>
            <ErrorText>{error}</ErrorText>
            <Link href="/(auth)/sign-in" className="mt-2 text-center text-sm text-blue-800">
              Have an account? Sign in
            </Link>
          </View>
        ) : null}
      </ScrollView>

      <View className="bg-white px-8 pt-3" style={{ paddingBottom: insets.bottom + 18 }}>
        <ProgressBars step={step} total={5} />
        <View className="h-8" />
        <FriendlyButton
          testID={step === 4 ? 'submit' : 'onboarding-next'}
          title={step === 4 ? (busy ? 'Creating...' : 'Create account') : 'Next ->'}
          onPress={next}
          disabled={busy}
        />
      </View>
    </View>
  );
}

function Fieldset({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="rounded-3xl border border-slate-700 p-5">
      <Text className="-mt-9 mb-4 self-start bg-white px-2 text-xl text-slate-600">{label}</Text>
      {children}
    </View>
  );
}

function RoleRow({
  testID,
  title,
  selected,
  onPress,
}: {
  testID: string;
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable testID={testID} onPress={onPress} className="mb-5 flex-row items-center justify-between">
      <Text className="text-3xl text-slate-950">{title}</Text>
      <View
        className={`h-8 w-8 items-center justify-center rounded border-2 ${
          selected ? 'border-blue-800 bg-blue-800' : 'border-slate-700'
        }`}>
        {selected ? <Text className="text-2xl leading-none text-white">✓</Text> : null}
      </View>
    </Pressable>
  );
}

function Chip({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-xl border px-5 py-2.5 ${
        selected ? 'border-indigo-200 bg-indigo-100' : 'border-slate-300 bg-white'
      }`}>
      <Text className="text-xl text-slate-800">{selected ? '✓ ' : ''}{title}</Text>
    </Pressable>
  );
}

function RadioRow({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-5">
      <View
        className={`mr-7 h-9 w-9 items-center justify-center rounded-full border-4 ${
          selected ? 'border-blue-800' : 'border-slate-700'
        }`}>
        {selected ? <View className="h-4 w-4 rounded-full bg-blue-800" /> : null}
      </View>
      <Text className="text-3xl text-slate-950">{title}</Text>
    </Pressable>
  );
}

function RadioPill({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-2">
      <View
        className={`mr-3 h-8 w-8 items-center justify-center rounded-full border-4 ${
          selected ? 'border-blue-800' : 'border-slate-700'
        }`}>
        {selected ? <View className="h-3 w-3 rounded-full bg-blue-800" /> : null}
      </View>
      <Text className="text-2xl text-slate-950">{title}</Text>
    </Pressable>
  );
}
