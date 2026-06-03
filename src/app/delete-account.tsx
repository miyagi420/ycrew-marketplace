import { ScrollView, Text, View } from 'react-native';

// Public page (no login) for the Google Play "Account deletion URL" requirement.
// URL after web deploy: https://<your-domain>/delete-account
export default function DeleteAccount() {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24, maxWidth: 720 }}>
      <Text className="mb-2 text-3xl font-semibold text-slate-900">Delete your Yachtly account</Text>
      <Text className="mb-6 text-base text-slate-600">
        Yachtly (the yacht crew marketplace app) lets you permanently delete your account and all
        associated data at any time.
      </Text>

      <Text className="mb-1 text-xl font-semibold text-slate-900">Delete in the app</Text>
      <Text className="mb-1 text-base text-slate-700">1. Open Yachtly and sign in.</Text>
      <Text className="mb-1 text-base text-slate-700">2. Go to the More / Account tab.</Text>
      <Text className="mb-1 text-base text-slate-700">3. Tap “Delete Account”, then confirm.</Text>
      <Text className="mb-6 text-base text-slate-700">
        Your account is deleted immediately and cannot be recovered.
      </Text>

      <Text className="mb-1 text-xl font-semibold text-slate-900">Or request by email</Text>
      <Text className="mb-6 text-base text-slate-700">
        Email <Text className="font-semibold">hello@yachtly.app</Text> from the address on your
        account and we will delete it within 30 days.
      </Text>

      <Text className="mb-1 text-xl font-semibold text-slate-900">What is deleted</Text>
      <Text className="mb-1 text-base text-slate-700">
        Your account and profile, certifications, availability, applications, posted jobs and
        organizations, messages, and saved locations.
      </Text>
      <Text className="mb-6 text-base text-slate-700">
        Data is removed immediately on deletion. Minimal records may be retained only where required
        by law (e.g. financial/audit obligations), then deleted.
      </Text>

      <Text className="text-sm text-slate-500">Yachtly · hello@yachtly.app</Text>
    </ScrollView>
  );
}
