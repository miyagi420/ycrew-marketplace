import { supabase } from './supabase';

export type Thread = {
  threadId: string;
  otherId: string;
  lastBody: string;
  lastAt: string;
  unread: number;
  name: string | null;
};

/** All conversations for a user, newest first, with unread counts. */
export async function getThreads(uid: string): Promise<Thread[]> {
  const { data } = await supabase
    .from('messages')
    .select('thread_id, sender_id, receiver_id, body, sent_at, read_at')
    .or(`sender_id.eq.${uid},receiver_id.eq.${uid}`)
    .order('sent_at', { ascending: false });

  const byThread = new Map<string, Thread>();
  const otherIds = new Set<string>();
  for (const m of data ?? []) {
    const otherId = m.sender_id === uid ? m.receiver_id : m.sender_id;
    otherIds.add(otherId);
    if (!byThread.has(m.thread_id)) {
      byThread.set(m.thread_id, {
        threadId: m.thread_id,
        otherId,
        lastBody: m.body,
        lastAt: m.sent_at,
        unread: 0,
        name: null,
      });
    }
    if (m.receiver_id === uid && !m.read_at) byThread.get(m.thread_id)!.unread += 1;
  }

  // Names resolve for crew counterparts (owners can read crew profiles).
  const ids = [...otherIds];
  if (ids.length) {
    const { data: profs } = await supabase.from('crew_profiles').select('user_id, name').in('user_id', ids);
    const nameMap = new Map((profs ?? []).map((p) => [p.user_id, p.name]));
    for (const th of byThread.values()) th.name = nameMap.get(th.otherId) ?? null;
  }

  return [...byThread.values()];
}

/** Total unread messages across all threads. */
export async function getUnreadCount(uid: string): Promise<number> {
  const { count } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('receiver_id', uid)
    .is('read_at', null);
  return count ?? 0;
}

/** Mark every message the user received in a thread as read. */
export async function markThreadRead(uid: string, threadId: string): Promise<void> {
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('thread_id', threadId)
    .eq('receiver_id', uid)
    .is('read_at', null);
}
