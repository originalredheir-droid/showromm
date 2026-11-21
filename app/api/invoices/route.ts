import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { invoiceErrorResponse, isUuid, readJson } from '@/lib/invoice-api';

export async function POST(request: Request) {
  const payload = await readJson(request).catch((error: unknown) => error);
  if (payload instanceof Error) return NextResponse.json({ error: payload.message }, { status: 400 });
  if (typeof payload !== 'object' || payload === null || !('proposalId' in payload)
    || typeof payload.proposalId !== 'string'
    || !isUuid(payload.proposalId)) {
    return NextResponse.json({ error: 'A valid saved proposal is required.' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('create_invoice_draft', { p_proposal_id: payload.proposalId });
    if (error) throw error;
    if (!data) throw new Error('Invoice draft was not returned after creation.');
    return NextResponse.json({ invoiceId: data }, { status: 201 });
  } catch (error) {
    return invoiceErrorResponse(error);
  }
}
