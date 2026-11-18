import { NextResponse } from 'next/server';
import { isProposalSchemaUnavailable, getBusinessProfile } from '@/lib/proposals';
import { getAssetUrl } from '@/lib/assets';

export async function GET() {
  try {
    const profile = await getBusinessProfile();
    return NextResponse.json({
      profile: {
        ...profile,
        logoPath: getAssetUrl(profile.logoPath),
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;
    if (isProposalSchemaUnavailable(error) || code === '42501') {
      return NextResponse.json({
        profile: {
          companyName: '',
          brandName: '',
          address: '',
          email: '',
          phone: '',
          website: '',
          logoPath: '',
        },
        warning: 'Business branding is unavailable until the proposal database migrations are applied.',
      }, { headers: { 'Cache-Control': 'no-store' } });
    }
    console.error('Failed to load public proposal branding:', error);
    return NextResponse.json({ error: 'Could not load proposal branding.' }, { status: 500 });
  }
}
