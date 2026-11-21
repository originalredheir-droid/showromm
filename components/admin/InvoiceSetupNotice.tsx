import Link from 'next/link';

export function InvoiceSetupNotice() {
  return (
    <section className="space-y-3 rounded-xl border border-amber-500/40 bg-amber-950/20 p-5">
      <h1 className="text-xl font-bold">Invoice setup is incomplete</h1>
      <p className="text-sm text-[#C2C7D0]">
        Invoice and receipt tables are not available in the connected Supabase project. Review the migration, apply it to the intended project, then reload.
      </p>
      <Link href="/admin/proposals" className="inline-flex min-h-10 items-center rounded-lg border border-[#4B515B] px-3 text-sm hover:border-[#B9C9D5]">
        Back to proposals
      </Link>
    </section>
  );
}
