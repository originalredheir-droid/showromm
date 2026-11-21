import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { invoiceErrorResponse, isDate, isUuid, readJson } from '@/lib/invoice-api';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invoice ID is invalid.' }, { status: 400 });
  const payload = await readJson(request).catch((error: unknown) => error);
  if (payload instanceof Error) return NextResponse.json({ error: payload.message }, { status: 400 });
  if (typeof payload !== 'object' || payload === null || !('issueDate' in payload)
    || !isDate(payload.issueDate)) {
    return NextResponse.json({ error: 'A valid invoice date is required.' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('issue_invoice', {
      p_invoice_id: id,
      p_issue_date: payload.issueDate,
    });
    if (error) throw error;
    const invoice = data[0];
    if (!invoice) throw new Error('Invoice number was not returned after issue.');
    return NextResponse.json(invoice);
  } catch (error) {
    return invoiceErrorResponse(error);
  }
}
