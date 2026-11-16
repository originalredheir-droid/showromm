create table public.business_profiles (
  id boolean primary key default true check (id),
  company_name text not null default '',
  brand_name text not null default '',
  address text not null default '',
  email text not null default '',
  phone text not null default '',
  website text not null default '',
  logo_path text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.designs
  drop constraint designs_publish_ready,
  add constraint designs_publish_ready check (
    status <> 'published'
    or length(trim(visual_preview_image)) > 0
  );

create table public.proposal_sequences (
  sequence_year integer primary key,
  last_number bigint not null check (last_number > 0)
);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  proposal_number text not null unique,
  sequence_year integer not null,
  sequence_number bigint not null,
  proposal_date date not null,
  valid_until date,
  client_name text not null,
  client_company text not null default '',
  client_email text not null default '',
  client_phone text not null default '',
  project_name text not null,
  project_brief text not null default '',
  notes text not null default '',
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  business_profile jsonb not null default '{}'::jsonb,
  total_estimated_inr numeric(14, 2) not null default 0 check (total_estimated_inr >= 0),
  total_estimated_hours numeric(10, 2) not null default 0 check (total_estimated_hours >= 0),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  unique (sequence_year, sequence_number),
  constraint proposals_validity_range check (valid_until is null or valid_until >= proposal_date)
);

create index proposals_created_at_idx on public.proposals (created_at desc);
create index proposals_client_name_idx on public.proposals (client_name);

alter table public.business_profiles enable row level security;
alter table public.proposal_sequences enable row level security;
alter table public.proposals enable row level security;

create policy "Admins can manage business profile"
  on public.business_profiles for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can read proposals"
  on public.proposals for select to authenticated
  using ((select public.is_admin()));

revoke all on public.business_profiles, public.proposals, public.proposal_sequences
  from public, anon, authenticated;
grant select, insert, update on public.business_profiles to authenticated;
grant select on public.proposals to authenticated;

create or replace function public.create_proposal(p_payload jsonb)
returns table (proposal_id uuid, proposal_number text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_year integer;
  next_number bigint;
  new_proposal_id uuid;
  new_proposal_number text;
  total_price numeric(14, 2);
  total_hours numeric(10, 2);
  profile_snapshot jsonb;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access is required to save proposals.'
      using errcode = '42501';
  end if;

  if jsonb_typeof(p_payload) is distinct from 'object' then
    raise exception 'Proposal details are invalid.'
      using errcode = '22023';
  end if;

  if jsonb_typeof(p_payload->'items') is distinct from 'array' then
    raise exception 'A proposal must include a list of selected offers.'
      using errcode = '22023';
  end if;

  if jsonb_array_length(p_payload->'items') = 0 then
    raise exception 'A proposal must include at least one selected offer.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_payload->'items') as offer(value)
    where jsonb_typeof(offer.value) is distinct from 'object'
      or jsonb_typeof(offer.value->'title') is distinct from 'string'
      or jsonb_typeof(offer.value->'catalogTitle') is distinct from 'string'
      or jsonb_typeof(offer.value->'description') is distinct from 'string'
      or jsonb_typeof(offer.value->'image') is distinct from 'string'
      or nullif(trim(offer.value->>'catalogTitle'), '') is null
      or (offer.value->>'image') !~* '^https://'
      or (
        offer.value ? 'estimatedPriceINR'
        and jsonb_typeof(offer.value->'estimatedPriceINR') not in ('number', 'null')
      )
      or (
        offer.value ? 'devHours'
        and jsonb_typeof(offer.value->'devHours') not in ('number', 'null')
      )
      or coalesce((offer.value->>'estimatedPriceINR')::numeric, 0) < 0
      or coalesce((offer.value->>'devHours')::numeric, 0) < 0
  ) then
    raise exception 'Proposal offers contain invalid details.'
      using errcode = '22023';
  end if;

  if nullif(trim(p_payload->>'client_name'), '') is null
    or nullif(trim(p_payload->>'project_name'), '') is null then
    raise exception 'Client name and project name are required.'
      using errcode = '22023';
  end if;

  if nullif(p_payload->>'proposal_date', '') is null then
    raise exception 'Proposal date is required.'
      using errcode = '22023';
  end if;

  current_year := extract(year from (p_payload->>'proposal_date')::date)::integer;

  select
    coalesce(sum(coalesce((offer.value->>'estimatedPriceINR')::numeric, 0)), 0),
    coalesce(sum(coalesce((offer.value->>'devHours')::numeric, 0)), 0)
  into total_price, total_hours
  from jsonb_array_elements(p_payload->'items') as offer(value);

  insert into public.proposal_sequences as existing_sequence (sequence_year, last_number)
  values (current_year, 1)
  on conflict (sequence_year)
  do update set last_number = existing_sequence.last_number + 1
  returning last_number into next_number;

  new_proposal_number := 'originalredheir-' || current_year::text || '-' || lpad(next_number::text, 4, '0');

  select coalesce(
    (select to_jsonb(profile) - 'id' - 'updated_at' - 'updated_by'
     from public.business_profiles as profile
     where profile.id = true),
    '{}'::jsonb
  )
  into profile_snapshot;

  insert into public.proposals (
    proposal_number,
    sequence_year,
    sequence_number,
    proposal_date,
    valid_until,
    client_name,
    client_company,
    client_email,
    client_phone,
    project_name,
    project_brief,
    notes,
    items,
    business_profile,
    total_estimated_inr,
    total_estimated_hours,
    created_by
  )
  values (
    new_proposal_number,
    current_year,
    next_number,
    (p_payload->>'proposal_date')::date,
    nullif(p_payload->>'valid_until', '')::date,
    trim(p_payload->>'client_name'),
    coalesce(trim(p_payload->>'client_company'), ''),
    coalesce(trim(p_payload->>'client_email'), ''),
    coalesce(trim(p_payload->>'client_phone'), ''),
    trim(p_payload->>'project_name'),
    coalesce(trim(p_payload->>'project_brief'), ''),
    coalesce(trim(p_payload->>'notes'), ''),
    p_payload->'items',
    profile_snapshot,
    total_price,
    total_hours,
    auth.uid()
  )
  returning id into new_proposal_id;

  return query select new_proposal_id, new_proposal_number;
end;
$$;

revoke all on function public.create_proposal(jsonb) from public, anon;
grant execute on function public.create_proposal(jsonb) to authenticated;
