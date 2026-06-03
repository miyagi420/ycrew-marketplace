import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentSuccess() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="border-b border-slate-100 py-6">
        <Text className="text-center text-2xl text-slate-600">Success</Text>
      </View>
      <View className="items-center px-8 pt-12">
        <View className="mb-8 h-24 w-24 items-center justify-center rounded-full border-4 border-green-700">
          <Text className="text-6xl text-green-700">✓</Text>
        </View>
        <Text className="mb-3 text-center text-4xl font-semibold text-slate-950">
          Your payment was sent
        </Text>
        <Text className="mb-10 text-center text-2xl leading-relaxed text-slate-500">
          Transaction dates use local marina time.
        </Text>
      </View>

      <View className="border-y border-slate-200 px-8">
        <ReceiptRow left="To" right="YachtCrew Escrow" />
        <ReceiptRow left="From" right="Adv SafeBalance Banking - 7118" />
        <ReceiptRow left="Amount" right="$300.00" />
        <ReceiptRow left="Date" right="Jun 1, 2026" />
        <ReceiptRow left="Confirmation" right="nt5h61nnz" />
      </View>

      <View className="flex-1 justify-end px-8" style={{ paddingBottom: insets.bottom + 32 }}>
        <Pressable onPress={() => router.back()} className="self-center rounded bg-blue-900 px-10 py-4">
          <Text className="text-xl font-semibold text-white">DONE</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ReceiptRow({ left, right }: { left: string; right: string }) {
  return (
    <View className="flex-row justify-between border-b border-slate-200 py-5">
      <Text className="max-w-[40%] text-2xl text-slate-950">{left}</Text>
      <Text className="max-w-[58%] text-right text-2xl text-slate-500">{right}</Text>
    </View>
  );
}
