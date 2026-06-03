-- Split location write policies so they do not also apply to SELECT.
-- This keeps advisor noise down and avoids duplicate permissive SELECT checks.

drop policy if exists job_locations_select on public.job_locations;
drop policy if exists job_locations_write_member on public.job_locations;
drop policy if exists vessel_positions_select on public.vessel_positions;
drop policy if exists vessel_positions_write_member on public.vessel_positions;
drop policy if exists crew_locations_select on public.crew_locations;
drop policy if exists crew_locations_write_own on public.crew_locations;

create policy job_locations_select on public.job_locations
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.jobs j
      where j.id = job_id
        and (j.status = 'OPEN' or public.is_org_member(j.owner_org_id))
    )
  );

create policy job_locations_insert_member on public.job_locations
  for insert
  to authenticated
  with check (
    public.is_org_member((select owner_org_id from public.jobs where id = job_id))
  );

create policy job_locations_update_member on public.job_locations
  for update
  to authenticated
  using (
    public.is_org_member((select owner_org_id from public.jobs where id = job_id))
  )
  with check (
    public.is_org_member((select owner_org_id from public.jobs where id = job_id))
  );

create policy job_locations_delete_member on public.job_locations
  for delete
  to authenticated
  using (
    public.is_org_member((select owner_org_id from public.jobs where id = job_id))
  );

create policy vessel_positions_select on public.vessel_positions
  for select
  to authenticated
  using (
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

create policy vessel_positions_insert_member on public.vessel_positions
  for insert
  to authenticated
  with check (
    public.is_org_member((select owner_org_id from public.vessels where id = vessel_id))
  );

create policy vessel_positions_update_member on public.vessel_positions
  for update
  to authenticated
  using (
    public.is_org_member((select owner_org_id from public.vessels where id = vessel_id))
  )
  with check (
    public.is_org_member((select owner_org_id from public.vessels where id = vessel_id))
  );

create policy vessel_positions_delete_member on public.vessel_positions
  for delete
  to authenticated
  using (
    public.is_org_member((select owner_org_id from public.vessels where id = vessel_id))
  );

create policy crew_locations_select on public.crew_locations
  for select
  to authenticated
  using (crew_user_id = (select auth.uid()) or (share_with_owners and public.is_owner_role()));

create policy crew_locations_insert_own on public.crew_locations
  for insert
  to authenticated
  with check (crew_user_id = (select auth.uid()));

create policy crew_locations_update_own on public.crew_locations
  for update
  to authenticated
  using (crew_user_id = (select auth.uid()))
  with check (crew_user_id = (select auth.uid()));

create policy crew_locations_delete_own on public.crew_locations
  for delete
  to authenticated
  using (crew_user_id = (select auth.uid()));
