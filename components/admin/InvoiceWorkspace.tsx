'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getAssetUrl } from '@/lib/assets';
import type { InvoiceDocument } from '@/lib/invoices';
import type { InvoiceItem } from '@/types/database';
import { formatINR } from '@/lib/utils';

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function printableDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function calculateTotal(items: InvoiceItem[], adjustment: number) {
  return Math.round((items.reduce((total, item) => total + (Number(item.amount) || 0), 0) + adjustment) * 100) / 100;
}

function PrintButton({
  label,
  receipt,
  beforePrint,
}: {
  label: string;
  receipt?: boolean;
  beforePrint?: () => void;
}) {
  const print = () => {
    beforePrint?.();
    document.body.classList.add(receipt ? 'printing-invoice-receipt' : 'printing-invoice');
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing-invoice');
      document.body.classList.remove('printing-invoice-receipt');
    }, { once: true });
    window.setTimeout(() => window.print(), receipt ? 100 : 0);
  };
  return (
    <button type="button" onClick={print} className="min-h-11 rounded-lg border border-[#31353C] px-4 py-2 text-sm hover:border-[#B9C9D5]">
      {label}
    </button>
  );
}

export function InvoiceWorkspace({ initialInvoice }: { initialInvoice: InvoiceDocument }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState(initialInvoice);
  const [issueDate, setIssueDate] = useState(today());
  const [paymentDate, setPaymentDate] = useState(today());
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentMemo, setPaymentMemo] = useState('');
  const [printReceiptId, setPrintReceiptId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const profile = invoice.businessProfile;
  const businessName = profile.brand_name || profile.company_name;
  const logoUrl = getAssetUrl(profile.logo_path);
  const total = calculateTotal(invoice.items, invoice.adjustmentAmount);
  const paid = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const balance = Math.max(0, invoice.totalAmount - paid);

  const saveDraft = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: invoice.clientName,
          clientCompany: invoice.clientCompany,
          clientEmail: invoice.clientEmail,
          clientPhone: invoice.clientPhone,
          projectName: invoice.projectName,
          items: invoice.items,
          adjustmentAmount: invoice.adjustmentAmount,
          adjustmentNote: invoice.adjustmentNote,
          dueDate: invoice.dueDate ?? '',
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save invoice draft.');
      setInvoice((current) => ({ ...current, totalAmount: total }));
      setMessage('Draft saved.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save invoice draft.');
    } finally {
      setBusy(false);
    }
  };

  const issueInvoice = async () => {
    if (!window.confirm('Issue this invoice? It will become read-only and receive its permanent number.')) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const saveResponse = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: invoice.clientName,
          clientCompany: invoice.clientCompany,
          clientEmail: invoice.clientEmail,
          clientPhone: invoice.clientPhone,
          projectName: invoice.projectName,
          items: invoice.items,
          adjustmentAmount: invoice.adjustmentAmount,
          adjustmentNote: invoice.adjustmentNote,
          dueDate: invoice.dueDate ?? '',
        }),
      });
      const saveResult = await saveResponse.json();
      if (!saveResponse.ok) throw new Error(saveResult.error || 'Could not save invoice draft.');

      const response = await fetch(`/api/invoices/${invoice.id}/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueDate }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not issue invoice.');
      setInvoice((current) => ({
        ...current,
        invoiceNumber: result.invoice_number,
        status: 'issued',
        issueDate,
        totalAmount: total,
      }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not issue invoice.');
    } finally {
      setBusy(false);
    }
  };

  const deleteDraft = async () => {
    if (!window.confirm('Delete this draft invoice? The saved proposal will not be changed.')) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not delete invoice draft.');
      router.replace('/admin/invoices');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete invoice draft.');
      setBusy(false);
    }
  };

  const recordPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentDate,
          amount: Number(paymentAmount),
          method: paymentMethod,
          reference: paymentReference,
          memo: paymentMemo,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not record payment.');
      setInvoice((current) => ({
        ...current,
        payments: [...current.payments, {
          id: result.payment_id,
          invoice_id: current.id,
          receipt_number: result.receipt_number,
          sequence_year: Number(paymentDate.slice(0, 4)),
          sequence_number: 0,
          payment_date: paymentDate,
          amount: Number(paymentAmount),
          method: paymentMethod,
          reference: paymentReference,
          memo: paymentMemo,
          created_by: '',
          created_at: new Date().toISOString(),
        }],
      }));
      setPaymentAmount('');
      setPaymentMethod('');
      setPaymentReference('');
      setPaymentMemo('');
      setMessage(`Payment recorded. Receipt ${result.receipt_number} is ready to print.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not record payment.');
    } finally {
      setBusy(false);
    }
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, ...updates } : item),
    }));
  };

  return (
    <div className="invoice-workspace space-y-5">
      <div className="print-hide flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/invoices" className="min-h-11 rounded-lg border border-[#31353C] px-4 py-2.5 text-sm text-[#C2C7D0] hover:border-[#B9C9D5]">
          ← Invoices
        </Link>
        {invoice.status === 'issued' && <PrintButton label="Print invoice / PDF" />}
      </div>

      {invoice.status === 'draft' ? (
        <section className="print-hide space-y-5 rounded-2xl border border-[#31353C] bg-[#181C22] p-5 sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B9C9D5]">Draft · from saved proposal</p>
            <h1 className="mt-1 text-2xl font-bold">Edit invoice</h1>
            <p className="mt-1 text-sm text-[#C2C7D0]">Adjust the scope and agreed price here. The original proposal remains unchanged.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {([
              ['clientName', 'Client name'],
              ['clientCompany', 'Client company'],
              ['clientEmail', 'Client email'],
              ['clientPhone', 'Client phone'],
              ['projectName', 'Project name'],
            ] as const).map(([field, label]) => (
              <label key={field} className="space-y-1 text-sm">
                <span className="text-[#C2C7D0]">{label}</span>
                <input
                  value={invoice[field]}
                  required={field === 'clientName' || field === 'projectName'}
                  onChange={(event) => setInvoice((current) => ({ ...current, [field]: event.target.value }))}
                  className="min-h-11 w-full rounded-lg border border-[#4B515B] bg-[#10141A] px-3 text-white"
                />
              </label>
            ))}
            <label className="space-y-1 text-sm">
              <span className="text-[#C2C7D0]">Payment due date (optional)</span>
              <input
                type="date"
                value={invoice.dueDate ?? ''}
                onChange={(event) => setInvoice((current) => ({ ...current, dueDate: event.target.value || null }))}
                className="min-h-11 w-full rounded-lg border border-[#4B515B] bg-[#10141A] px-3 text-white"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">Scope and agreed amounts</h2>
              <button
                type="button"
                onClick={() => setInvoice((current) => ({
                  ...current,
                  items: [...current.items, { id: crypto.randomUUID(), catalogTitle: 'Additional work', title: 'Additional work', description: '', image: '', amount: 0 }],
                }))}
                className="min-h-10 rounded-lg border border-[#4B515B] px-3 text-sm hover:border-[#B9C9D5]"
              >
                Add scope line
              </button>
            </div>
            {invoice.items.map((item) => (
              <article key={item.id} className="grid gap-3 rounded-xl border border-[#31353C] p-4 sm:grid-cols-[1fr_150px_auto]">
                <div className="grid gap-3">
                  <input aria-label="Line title" value={item.title} onChange={(event) => updateItem(item.id, { title: event.target.value })} placeholder="Work or item" className="min-h-10 rounded border border-[#4B515B] bg-[#10141A] px-3" />
                  <textarea aria-label="Line description" value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} placeholder="Scope details (optional)" rows={2} className="rounded border border-[#4B515B] bg-[#10141A] px-3 py-2" />
                </div>
                <label className="space-y-1 text-sm">
                  <span className="text-[#C2C7D0]">Final line amount (₹)</span>
                  <input type="number" min="0" step="0.01" value={item.amount} onChange={(event) => updateItem(item.id, { amount: Number(event.target.value) })} className="min-h-10 w-full rounded border border-[#4B515B] bg-[#10141A] px-3" />
                </label>
                <button type="button" onClick={() => setInvoice((current) => ({ ...current, items: current.items.filter((line) => line.id !== item.id) }))} aria-label={`Remove ${item.title}`} className="min-h-10 self-start rounded px-3 text-sm text-red-300 hover:bg-red-950">
                  Remove
                </button>
              </article>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-[#C2C7D0]">Discount or extra-work adjustment (+ / − ₹)</span>
              <input type="number" step="0.01" value={invoice.adjustmentAmount} onChange={(event) => setInvoice((current) => ({ ...current, adjustmentAmount: Number(event.target.value) }))} className="min-h-11 w-full rounded-lg border border-[#4B515B] bg-[#10141A] px-3" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-[#C2C7D0]">Adjustment reason</span>
              <input value={invoice.adjustmentNote} onChange={(event) => setInvoice((current) => ({ ...current, adjustmentNote: event.target.value }))} placeholder="Negotiated discount, extra work…" className="min-h-11 w-full rounded-lg border border-[#4B515B] bg-[#10141A] px-3" />
            </label>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[#31353C] pt-4">
            <div>
              <p className="text-sm text-[#C2C7D0]">Final invoice total</p>
              <p className="text-2xl font-bold tabular-nums">{formatINR(total)}</p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <label className="space-y-1 text-sm">
                <span className="block text-[#C2C7D0]">Invoice date</span>
                <input type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className="min-h-11 rounded-lg border border-[#4B515B] bg-[#10141A] px-3" />
              </label>
              <button type="button" onClick={saveDraft} disabled={busy} className="min-h-11 rounded-lg border border-[#4B515B] px-4 text-sm disabled:opacity-60">
                Save draft
              </button>
              <button type="button" onClick={deleteDraft} disabled={busy} className="min-h-11 rounded-lg border border-red-900 px-4 text-sm text-red-300 disabled:opacity-60">
                Delete draft
              </button>
              <button type="button" onClick={issueInvoice} disabled={busy || !invoice.items.length || total <= 0} className="min-h-11 rounded-lg bg-[#B9C9D5] px-4 font-semibold text-[#10141A] disabled:opacity-60">
                Issue invoice
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          <article className="invoice-document space-y-6 rounded-2xl border border-[#31353C] bg-white p-5 text-[#17202A] shadow-xl sm:p-9 print:border-0 print:p-0 print:shadow-none">
            <header className="grid gap-5 border-b-2 border-[#B9C9D5] pb-6 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="flex items-start gap-4">
                {logoUrl && <Image src={logoUrl} alt={businessName || 'Business logo'} width={140} height={100} unoptimized className="h-auto max-h-20 w-auto max-w-36 object-contain" />}
                <div className="space-y-1">
                  {businessName && <h1 className="text-xl font-bold">{businessName}</h1>}
                  {profile.company_name && profile.brand_name && profile.company_name !== profile.brand_name && <p className="text-sm text-[#475569]">{profile.company_name}</p>}
                  {profile.address && <p className="whitespace-pre-line text-xs text-[#475569]">{profile.address}</p>}
                  <p className="text-xs text-[#475569]">{[profile.email, profile.phone, profile.website].filter(Boolean).join(' · ')}</p>
                </div>
              </div>
              <div className="rounded-xl bg-[#F1F5F9] p-4 sm:min-w-56 sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Invoice</p>
                <p className="mt-1 break-all font-mono text-sm font-semibold">{invoice.invoiceNumber}</p>
                <p className="mt-2 text-xs text-[#475569]">Date: {invoice.issueDate ? printableDate(invoice.issueDate) : ''}</p>
                {invoice.dueDate && <p className="mt-1 text-xs text-[#475569]">Due: {printableDate(invoice.dueDate)}</p>}
              </div>
            </header>

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#D5DCE3] p-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Bill to</h2>
                <p className="mt-2 font-semibold">{invoice.clientName}</p>
                {invoice.clientCompany && <p className="text-sm text-[#475569]">{invoice.clientCompany}</p>}
                {invoice.clientEmail && <p className="text-sm text-[#475569]">{invoice.clientEmail}</p>}
                {invoice.clientPhone && <p className="text-sm text-[#475569]">{invoice.clientPhone}</p>}
              </div>
              <div className="rounded-xl border border-[#D5DCE3] p-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Project</h2>
                <p className="mt-2 font-semibold">{invoice.projectName}</p>
                <p className="mt-2 text-xs text-[#64748B]">Reference proposal · unchanged</p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold">Scope and charges</h2>
              <div className="overflow-hidden rounded-xl border border-[#D5DCE3]">
                {invoice.items.map((item) => (
                  <div key={item.id} className="grid gap-2 border-b border-[#D5DCE3] p-4 last:border-b-0 sm:grid-cols-[1fr_auto]">
                    <div><h3 className="font-semibold">{item.title}</h3>{item.description && <p className="mt-1 whitespace-pre-line text-sm text-[#475569]">{item.description}</p>}</div>
                    <p className="font-semibold sm:text-right">{formatINR(item.amount)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="ml-auto max-w-md space-y-2 rounded-xl bg-[#F1F5F9] p-5">
              {invoice.adjustmentAmount !== 0 && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-[#475569]">{invoice.adjustmentNote || 'Adjustment'}</span>
                  <span>{formatINR(invoice.adjustmentAmount)}</span>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-[#CBD5E1] pt-3 text-lg font-bold">
                <span>Total</span><span>{formatINR(invoice.totalAmount)}</span>
              </div>
            </section>
            <footer className="border-t border-[#D5DCE3] pt-4 text-xs text-[#64748B]">
              This is a commercial invoice and does not include tax calculations.
            </footer>
          </article>

          <section className="print-hide space-y-4 rounded-2xl border border-[#31353C] bg-[#181C22] p-5">
            <div>
              <h2 className="text-xl font-bold">Payments and receipts</h2>
              <p className="mt-1 text-sm text-[#C2C7D0]">Paid {formatINR(paid)} · Remaining {formatINR(balance)}</p>
            </div>
            {invoice.payments.map((payment) => (
              <div key={payment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#31353C] p-4">
                <div>
                  <p className="font-semibold">{payment.receipt_number} · {formatINR(Number(payment.amount))}</p>
                  <p className="text-sm text-[#C2C7D0]">{printableDate(payment.payment_date)}{payment.method ? ` · ${payment.method}` : ''}{payment.reference ? ` · ${payment.reference}` : ''}</p>
                </div>
                <PrintButton
                  label="Print receipt"
                  receipt
                  beforePrint={() => setPrintReceiptId(payment.id)}
                />
              </div>
            ))}
            {balance > 0 && (
              <form onSubmit={recordPayment} className="grid gap-3 rounded-xl border border-[#31353C] p-4 sm:grid-cols-2">
                <h3 className="font-semibold sm:col-span-2">Record a payment</h3>
                <label className="space-y-1 text-sm"><span className="text-[#C2C7D0]">Amount (₹)</span><input type="number" min="0.01" max={balance} step="0.01" required value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} className="min-h-11 w-full rounded-lg border border-[#4B515B] bg-[#10141A] px-3" /></label>
                <label className="space-y-1 text-sm"><span className="text-[#C2C7D0]">Payment date</span><input type="date" min={invoice.issueDate ?? undefined} max={today()} required value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} className="min-h-11 w-full rounded-lg border border-[#4B515B] bg-[#10141A] px-3" /></label>
                <label className="space-y-1 text-sm"><span className="text-[#C2C7D0]">Method (optional)</span><input value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="min-h-11 w-full rounded-lg border border-[#4B515B] bg-[#10141A] px-3" /></label>
                <label className="space-y-1 text-sm"><span className="text-[#C2C7D0]">Reference (optional)</span><input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} className="min-h-11 w-full rounded-lg border border-[#4B515B] bg-[#10141A] px-3" /></label>
                <label className="space-y-1 text-sm sm:col-span-2"><span className="text-[#C2C7D0]">Note (optional)</span><input value={paymentMemo} onChange={(event) => setPaymentMemo(event.target.value)} className="min-h-11 w-full rounded-lg border border-[#4B515B] bg-[#10141A] px-3" /></label>
                <button disabled={busy} className="min-h-11 rounded-lg bg-[#B9C9D5] px-4 font-semibold text-[#10141A] disabled:opacity-60 sm:col-span-2">Record payment and create receipt</button>
              </form>
            )}
          </section>
          {printReceiptId && (() => {
            const receipt = invoice.payments.find((payment) => payment.id === printReceiptId);
            if (!receipt) return null;
            return (
              <article className="receipt-document hidden rounded-xl border border-[#D5DCE3] bg-white p-8 text-[#17202A]">
                <div className="mb-6 border-b-2 border-[#B9C9D5] pb-4">
                  <h2 className="text-xl font-bold">{businessName || 'Payment receipt'}</h2>
                  <p className="mt-1 text-xs text-[#475569]">{profile.address}</p>
                  <p className="mt-1 text-xs text-[#475569]">{[profile.email, profile.phone, profile.website].filter(Boolean).join(' · ')}</p>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Payment receipt</p>
                <h1 className="mt-1 text-2xl font-bold">{receipt.receipt_number}</h1>
                <p className="mt-5">Received from <strong>{invoice.clientName}</strong></p>
                <p className="mt-2">Amount received: <strong>{formatINR(Number(receipt.amount))}</strong></p>
                <p className="mt-2">Date: {printableDate(receipt.payment_date)}</p>
                <p className="mt-2">Against invoice: {invoice.invoiceNumber}</p>
                {receipt.method && <p className="mt-2">Payment method: {receipt.method}</p>}
                {receipt.reference && <p className="mt-2">Reference: {receipt.reference}</p>}
                {receipt.memo && <p className="mt-2">Note: {receipt.memo}</p>}
              </article>
            );
          })()}
        </>
      )}
      {message && <p role="status" className="print-hide text-sm text-emerald-300">{message}</p>}
      {error && <p role="alert" className="print-hide text-sm text-red-400">{error}</p>}
    </div>
  );
}
