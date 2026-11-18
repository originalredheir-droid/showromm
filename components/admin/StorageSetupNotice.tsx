type StorageSetupNoticeProps = {
  reason: 'migration' | 'permissions' | 'unavailable';
  reference?: string;
};

const noticeContent = {
  migration: {
    title: 'Storage report setup is incomplete',
    description: 'The storage usage function is not available in the connected Supabase project. Review pending migrations and apply the storage-usage migration, then reload this page.',
  },
  permissions: {
    title: 'Storage report access needs attention',
    description: 'The storage report could not read file metadata. Confirm the storage migration is applied and your signed-in account is still listed as an admin.',
  },
  unavailable: {
    title: 'Storage metrics are temporarily unavailable',
    description: 'The storage report could not be loaded. Check the latest Vercel function logs and Supabase project status, then try again.',
  },
} satisfies Record<StorageSetupNoticeProps['reason'], { title: string; description: string }>;

export function StorageSetupNotice({ reason, reference }: StorageSetupNoticeProps) {
  const content = noticeContent[reason];

  return (
    <div
      role="alert"
      className="mx-auto max-w-2xl rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 text-[#DFE2EB]"
    >
      <h1 className="text-lg font-semibold">{content.title}</h1>
      <p className="mt-2 text-sm text-[#C2C7D0]">{content.description}</p>
      {reason === 'migration' && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-[#C2C7D0]">From the repository, review pending production migrations before applying them:</p>
          <code className="block overflow-x-auto rounded-lg bg-[#10141A] p-3 text-xs text-[#DFE2EB]">
            npx supabase migration list --remote
          </code>
          <code className="block overflow-x-auto rounded-lg bg-[#10141A] p-3 text-xs text-[#DFE2EB]">
            npx supabase db push --remote
          </code>
        </div>
      )}
      {reference && <p className="mt-3 text-xs text-[#8B9199]">Reference: {reference}</p>}
    </div>
  );
}
