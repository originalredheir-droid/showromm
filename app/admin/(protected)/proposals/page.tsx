import Link from 'next/link';
import { FileText } from 'lucide-react';
import { ProposalSetupNotice } from '@/components/admin/ProposalSetupNotice';
import { getAdminProposals, isProposalSchemaUnavailable } from '@/lib/proposals';
import { formatINR } from '@/lib/utils';

export default async function AdminProposalsPage() {
  let proposals: Awaited<ReturnType<typeof getAdminProposals>>;
  try {
    proposals = await getAdminProposals();
  } catch (error) {
    if (isProposalSchemaUnavailable(error)) return <ProposalSetupNotice />;
    throw error;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Saved proposals</h1>
        <p className="mt-1 text-sm text-[#C2C7D0]">Admin-only proposal records, including client and project details.</p>
      </div>
      {proposals.length ? (
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <Link
              key={proposal.id}
              href={`/admin/proposals/${proposal.id}`}
              className="flex min-h-20 flex-col justify-between gap-3 rounded-xl border border-[#31353C] bg-[#181C22] p-4 transition-colors hover:border-[#B9C9D5] sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 items-start gap-3">
                <FileText className="mt-1 h-5 w-5 shrink-0 text-[#B9C9D5]" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{proposal.proposalNumber}</p>
                  <p className="mt-1 truncate text-sm text-[#C2C7D0]">{proposal.projectName} · {proposal.clientName}</p>
                  <p className="mt-1 text-xs text-[#8B9199]">{new Date(`${proposal.proposalDate}T00:00:00`).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-[#DFE2EB]">{formatINR(proposal.totalEstimatedINR)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-[#4B515B] p-8 text-center text-sm text-[#C2C7D0]">
          Saved proposals will appear here after you create one from the selection cart.
        </p>
      )}
    </div>
  );
}
