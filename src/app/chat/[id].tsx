import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { markThreadRead } from '@/lib/messages';
import { supabase } from '@/lib/supabase';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  sent_at: string;
};

export default function Chat() {
  const { t } = useTranslation();
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
        void markThreadRead(me, threadId);
      });

    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${threadId}` },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => [...prev, msg]);
          if (msg.receiver_id === me) void markThreadRead(me, threadId);
        },
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
      className="flex-1 bg-navy-900"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingTop: insets.top + 12 }} className="px-5 pb-3">
        <Pressable onPress={() => router.back()} className="mb-2">
          <Text className="text-sm text-gold-300">‹ {t('common.back')}</Text>
        </Pressable>
        <Text className="text-2xl font-semibold text-white">{t('chat.title')}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {messages.length === 0 ? (
          <Text className="mt-10 text-center text-navy-100">{t('chat.empty')}</Text>
        ) : null}
        {messages.map((m) => {
          const mine = m.sender_id === me;
          return (
            <View
              key={m.id}
              className={`my-1 max-w-[80%] rounded-2xl px-4 py-2 ${
                mine ? 'self-end bg-gold-400' : 'self-start bg-navy-700'
              }`}>
              <Text className={mine ? 'text-navy-900' : 'text-white'}>{m.body}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View
        style={{ paddingBottom: insets.bottom + 8 }}
        className="flex-row items-center gap-2 border-t border-navy-700 px-3 pt-3">
        <TextInput
          testID="chat-input"
          value={text}
          onChangeText={setText}
          placeholder={t('chat.placeholder')}
          placeholderTextColor="#4F6A8E"
          onSubmitEditing={send}
          className="flex-1 rounded-2xl border border-navy-500/40 bg-navy-800 px-4 py-3 text-white"
        />
        <Pressable
          testID="chat-send"
          onPress={send}
          className="rounded-2xl bg-gold-400 px-4 py-3">
          <Text className="font-semibold text-navy-900">{t('chat.send')}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
