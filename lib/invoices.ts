import type {
  BusinessProfileSnapshot,
  InvoiceItem,
  InvoicePaymentRow,
  InvoiceRow,
} from '@/types/database';
import { createClient } from '@/lib/supabase/server';

export interface InvoiceDocument {
  id: string;
  proposalId: string;
  invoiceNumber: string | null;
  status: 'draft' | 'issued';
  issueDate: string | null;
  dueDate: string | null;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  items: InvoiceItem[];
  adjustmentAmount: number;
  adjustmentNote: string;
  businessProfile: BusinessProfileSnapshot;
  totalAmount: number;
  createdAt: string;
  payments: InvoicePaymentRow[];
  paidAmount: number;
  balanceDue: number;
}

function mapInvoice(row: InvoiceRow, payments: InvoicePaymentRow[] = []): InvoiceDocument {
  const totalAmount = Number(row.total_amount);
  const paidAmount = payments.reduce((total, payment) => total + Number(payment.amount), 0);

  return {
    id: row.id,
    proposalId: row.proposal_id,
    invoiceNumber: row.invoice_number,
    status: row.status,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    clientName: row.client_name,
    clientCompany: row.client_company,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    projectName: row.project_name,
    items: row.items.map((item) => ({ ...item, amount: Number(item.amount) })),
    adjustmentAmount: Number(row.adjustment_amount),
    adjustmentNote: row.adjustment_note,
    businessProfile: row.business_profile,
    totalAmount,
    createdAt: row.created_at,
    payments,
    paidAmount,
    balanceDue: Math.max(0, totalAmount - paidAmount),
  };
}

export async function getAdminInvoices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((row) => mapInvoice(row));
}

export async function getAdminInvoice(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { data: payments, error: paymentsError } = await supabase
    .from('invoice_payments')
    .select('*')
    .eq('invoice_id', id)
    .order('payment_date', { ascending: true })
    .order('created_at', { ascending: true });
  if (paymentsError) throw paymentsError;
  return mapInvoice(data, payments);
}
