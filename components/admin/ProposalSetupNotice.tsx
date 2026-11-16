export function ProposalSetupNotice() {
  return (
    <div
      role="alert"
      className="mx-auto max-w-2xl rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 text-[#DFE2EB]"
    >
      <h1 className="text-lg font-semibold">Proposal setup is incomplete</h1>
      <p className="mt-2 text-sm text-[#C2C7D0]">
        The proposal and business profile tables are not available in the connected Supabase project.
        Apply the pending database migrations, then reload this page.
      </p>
      <code className="mt-4 block overflow-x-auto rounded-lg bg-[#10141A] p-3 text-xs text-[#DFE2EB]">
        npx supabase db push --remote
      </code>
      <p className="mt-3 text-xs text-[#8B9199]">
        Run this from the repository after linking the correct Supabase project.
      </p>
    </div>
  );
}
