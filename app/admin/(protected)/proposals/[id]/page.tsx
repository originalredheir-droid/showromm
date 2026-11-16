import { notFound } from 'next/navigation';
import { ProposalSetupNotice } from '@/components/admin/ProposalSetupNotice';
import { ProposalDocument } from '@/components/proposals/ProposalDocument';
import { getAdminProposal, isProposalSchemaUnavailable } from '@/lib/proposals';

interface AdminProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProposalPage({ params }: AdminProposalPageProps) {
  const { id } = await params;
  let proposal: Awaited<ReturnType<typeof getAdminProposal>>;
  try {
    proposal = await getAdminProposal(id);
  } catch (error) {
    if (isProposalSchemaUnavailable(error)) return <ProposalSetupNotice />;
    throw error;
  }
  if (!proposal) notFound();

  return <ProposalDocument proposal={proposal} />;
}
