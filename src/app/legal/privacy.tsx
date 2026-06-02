import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { H1, Screen } from '@/components/ui';

const P = ({ children }: { children: string }) => (
  <Text className="mb-3 text-sm leading-relaxed text-navy-100">{children}</Text>
);
const Heading = ({ children }: { children: string }) => (
  <Text className="mb-1 mt-4 text-base font-semibold text-white">{children}</Text>
);

export default function Privacy() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen>
      <Pressable onPress={() => router.back()} className="mb-2 mt-2">
        <Text className="text-sm text-gold-300">‹ {t('common.back')}</Text>
      </Pressable>
      <H1>{t('legal.privacyTitle')}</H1>
      <Text className="mb-4 text-xs text-navy-100">Last updated: 2026-06-02 · Draft</Text>

      <P>
        This app connects yacht and maritime employers with crew. We collect the information you
        provide to operate that service: your account email, profile details, certifications,
        job postings, and applications.
      </P>
      <Heading>What we collect</Heading>
      <P>
        Account data (email), profile data (name, role, experience, languages, availability, rates),
        certification metadata, and your activity (applications, jobs, matches).
      </P>
      <Heading>How we use it</Heading>
      <P>
        To match crew with roles, show your profile to relevant employers, and operate the
        marketplace. We do not sell your personal data.
      </P>
      <Heading>Your rights (GDPR)</Heading>
      <P>
        You can export all data we hold about you, and permanently delete your account at any time,
        from Account &amp; Privacy in the app. Deletion is immediate and irreversible.
      </P>
      <Heading>Data retention</Heading>
      <P>
        We retain your data while your account is active and remove it on deletion. You must be 18
        or older to use the service.
      </P>
      <Heading>Contact</Heading>
      <P>For privacy requests, contact the operator listed in the app store listing.</P>
    </Screen>
  );
}
