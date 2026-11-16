import Link from 'next/link';
import { BusinessProfileForm } from '@/components/admin/BusinessProfileForm';
import { ProposalSetupNotice } from '@/components/admin/ProposalSetupNotice';
import { getBusinessProfile, isProposalSchemaUnavailable } from '@/lib/proposals';

export default async function BusinessSettingsPage() {
  let profile: Awaited<ReturnType<typeof getBusinessProfile>>;
  try {
    profile = await getBusinessProfile();
  } catch (error) {
    if (isProposalSchemaUnavailable(error)) return <ProposalSetupNotice />;
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/admin" className="text-sm text-[#C2C7D0] hover:text-white">← Admin overview</Link>
      <div>
        <h1 className="text-2xl font-bold">Business profile</h1>
        <p className="mt-1 text-sm text-[#C2C7D0]">
          Add the identity and contact details that should appear on proposals. Leave fields blank until you are ready to provide them.
        </p>
      </div>
      <BusinessProfileForm initialProfile={profile} />
    </div>
  );
}
