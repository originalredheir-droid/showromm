create table public.invoice_sequences (
  sequence_year integer primary key,
  last_number bigint not null check (last_number > 0)
);

create table public.receipt_sequences (
  sequence_year integer primary key,
  last_number bigint not null check (last_number > 0)
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals (id) on delete restrict,
  invoice_number text unique,
  sequence_year integer,
  sequence_number bigint,
  status text not null default 'draft' check (status in ('draft', 'issued')),
  issue_date date,
  due_date date,
  client_name text not null,
  client_company text not null default '',
  client_email text not null default '',
  client_phone text not null default '',
  project_name text not null,
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  adjustment_amount numeric(14, 2) not null default 0,
  adjustment_note text not null default '',
  business_profile jsonb not null default '{}'::jsonb,
  total_amount numeric(14, 2) not null default 0 check (total_amount >= 0),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  issued_at timestamptz,
  unique (sequence_year, sequence_number),
  constraint invoices_number_state check (
    (status = 'draft' and invoice_number is null and sequence_year is null and sequence_number is null and issue_date is null and issued_at is null)
    or (status = 'issued' and invoice_number is not null and sequence_year is not null and sequence_number is not null and issue_date is not null and issued_at is not null)
  ),
  constraint invoices_due_date_range check (due_date is null or issue_date is null or due_date >= issue_date)
);

create table public.invoice_payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete restrict,
  receipt_number text not null unique,
  sequence_year integer not null,
  sequence_number bigint not null,
  payment_date date not null,
  amount numeric(14, 2) not null check (amount > 0),
  method text not null default '',
  reference text not null default '',
  memo text not null default '',
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  unique (sequence_year, sequence_number)
);

create index invoices_created_at_idx on public.invoices (created_at desc);
create index invoices_proposal_id_idx on public.invoices (proposal_id);
create index invoice_payments_invoice_id_idx on public.invoice_payments (invoice_id, payment_date);

alter table public.invoice_sequences enable row level security;
alter table public.receipt_sequences enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_payments enable row level security;

create policy "Admins can read invoices"
  on public.invoices for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can read invoice payments"
  on public.invoice_payments for select to authenticated
  using ((select public.is_admin()));

revoke all on public.invoice_sequences, public.receipt_sequences, public.invoices, public.invoice_payments
  from public, anon, authenticated;
grant select on public.invoices, public.invoice_payments to authenticated;

