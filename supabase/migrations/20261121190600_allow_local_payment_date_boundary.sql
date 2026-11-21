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
  if (p_payload->>'paymentDate')::date < target_invoice.issue_date then
    raise exception 'Payment date must be on or after the invoice date.'
      using errcode = '22023';
  end if;
  if (p_payload->>'paymentDate')::date > current_date + 1 then
    raise exception 'Payment date cannot be in the future.'
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

revoke all on function public.record_invoice_payment(uuid, jsonb) from public, anon;
grant execute on function public.record_invoice_payment(uuid, jsonb) to authenticated;
