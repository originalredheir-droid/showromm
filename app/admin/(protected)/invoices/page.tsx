import Link from 'next/link';
import { FileText } from 'lucide-react';
import { InvoiceSetupNotice } from '@/components/admin/InvoiceSetupNotice';
import { getAdminInvoices } from '@/lib/invoices';
import { formatINR } from '@/lib/utils';

function isMissingInvoiceSchema(error: unknown) {
  if (typeof error !== 'object' || error === null) return false;
  const code = 'code' in error ? error.code : undefined;
  const message = 'message' in error ? error.message : undefined;
  return code === 'PGRST205' || code === '42P01'
    || (typeof message === 'string' && /could not find the table .* in the schema cache|relation .* does not exist/i.test(message));
}

export default async function AdminInvoicesPage() {
  let invoices: Awaited<ReturnType<typeof getAdminInvoices>>;
  try {
    invoices = await getAdminInvoices();
  } catch (error) {
    if (isMissingInvoiceSchema(error)) return <InvoiceSetupNotice />;
    throw error;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Invoices and receipts</h1>
        <p className="mt-1 text-sm text-[#C2C7D0]">Drafts can be edited. Issued invoices and recorded payment history are locked.</p>
      </div>
      {invoices.length ? (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Link key={invoice.id} href={`/admin/invoices/${invoice.id}`} className="flex min-h-20 flex-col justify-between gap-3 rounded-xl border border-[#31353C] bg-[#181C22] p-4 hover:border-[#B9C9D5] sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-start gap-3">
                <FileText className="mt-1 h-5 w-5 shrink-0 text-[#B9C9D5]" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{invoice.invoiceNumber || 'Draft invoice'}</p>
                  <p className="mt-1 truncate text-sm text-[#C2C7D0]">{invoice.projectName} · {invoice.clientName}</p>
                  <p className="mt-1 text-xs text-[#8B9199]">{invoice.status === 'draft' ? 'Not issued' : invoice.balanceDue === 0 ? 'Paid' : invoice.paidAmount > 0 ? 'Partially paid' : 'Unpaid'}</p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">{formatINR(invoice.totalAmount)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-[#4B515B] p-8 text-center text-sm text-[#C2C7D0]">
          No invoices yet. Open a saved proposal to create an invoice draft from it.
        </p>
      )}
    </div>
  );
}
