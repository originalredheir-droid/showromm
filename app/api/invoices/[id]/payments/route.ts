import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { invoiceErrorResponse, isRecord, isUuid, readJson, validatePaymentPayload } from '@/lib/invoice-api';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invoice ID is invalid.' }, { status: 400 });
  const payload = await readJson(request).catch((error: unknown) => error);
  if (payload instanceof Error) return NextResponse.json({ error: payload.message }, { status: 400 });
  if (!isRecord(payload)) return NextResponse.json({ error: 'Payment details are invalid.' }, { status: 400 });
  const validationError = validatePaymentPayload(payload);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('record_invoice_payment', {
      p_invoice_id: id,
      p_payload: payload,
    });
    if (error) throw error;
    const payment = data[0];
    if (!payment) throw new Error('Receipt was not returned after recording payment.');
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return invoiceErrorResponse(error);
  }
}
