export function StorageSetupNotice() {
  return (
    <div
      role="alert"
      className="mx-auto max-w-2xl rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 text-[#DFE2EB]"
    >
      <h1 className="text-lg font-semibold">Storage report setup is incomplete</h1>
      <p className="mt-2 text-sm text-[#C2C7D0]">
        The storage usage report is not installed in the connected Supabase project yet. Apply the pending migrations, then reload this page.
      </p>
      <code className="mt-4 block overflow-x-auto rounded-lg bg-[#10141A] p-3 text-xs text-[#DFE2EB]">
        npx supabase db push --linked
      </code>
    </div>
  );
}
