-- Direct messaging between two users (crew <-> owner). A thread is the
-- deterministic pair key of the two user ids.

create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   text not null,
  sender_id   uuid not null references public.users (id) on delete cascade,
  receiver_id uuid not null references public.users (id) on delete cascade,
  body        text not null,
  sent_at     timestamptz not null default now(),
  read_at     timestamptz
);

create index on public.messages (thread_id, sent_at);
create index on public.messages (receiver_id);

alter table public.messages enable row level security;

-- Only the two participants can read a message; only the sender can write it.
create policy messages_select on public.messages
  for select using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy messages_insert on public.messages
  for insert with check (sender_id = auth.uid());
create policy messages_update_receiver on public.messages
  for update using (receiver_id = auth.uid()) with check (receiver_id = auth.uid());

-- Realtime so chats update live.
alter publication supabase_realtime add table public.messages;

-- Resolve the primary owner user for a job, so an applicant can open a chat
-- with the hiring side without broad access to org membership.
create or replace function public.job_owner(p_job uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select m.user_id
  from public.owner_org_members m
  join public.jobs j on j.owner_org_id = m.org_id
  where j.id = p_job
  order by (m.role = 'owner') desc
  limit 1;
$$;
