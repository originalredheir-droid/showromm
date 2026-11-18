create policy "Public can read proposal business profile"
  on public.business_profiles for select to anon, authenticated
  using (true);

revoke select on public.business_profiles from anon, authenticated;
grant select (company_name, brand_name, address, email, phone, website, logo_path)
  on public.business_profiles to anon, authenticated;
grant select (id) on public.business_profiles to authenticated;
