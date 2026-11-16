'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BusinessProfile } from '@/lib/proposals';
import { AssetPicker } from './AssetPicker';

interface BusinessProfileFormProps {
  initialProfile: BusinessProfile;
}

export function BusinessProfileForm({ initialProfile }: BusinessProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [errorMessage, setErrorMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSaved(false);
    setIsSaving(true);

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setErrorMessage(authError?.message ?? 'Sign in as an admin to save business details.');
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from('business_profiles').upsert({
      id: true,
      company_name: profile.companyName.trim(),
      brand_name: profile.brandName.trim(),
      address: profile.address.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      website: profile.website.trim(),
      logo_path: profile.logoPath,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSaved(true);
    }
    setIsSaving(false);
  };

  const update = (key: keyof BusinessProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <section className="grid gap-4 rounded-xl border border-[#31353C] bg-[#181C22] p-4 sm:grid-cols-2 sm:p-5">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-[#C2C7D0]">Business / enterprise name</span>
          <input value={profile.companyName} onChange={(event) => update('companyName', event.target.value)} className="admin-input min-h-11" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-[#C2C7D0]">Brand name</span>
          <input value={profile.brandName} onChange={(event) => update('brandName', event.target.value)} className="admin-input min-h-11" />
        </label>
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-[#C2C7D0]">Business address</span>
          <textarea value={profile.address} onChange={(event) => update('address', event.target.value)} rows={3} className="admin-input" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-[#C2C7D0]">Business email</span>
          <input type="email" value={profile.email} onChange={(event) => update('email', event.target.value)} className="admin-input min-h-11" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-[#C2C7D0]">Business phone</span>
          <input type="tel" value={profile.phone} onChange={(event) => update('phone', event.target.value)} className="admin-input min-h-11" />
        </label>
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-[#C2C7D0]">Website</span>
          <input type="url" value={profile.website} onChange={(event) => update('website', event.target.value)} className="admin-input min-h-11" />
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-[#31353C] bg-[#181C22] p-4 sm:p-5">
        <h2 className="font-semibold">Proposal logo</h2>
        <AssetPicker
          label="Business logo"
          folder="business"
          value={profile.logoPath ? [profile.logoPath] : []}
          onChange={(paths) => update('logoPath', paths[0] ?? '')}
        />
        <p className="text-xs text-[#8B9199]">
          This identity profile is available only in the admin area. The uploaded logo is stored with the showroom’s public catalog images.
        </p>
      </section>

      {errorMessage && <p role="alert" className="text-sm text-red-400">{errorMessage}</p>}
      {saved && <p role="status" className="text-sm text-emerald-400">Business profile saved.</p>}
      <button disabled={isSaving} className="min-h-11 rounded-lg bg-[#B9C9D5] px-5 py-2.5 text-sm font-semibold text-[#10141A] disabled:opacity-60">
        {isSaving ? 'Saving…' : 'Save business profile'}
      </button>
    </form>
  );
}
