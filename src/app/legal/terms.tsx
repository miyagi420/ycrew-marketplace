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

export default function Terms() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen>
      <Pressable onPress={() => router.back()} className="mb-2 mt-2">
        <Text className="text-sm text-gold-300">‹ {t('common.back')}</Text>
      </Pressable>
      <H1>{t('legal.termsTitle')}</H1>
      <Text className="mb-4 text-xs text-navy-100">Last updated: 2026-06-02 · Draft</Text>

      <P>
        By creating an account you agree to use this marketplace lawfully and to provide accurate
        information. You must be 18 or older.
      </P>
      <Heading>The service</Heading>
      <P>
        We provide a platform to connect crew and employers. We are not a party to any employment
        contract and do not guarantee placements, hires, or the conduct of any user.
      </P>
      <Heading>Your responsibilities</Heading>
      <P>
        Keep your credentials secure, provide truthful profile and job information, and comply with
        applicable maritime, labour, and immigration laws. Misrepresentation, harassment, or
        fraudulent postings may result in removal.
      </P>
      <Heading>Subscriptions</Heading>
      <P>
        Paid tiers are billed through the app store or web checkout. Store purchases are governed by
        the respective store terms.
      </P>
      <Heading>Liability</Heading>
      <P>
        The service is provided as is. To the extent permitted by law, we are not liable for losses
        arising from use of the marketplace or interactions between users.
      </P>
      <Heading>Changes</Heading>
      <P>We may update these terms; continued use means acceptance of the updated terms.</P>
    </Screen>
  );
}
