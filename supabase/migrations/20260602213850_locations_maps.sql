-- Location and map data for yacht offers, vessel positions, and crew opt-in
-- availability. Google Maps renders these coordinates client-side; Supabase
-- stores and streams the actual app data under RLS.

create table public.job_locations (
  job_id       uuid primary key references public.jobs (id) on delete cascade,
  label        text not null,
  country      text,
  lat          double precision not null check (lat between -90 and 90),
  lng          double precision not null check (lng between -180 and 180),
  place_id     text,
  source       text not null default 'manual',
  updated_at   timestamptz not null default now()
);

create table public.vessel_positions (
  vessel_id    uuid primary key references public.vessels (id) on delete cascade,
  job_id       uuid references public.jobs (id) on delete set null,
  label        text,
  lat          double precision not null check (lat between -90 and 90),
  lng          double precision not null check (lng between -180 and 180),
  heading      numeric,
  speed_knots  numeric,
  source       text not null default 'manual',
  observed_at  timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.crew_locations (
  crew_user_id       uuid primary key references public.crew_profiles (user_id) on delete cascade,
  label              text not null,
  country            text,
  lat                double precision not null check (lat between -90 and 90),
  lng                double precision not null check (lng between -180 and 180),
  place_id           text,
  share_with_owners  boolean not null default true,
  updated_at         timestamptz not null default now()
);

create index job_locations_lat_lng on public.job_locations (lat, lng);
create index vessel_positions_lat_lng on public.vessel_positions (lat, lng);
create index crew_locations_lat_lng on public.crew_locations (lat, lng);

create trigger t_job_locations_updated before update on public.job_locations
  for each row execute function public.set_updated_at();
create trigger t_vessel_positions_updated before update on public.vessel_positions
  for each row execute function public.set_updated_at();
create trigger t_crew_locations_updated before update on public.crew_locations
  for each row execute function public.set_updated_at();

alter table public.job_locations enable row level security;
alter table public.vessel_positions enable row level security;
alter table public.crew_locations enable row level security;

-- Open-job locations are visible to authenticated crew. Owners can see their
-- own draft/archived job locations through org membership.
create policy job_locations_select on public.job_locations
  for select using (
    exists (
      select 1
      from public.jobs j
      where j.id = job_id
        and (j.status = 'OPEN' or public.is_org_member(j.owner_org_id))
    )
  );

create policy job_locations_write_member on public.job_locations
  for all using (
    public.is_org_member((select owner_org_id from public.jobs where id = job_id))
  ) with check (
    public.is_org_member((select owner_org_id from public.jobs where id = job_id))
  );

-- Vessel positions are visible when tied to an open job or owned by the viewer's
-- org. This prevents broad fleet tracking.
create policy vessel_positions_select on public.vessel_positions
  for select using (
    exists (
      select 1
      from public.vessels v
      left join public.jobs j on j.vessel_id = v.id
      where v.id = vessel_id
        and (
          public.is_org_member(v.owner_org_id)
          or j.status = 'OPEN'
          or exists (select 1 from public.jobs linked where linked.id = job_id and linked.status = 'OPEN')
        )
    )
  );

create policy vessel_positions_write_member on public.vessel_positions
  for all using (
    public.is_org_member((select owner_org_id from public.vessels where id = vessel_id))
  ) with check (
    public.is_org_member((select owner_org_id from public.vessels where id = vessel_id))
  );

-- Crew owns their location. Owners only see rows that crew explicitly shares.
create policy crew_locations_select on public.crew_locations
  for select using (crew_user_id = auth.uid() or (share_with_owners and public.is_owner_role()));

create policy crew_locations_write_own on public.crew_locations
  for all using (crew_user_id = auth.uid()) with check (crew_user_id = auth.uid());

alter publication supabase_realtime add table public.job_locations;
alter publication supabase_realtime add table public.vessel_positions;
alter publication supabase_realtime add table public.crew_locations;
