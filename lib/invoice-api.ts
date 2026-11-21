import { NextResponse } from 'next/server';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function validateInvoiceDraftPayload(value: unknown): string | null {
  if (!isRecord(value) || !Array.isArray(value.items) || value.items.length === 0 || value.items.length > 100) {
    return 'Invoice must contain between 1 and 100 lines.';
  }
  const requiredText = (key: string, maxLength: number) =>
    typeof value[key] === 'string' && value[key].trim().length > 0 && value[key].length <= maxLength;
  const optionalText = (key: string, maxLength: number) =>
    typeof value[key] === 'string' && value[key].length <= maxLength;

  if (!requiredText('clientName', 200) || !requiredText('projectName', 200)) {
    return 'Client name and project name are required (maximum 200 characters).';
  }
  if (!optionalText('clientCompany', 200) || !optionalText('clientEmail', 254)
    || !optionalText('clientPhone', 50) || !optionalText('adjustmentNote', 500)) {
    return 'Client or adjustment details are too long.';
  }
  if (value.dueDate !== '' && value.dueDate !== null && !isDate(value.dueDate)) {
    return 'Due date must be a valid date.';
  }
  if (typeof value.adjustmentAmount !== 'number' || !Number.isFinite(value.adjustmentAmount)
    || Math.abs(value.adjustmentAmount) > 999999999999.99) {
    return 'Invoice adjustment is invalid.';
  }

  let total = value.adjustmentAmount;
  for (const item of value.items) {
    if (!isRecord(item)
      || typeof item.id !== 'string' || item.id.length > 80
      || typeof item.title !== 'string' || !item.title.trim() || item.title.length > 300
      || typeof item.description !== 'string' || item.description.length > 5000
      || typeof item.catalogTitle !== 'string' || item.catalogTitle.length > 300
      || typeof item.image !== 'string' || item.image.length > 2048
      || typeof item.amount !== 'number' || !Number.isFinite(item.amount)
      || item.amount < 0 || item.amount > 999999999999.99) {
      return 'Invoice lines contain invalid details or amounts.';
    }
    total += item.amount;
  }
  if (!Number.isFinite(total) || total < 0 || total > 999999999999.99) {
    return 'Invoice total must be between zero and ₹999,999,999,999.99.';
  }
  return null;
}

export function validatePaymentPayload(value: unknown): string | null {
  if (!isRecord(value) || !isDate(value.paymentDate)
    || typeof value.amount !== 'number' || !Number.isFinite(value.amount)
    || value.amount <= 0 || value.amount > 999999999999.99) {
    return 'Payment date and a positive amount are required.';
  }
  if (typeof value.method !== 'string' || value.method.length > 100
    || typeof value.reference !== 'string' || value.reference.length > 200
    || typeof value.memo !== 'string' || value.memo.length > 1000) {
    return 'Payment details are too long or invalid.';
  }
  return null;
}

export function invoiceErrorResponse(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = error.code;
    const message = 'message' in error && typeof error.message === 'string'
      ? error.message
      : 'Invoice request could not be completed.';

    if (code === '42501') return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });
    if (code === 'P0002') return NextResponse.json({ error: 'The requested proposal or invoice was not found.' }, { status: 404 });
    if (code === '22023' || code === '55000') return NextResponse.json({ error: message }, { status: 400 });
    if (code === 'PGRST202' || code === '42883' || code === '42P01') {
      return NextResponse.json({
        error: 'Invoice setup is incomplete. Review and apply the pending Supabase migrations, then reload.',
      }, { status: 503 });
    }
  }

  console.error('Invoice operation failed:', error);
  return NextResponse.json({ error: 'Could not complete the invoice operation. Please try again.' }, { status: 500 });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
}