create or replace function public.create_invoice_draft(p_proposal_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  source_proposal public.proposals%rowtype;
  new_invoice_id uuid;
  invoice_items jsonb;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access is required.'
      using errcode = '42501';
  end if;

  select * into source_proposal
  from public.proposals
  where id = p_proposal_id;

  if not found then
    raise exception 'The selected proposal was not found.'
      using errcode = 'P0002';
  end if;

  select jsonb_agg(jsonb_build_object(
    'id', gen_random_uuid(),
    'catalogTitle', coalesce(item.value->>'catalogTitle', ''),
    'title', coalesce(nullif(item.value->>'title', ''), item.value->>'catalogTitle', 'Work item'),
    'description', coalesce(item.value->>'description', ''),
    'image', coalesce(item.value->>'image', ''),
    'amount', round(coalesce((item.value->>'estimatedPriceINR')::numeric, 0), 2)
  ))
  into invoice_items
  from jsonb_array_elements(source_proposal.items) as item(value);

  insert into public.invoices (
    proposal_id,
    client_name,
    client_company,
    client_email,
    client_phone,
    project_name,
    items,
    business_profile,
    total_amount,
    created_by
  )
  values (
    source_proposal.id,
    source_proposal.client_name,
    source_proposal.client_company,
    source_proposal.client_email,
    source_proposal.client_phone,
    source_proposal.project_name,
    invoice_items,
    source_proposal.business_profile,
    source_proposal.total_estimated_inr,
    auth.uid()
  )
  returning id into new_invoice_id;

  return new_invoice_id;
end;
$$;

create or replace function public.update_invoice_draft(p_invoice_id uuid, p_payload jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  calculated_total numeric(14, 2);
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access is required.'
      using errcode = '42501';
  end if;
  if jsonb_typeof(p_payload) is distinct from 'object'
    or jsonb_typeof(p_payload->'items') is distinct from 'array'
    or jsonb_array_length(p_payload->'items') = 0
    or jsonb_array_length(p_payload->'items') > 100 then
    raise exception 'Invoice must contain between 1 and 100 lines.'
      using errcode = '22023';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(p_payload->'items') as item(value)
    where jsonb_typeof(item.value) is distinct from 'object'
      or jsonb_typeof(item.value->'id') is distinct from 'string'
      or jsonb_typeof(item.value->'title') is distinct from 'string'
      or jsonb_typeof(item.value->'description') is distinct from 'string'
      or jsonb_typeof(item.value->'amount') is distinct from 'number'
      or nullif(trim(item.value->>'title'), '') is null
      or length(item.value->>'title') > 300
      or length(item.value->>'description') > 5000
      or (item.value->>'amount')::numeric < 0
      or (item.value->>'amount')::numeric > 999999999999.99
  ) then
    raise exception 'Invoice lines contain invalid details or amounts.'
      using errcode = '22023';
  end if;

  if jsonb_typeof(p_payload->'adjustmentAmount') is distinct from 'number'
    or abs((p_payload->>'adjustmentAmount')::numeric) > 999999999999.99 then
    raise exception 'Invoice adjustment is invalid.'
      using errcode = '22023';
  end if;

  if nullif(trim(p_payload->>'clientName'), '') is null
    or nullif(trim(p_payload->>'projectName'), '') is null
    or length(p_payload->>'clientName') > 200
    or length(p_payload->>'projectName') > 200 then
    raise exception 'Client name and project name are required.'
      using errcode = '22023';
  end if;

  select round(
    coalesce(sum((item.value->>'amount')::numeric), 0)
    + (p_payload->>'adjustmentAmount')::numeric,
    2
  )
  into calculated_total
  from jsonb_array_elements(p_payload->'items') as item(value);

  if calculated_total < 0 then
    raise exception 'Invoice total cannot be negative.'
      using errcode = '22023';
  end if;

  update public.invoices
  set client_name = trim(p_payload->>'clientName'),
      client_company = coalesce(trim(p_payload->>'clientCompany'), ''),
      client_email = coalesce(trim(p_payload->>'clientEmail'), ''),
      client_phone = coalesce(trim(p_payload->>'clientPhone'), ''),
      project_name = trim(p_payload->>'projectName'),
      items = p_payload->'items',
      adjustment_amount = (p_payload->>'adjustmentAmount')::numeric,
      adjustment_note = coalesce(trim(p_payload->>'adjustmentNote'), ''),
      due_date = nullif(p_payload->>'dueDate', '')::date,
      total_amount = calculated_total
  where id = p_invoice_id and status = 'draft';

  if not found then
    raise exception 'Invoice draft was not found or has already been issued.'
      using errcode = '55000';
  end if;
end;
$$;

create or replace function public.delete_invoice_draft(p_invoice_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access is required.'
      using errcode = '42501';
  end if;

  delete from public.invoices
  where id = p_invoice_id and status = 'draft';

  if not found then
    raise exception 'Invoice draft was not found or has already been issued.'
      using errcode = '55000';
  end if;
end;
$$;

create or replace function public.issue_invoice(p_invoice_id uuid, p_issue_date date)
returns table (invoice_number text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_year integer;
  next_number bigint;
  new_number text;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access is required.'
      using errcode = '42501';
  end if;
  if p_issue_date is null then
    raise exception 'Invoice date is required.'
      using errcode = '22023';
  end if;

  current_year := extract(year from p_issue_date)::integer;
  insert into public.invoice_sequences as existing_sequence (sequence_year, last_number)
  values (current_year, 1)
  on conflict (sequence_year)
  do update set last_number = existing_sequence.last_number + 1
  returning last_number into next_number;

  new_number := 'originalredheir-' || current_year::text || '-' || lpad(next_number::text, 4, '0');

  update public.invoices
  set invoice_number = new_number,
      sequence_year = current_year,
      sequence_number = next_number,
      status = 'issued',
      issue_date = p_issue_date,
      issued_at = now()
  where id = p_invoice_id
    and status = 'draft'
    and total_amount > 0
    and jsonb_array_length(items) > 0
    and (due_date is null or due_date >= p_issue_date);

  if not found then
    raise exception 'Invoice draft is invalid, missing, or has an earlier due date.'
      using errcode = '55000';
  end if;

  return query select new_number;
end;
$$;

create or replace function public.record_invoice_payment(p_invoice_id uuid, p_payload jsonb)
returns table (payment_id uuid, receipt_number text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_invoice public.invoices%rowtype;
  payment_amount numeric(14, 2);
  paid_so_far numeric(14, 2);
  payment_year integer;
  next_number bigint;
  new_receipt_number text;
  new_payment_id uuid;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access is required.'
      using errcode = '42501';
  end if;
  if jsonb_typeof(p_payload) is distinct from 'object'
    or nullif(p_payload->>'paymentDate', '') is null
    or jsonb_typeof(p_payload->'amount') is distinct from 'number' then
    raise exception 'Payment date and amount are required.'
      using errcode = '22023';
  end if;

  payment_amount := round((p_payload->>'amount')::numeric, 2);
  if payment_amount <= 0 or payment_amount > 999999999999.99 then
    raise exception 'Payment amount must be greater than zero.'
      using errcode = '22023';
  end if;

  select * into target_invoice
  from public.invoices
  where id = p_invoice_id
  for update;
  if not found or target_invoice.status <> 'issued' then
    raise exception 'Only issued invoices can receive payments.'
      using errcode = '55000';
  end if;
  if (p_payload->>'paymentDate')::date < target_invoice.issue_date
    or (p_payload->>'paymentDate')::date > current_date then
    raise exception 'Payment date must be on or after the invoice date and cannot be in the future.'
      using errcode = '22023';
  end if;

  select coalesce(sum(payment.amount), 0)
  into paid_so_far
  from public.invoice_payments as payment
  where payment.invoice_id = p_invoice_id;
  if payment_amount > target_invoice.total_amount - paid_so_far then
    raise exception 'Payment cannot exceed the remaining invoice balance.'
      using errcode = '22023';
  end if;

  payment_year := extract(year from (p_payload->>'paymentDate')::date)::integer;
  insert into public.receipt_sequences as existing_sequence (sequence_year, last_number)
  values (payment_year, 1)
  on conflict (sequence_year)
  do update set last_number = existing_sequence.last_number + 1
  returning last_number into next_number;

  new_receipt_number := 'originalredheir-receipt-' || payment_year::text || '-' || lpad(next_number::text, 4, '0');

  insert into public.invoice_payments (
    invoice_id,
    receipt_number,
    sequence_year,
    sequence_number,
    payment_date,
    amount,
    method,
    reference,
    memo,
    created_by
  )
  values (
    p_invoice_id,
    new_receipt_number,
    payment_year,
    next_number,
    (p_payload->>'paymentDate')::date,
    payment_amount,
    left(coalesce(trim(p_payload->>'method'), ''), 100),
    left(coalesce(trim(p_payload->>'reference'), ''), 200),
    left(coalesce(trim(p_payload->>'memo'), ''), 1000),
    auth.uid()
  )
  returning id into new_payment_id;

  return query select new_payment_id, new_receipt_number;
end;
$$;

revoke all on function public.create_invoice_draft(uuid) from public, anon;
revoke all on function public.update_invoice_draft(uuid, jsonb) from public, anon;
revoke all on function public.delete_invoice_draft(uuid) from public, anon;
revoke all on function public.issue_invoice(uuid, date) from public, anon;
revoke all on function public.record_invoice_payment(uuid, jsonb) from public, anon;
grant execute on function public.create_invoice_draft(uuid) to authenticated;
grant execute on function public.update_invoice_draft(uuid, jsonb) to authenticated;
grant execute on function public.delete_invoice_draft(uuid) to authenticated;
grant execute on function public.issue_invoice(uuid, date) to authenticated;
grant execute on function public.record_invoice_payment(uuid, jsonb) to authenticated;
