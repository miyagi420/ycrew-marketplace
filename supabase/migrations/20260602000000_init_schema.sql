-- Yacht Crew Marketplace — initial schema, ported from prisma/schema.prisma
-- and adapted for Supabase: identity lives in auth.users; app tables key off it;
-- Row-Level Security enforces ownership. See docs/adr/0001 and PRD issue #1.

create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type role as enum ('CREW', 'OWNER', 'AGENCY', 'ADMIN');
create type job_status as enum ('DRAFT', 'OPEN', 'CLOSED', 'FILLED', 'ARCHIVED');
create type application_status as enum (
  'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN', 'ACCEPTED'
);
create type contract_type as enum ('DAY', 'SEASONAL', 'PERMANENT');
create type subscription_plan as enum ('FREE', 'PRO', 'ELITE', 'AGENCY', 'ENTERPRISE');

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- App-level user row, 1:1 with auth.users.
create table public.users (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  role        role not null default 'CREW',
  status      text not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.crew_profiles (
  user_id               uuid primary key references public.users (id) on delete cascade,
  name                  text not null default '',
  nationality           text,
  languages             text[] not null default '{}',
  homeport              text,
  willingness_to_travel boolean not null default true,
  min_day_rate          numeric,
  min_monthly           numeric,
  currency              text not null default 'EUR',
  experience_months     integer not null default 0,
  primary_role          text not null default '',
  secondary_roles       text[] not null default '{}',
  boat_types            text[] not null default '{}',
  boat_length_min       integer,
  boat_length_max       integer,
  availability_start    date,
  availability_end      date,
  bio                   text,
  photo_url             text,
  cv_url                text,
  profile_completeness  integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table public.owner_orgs (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null default 'owner',
  billing_email text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.owner_org_members (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.owner_orgs (id) on delete cascade,
  user_id    uuid not null references public.users (id) on delete cascade,
  role       text not null default 'member',
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create table public.vessels (
  id           uuid primary key default gen_random_uuid(),
  owner_org_id uuid not null references public.owner_orgs (id) on delete cascade,
  name         text not null,
  type         text not null,
  flag_state   text,
  length_m     numeric,
  build_year   integer,
  homeport     text,
  mmsi         text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.jobs (
  id                uuid primary key default gen_random_uuid(),
  owner_org_id      uuid not null references public.owner_orgs (id) on delete cascade,
  vessel_id         uuid references public.vessels (id) on delete set null,
  title             text not null,
  role              text not null,
  contract_type     contract_type not null default 'SEASONAL',
  start_date        date not null,
  duration_days     integer,
  itinerary         text,
  itinerary_geojson text,
  requires_cert_types text[] not null default '{}',
  min_exp_months    integer,
  day_rate          numeric,
  monthly_rate      numeric,
  currency          text not null default 'EUR',
  accommodation     text,
  description       text,
  status            job_status not null default 'DRAFT',
  posted_at         timestamptz,
  closed_at         timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.certifications (
  id           uuid primary key default gen_random_uuid(),
  crew_user_id uuid not null references public.crew_profiles (user_id) on delete cascade,
  type         text not null,
  number       text,
  issuer       text,
  issue_date   date,
  expiry_date  date,
  doc_url      text,
  verified     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.applications (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid not null references public.jobs (id) on delete cascade,
  crew_user_id  uuid not null references public.users (id) on delete cascade,
  status        application_status not null default 'APPLIED',
  cover_text    text,
  expected_rate numeric,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (job_id, crew_user_id)
);

create table public.matches (
  id           uuid primary key default gen_random_uuid(),
  job_id       uuid not null references public.jobs (id) on delete cascade,
  crew_user_id uuid not null references public.users (id) on delete cascade,
  score        numeric not null,
  reasons      jsonb not null default '[]',
  created_at   timestamptz not null default now(),
  unique (job_id, crew_user_id)
);

create table public.availability (
  id           uuid primary key default gen_random_uuid(),
  crew_user_id uuid not null references public.crew_profiles (user_id) on delete cascade,
  start_date   date not null,
  end_date     date not null,
  location     text,
  notes        text,
  created_at   timestamptz not null default now()
);

create table public.subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid unique references public.users (id) on delete cascade,
  org_id       uuid unique references public.owner_orgs (id) on delete cascade,
  plan         subscription_plan not null default 'FREE',
  status       text not null default 'active',
  renewal_date timestamptz,
  provider_sub_id text unique,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.verifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid unique not null references public.users (id) on delete cascade,
  kyc_status      text not null default 'pending',
  kyc_provider    text,
  kyc_provider_id text,
  last_reviewed_at timestamptz,
  reviewed_by     text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Helpful indexes
create index on public.owner_org_members (user_id);
create index on public.vessels (owner_org_id);
create index on public.jobs (owner_org_id);
create index on public.jobs (status);
create index on public.certifications (crew_user_id);
create index on public.applications (job_id);
create index on public.applications (crew_user_id);

-- updated_at triggers
create trigger t_users_updated before update on public.users
  for each row execute function public.set_updated_at();
create trigger t_crew_updated before update on public.crew_profiles
  for each row execute function public.set_updated_at();
create trigger t_orgs_updated before update on public.owner_orgs
  for each row execute function public.set_updated_at();
create trigger t_vessels_updated before update on public.vessels
  for each row execute function public.set_updated_at();
create trigger t_jobs_updated before update on public.jobs
  for each row execute function public.set_updated_at();
create trigger t_certs_updated before update on public.certifications
  for each row execute function public.set_updated_at();
create trigger t_apps_updated before update on public.applications
  for each row execute function public.set_updated_at();
create trigger t_subs_updated before update on public.subscriptions
  for each row execute function public.set_updated_at();
create trigger t_verif_updated before update on public.verifications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth integration: create app rows on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role role;
begin
  v_role := coalesce((new.raw_user_meta_data ->> 'role')::role, 'CREW');
  insert into public.users (id, email, role)
  values (new.id, new.email, v_role)
  on conflict (id) do nothing;

  if v_role = 'CREW' then
    insert into public.crew_profiles (user_id, name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS helper functions (security definer to avoid policy recursion)
-- ---------------------------------------------------------------------------
create or replace function public.current_user_role()
returns role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.is_owner_role()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('OWNER', 'AGENCY', 'ADMIN');
$$;

create or replace function public.is_org_member(p_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.owner_org_members
    where org_id = p_org and user_id = auth.uid()
  );
$$;

-- Create an org and make the caller its owner (atomic, bypasses RLS safely).
create or replace function public.create_owner_org(p_name text, p_type text default 'owner')
returns public.owner_orgs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org public.owner_orgs;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  insert into public.owner_orgs (name, type) values (p_name, p_type)
  returning * into v_org;
  insert into public.owner_org_members (org_id, user_id, role)
  values (v_org.id, auth.uid(), 'owner');
  return v_org;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
alter table public.users             enable row level security;
alter table public.crew_profiles     enable row level security;
alter table public.owner_orgs        enable row level security;
alter table public.owner_org_members enable row level security;
alter table public.vessels           enable row level security;
alter table public.jobs              enable row level security;
alter table public.certifications    enable row level security;
alter table public.applications      enable row level security;
alter table public.matches           enable row level security;
alter table public.availability      enable row level security;
alter table public.subscriptions     enable row level security;
alter table public.verifications     enable row level security;

-- users: read/update own row only (insert handled by trigger).
create policy users_select_own on public.users
  for select using (id = auth.uid());
create policy users_update_own on public.users
  for update using (id = auth.uid()) with check (id = auth.uid());

-- crew_profiles: crew see/edit own; owners may read any crew (candidate browsing).
create policy crew_select on public.crew_profiles
  for select using (user_id = auth.uid() or public.is_owner_role());
create policy crew_insert_own on public.crew_profiles
  for insert with check (user_id = auth.uid());
create policy crew_update_own on public.crew_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- certifications: crew manage own; owners may read (for matching).
create policy certs_select on public.certifications
  for select using (crew_user_id = auth.uid() or public.is_owner_role());
create policy certs_write_own on public.certifications
  for all using (crew_user_id = auth.uid()) with check (crew_user_id = auth.uid());

-- owner_orgs: members read; members(owner/admin) update. Insert via create_owner_org RPC.
create policy orgs_select_member on public.owner_orgs
  for select using (public.is_org_member(id));
create policy orgs_update_member on public.owner_orgs
  for update using (public.is_org_member(id)) with check (public.is_org_member(id));

-- owner_org_members: see own membership rows or co-members of your orgs.
create policy members_select on public.owner_org_members
  for select using (user_id = auth.uid() or public.is_org_member(org_id));

-- vessels: any authenticated user can read (job displays); org members write.
create policy vessels_select on public.vessels
  for select using (auth.uid() is not null);
create policy vessels_write_member on public.vessels
  for all using (public.is_org_member(owner_org_id)) with check (public.is_org_member(owner_org_id));

-- jobs: published jobs visible to all authenticated; org members see own (incl. drafts) and write.
create policy jobs_select on public.jobs
  for select using (status = 'OPEN' or public.is_org_member(owner_org_id));
create policy jobs_write_member on public.jobs
  for all using (public.is_org_member(owner_org_id)) with check (public.is_org_member(owner_org_id));

-- applications: applicant or the job's owning org. Crew may apply to published jobs.
create policy apps_select on public.applications
  for select using (
    crew_user_id = auth.uid()
    or public.is_org_member((select owner_org_id from public.jobs where id = job_id))
  );
create policy apps_insert_crew on public.applications
  for insert with check (
    crew_user_id = auth.uid()
    and exists (select 1 from public.jobs j where j.id = job_id and j.status = 'OPEN')
  );
create policy apps_update on public.applications
  for update using (
    crew_user_id = auth.uid()
    or public.is_org_member((select owner_org_id from public.jobs where id = job_id))
  );

-- matches: applicant or job's owning org may read. Writes happen via service role.
create policy matches_select on public.matches
  for select using (
    crew_user_id = auth.uid()
    or public.is_org_member((select owner_org_id from public.jobs where id = job_id))
  );

-- availability: crew own; owners may read.
create policy avail_select on public.availability
  for select using (crew_user_id = auth.uid() or public.is_owner_role());
create policy avail_write_own on public.availability
  for all using (crew_user_id = auth.uid()) with check (crew_user_id = auth.uid());

-- subscriptions: own user sub or org members.
create policy subs_select on public.subscriptions
  for select using (
    user_id = auth.uid() or (org_id is not null and public.is_org_member(org_id))
  );

-- verifications: own only.
create policy verif_select_own on public.verifications
  for select using (user_id = auth.uid());
