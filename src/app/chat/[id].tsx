import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  sent_at: string;
};

export default function Chat() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const me = session!.user.id;
  const { id: other } = useLocalSearchParams<{ id: string }>();

  const threadId = [me, other].sort().join('_');
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('messages')
      .select('id, sender_id, receiver_id, body, sent_at')
      .eq('thread_id', threadId)
      .order('sent_at', { ascending: true })
      .then(({ data }) => {
        if (active) setMessages((data ?? []) as Message[]);
      });

    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${threadId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message]),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [threadId]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setText('');
    await supabase.from('messages').insert({
      thread_id: threadId,
      sender_id: me,
      receiver_id: other,
      body,
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingTop: insets.top + 12 }} className="border-b border-slate-100 px-5 pb-3">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-sm text-blue-800">‹ Back</Text>
        </Pressable>
        <Text className="text-3xl font-normal text-slate-950">Messages</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {messages.length === 0 ? (
          <Text className="mt-10 text-center text-slate-500">
            Start with a quick hello about dates, role fit or sea time.
          </Text>
        ) : null}
        {messages.map((m) => {
          const mine = m.sender_id === me;
          return (
            <View
              key={m.id}
              className={`my-1 max-w-[80%] rounded-2xl px-4 py-2 ${
                mine ? 'self-end bg-blue-800' : 'self-start bg-slate-100'
              }`}>
              <Text className={mine ? 'text-white' : 'text-slate-950'}>{m.body}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View
        style={{ paddingBottom: insets.bottom + 8 }}
        className="flex-row items-center gap-2 border-t border-slate-200 px-3 pt-3">
        <TextInput
          testID="chat-input"
          value={text}
          onChangeText={setText}
          placeholder="Write a message"
          placeholderTextColor="#64748B"
          onSubmitEditing={send}
          className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
        />
        <Pressable testID="chat-send" onPress={send} className="rounded-2xl bg-blue-800 px-4 py-3">
          <Text className="font-semibold text-white">Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
