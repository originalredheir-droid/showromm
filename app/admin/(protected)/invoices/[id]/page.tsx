import { notFound } from 'next/navigation';
import { InvoiceSetupNotice } from '@/components/admin/InvoiceSetupNotice';
import { InvoiceWorkspace } from '@/components/admin/InvoiceWorkspace';
import { getAdminInvoice } from '@/lib/invoices';

interface AdminInvoicePageProps {
  params: Promise<{ id: string }>;
}

function isMissingInvoiceSchema(error: unknown) {
  if (typeof error !== 'object' || error === null) return false;
  const code = 'code' in error ? error.code : undefined;
  const message = 'message' in error ? error.message : undefined;
  return code === 'PGRST205' || code === '42P01'
    || (typeof message === 'string' && /could not find the table .* in the schema cache|relation .* does not exist/i.test(message));
}

export default async function AdminInvoicePage({ params }: AdminInvoicePageProps) {
  const { id } = await params;
  let invoice: Awaited<ReturnType<typeof getAdminInvoice>>;
  try {
    invoice = await getAdminInvoice(id);
  } catch (error) {
    if (isMissingInvoiceSchema(error)) return <InvoiceSetupNotice />;
    throw error;
  }
  if (!invoice) notFound();
  return <InvoiceWorkspace initialInvoice={invoice} />;
}
