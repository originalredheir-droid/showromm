import type { BusinessProfileRow, ProposalRow } from '@/types/database';
import { createClient } from '@/lib/supabase/server';
import { getAssetUrl } from '@/lib/assets';

export interface BusinessProfile {
  companyName: string;
  brandName: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logoPath: string;
}

export interface ProposalDocument {
  id: string;
  proposalNumber: string;
  proposalDate: string;
  validUntil: string | null;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  projectBrief: string;
  notes: string;
  items: ProposalRow['items'];
  businessProfile: BusinessProfile;
  totalEstimatedINR: number;
  totalEstimatedHours: number;
  createdAt: string;
}

export function isProposalSchemaUnavailable(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;

  const code = 'code' in error ? error.code : undefined;
  const message = 'message' in error ? error.message : undefined;

  return code === 'PGRST205'
    || code === '42P01'
    || (
      typeof message === 'string'
      && /could not find the table .* in the schema cache|relation .* does not exist/i.test(message)
    );
}

export function mapBusinessProfile(
  row: Pick<BusinessProfileRow, 'company_name' | 'brand_name' | 'address' | 'email' | 'phone' | 'website' | 'logo_path'> | null
): BusinessProfile {
  return {
    companyName: row?.company_name ?? '',
    brandName: row?.brand_name ?? '',
    address: row?.address ?? '',
    email: row?.email ?? '',
    phone: row?.phone ?? '',
    website: row?.website ?? '',
    logoPath: row?.logo_path ?? '',
  };
}

function mapProposal(row: ProposalRow): ProposalDocument {
  const profile = row.business_profile;
  return {
    id: row.id,
    proposalNumber: row.proposal_number,
    proposalDate: row.proposal_date,
    validUntil: row.valid_until,
    clientName: row.client_name,
    clientCompany: row.client_company,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    projectName: row.project_name,
    projectBrief: row.project_brief,
    notes: row.notes,
    items: row.items,
    businessProfile: {
      companyName: profile?.company_name ?? '',
      brandName: profile?.brand_name ?? '',
      address: profile?.address ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? '',
      website: profile?.website ?? '',
      logoPath: profile?.logo_path ?? '',
    },
    totalEstimatedINR: Number(row.total_estimated_inr),
    totalEstimatedHours: Number(row.total_estimated_hours),
    createdAt: row.created_at,
  };
}

export async function getBusinessProfile() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('business_profiles')
    .select('company_name, brand_name, address, email, phone, website, logo_path')
    .maybeSingle();
  if (error) throw error;
  return mapBusinessProfile(data);
}

export async function getAdminProposals() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(mapProposal);
}

export async function getAdminProposal(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProposal(data) : null;
}
