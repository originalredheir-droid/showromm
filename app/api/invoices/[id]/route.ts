import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { invoiceErrorResponse, isRecord, isUuid, readJson, validateInvoiceDraftPayload } from '@/lib/invoice-api';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invoice ID is invalid.' }, { status: 400 });
  const payload = await readJson(request).catch((error: unknown) => error);
  if (payload instanceof Error) return NextResponse.json({ error: payload.message }, { status: 400 });
  if (!isRecord(payload)) return NextResponse.json({ error: 'Invoice details are invalid.' }, { status: 400 });
  const validationError = validateInvoiceDraftPayload(payload);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc('update_invoice_draft', {
      p_invoice_id: id,
      p_payload: payload,
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return invoiceErrorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invoice ID is invalid.' }, { status: 400 });
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc('delete_invoice_draft', { p_invoice_id: id });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return invoiceErrorResponse(error);
  }
}
