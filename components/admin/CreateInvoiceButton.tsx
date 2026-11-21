'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CreateInvoiceButton({ proposalId }: { proposalId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const createInvoice = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not create an invoice draft.');
      router.push(`/admin/invoices/${result.invoiceId}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create an invoice draft.');
      setBusy(false);
    }
  };

  return (
    <div className="print-hide">
      <button
        type="button"
        onClick={createInvoice}
        disabled={busy}
        className="min-h-11 rounded-lg bg-[#B9C9D5] px-4 py-2.5 text-sm font-semibold text-[#10141A] disabled:opacity-60"
      >
        {busy ? 'Creating draft…' : 'Create invoice draft'}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
