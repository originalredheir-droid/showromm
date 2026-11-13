create extension if not exists pgcrypto with schema extensions;

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon_name text not null default 'Layers',
  featured_image text not null default '',
  accent_badge text,
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_not_empty check (length(trim(name)) > 0),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.designs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category_id uuid not null references public.categories (id) on delete restrict,
  concept_type text not null default 'concept'
    check (concept_type in ('concept', 'page', 'module', 'section')),
  concept_type_label text not null default 'Complete Concept',
  short_description text not null default '',
  full_description text not null default '',
  visual_preview_image text not null default '',
  screen_previews jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  technical_specs jsonb not null default
    '{"devHours":0,"techStack":[],"responsiveBreakpoints":[],"deliverables":[]}'::jsonb,
  commercial jsonb not null default
    '{"estimatedBaseINR":0,"licenseType":"Custom","warrantyDays":0}'::jsonb,
  tags text[] not null default '{}',
  featured boolean not null default false,
  popular boolean not null default false,
  new_addition boolean not null default false,
  functional_notice text not null default '',
  related_ids text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint designs_title_not_empty check (length(trim(title)) > 0),
  constraint designs_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint designs_publish_ready check (
    status <> 'published'
    or (length(trim(short_description)) > 0 and length(trim(visual_preview_image)) > 0)
  )
);

create index designs_public_order_idx
  on public.designs (status, sort_order, created_at desc);
create index designs_category_idx on public.designs (category_id);
create index categories_public_order_idx on public.categories (is_active, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger designs_set_updated_at
before update on public.designs
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.designs enable row level security;

create policy "Admins can read their own admin record"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Public can read active categories"
  on public.categories for select to anon, authenticated
  using (is_active);

create policy "Admins can manage categories"
  on public.categories for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Public can read published designs in active categories"
  on public.designs for select to anon, authenticated
  using (
    (
      status = 'published'
      and exists (
        select 1
        from public.categories
        where categories.id = designs.category_id
          and categories.is_active
      )
    )
  );

create policy "Admins can manage designs"
  on public.designs for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.categories, public.designs to anon, authenticated;
grant insert, update, delete on public.categories, public.designs to authenticated;
grant select on public.admin_users to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'catalog-assets',
  'catalog-assets',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view catalog assets"
  on storage.objects for select to public
  using (bucket_id = 'catalog-assets');

create policy "Admins can upload catalog assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'catalog-assets' and (select public.is_admin()));

create policy "Admins can update catalog assets"
  on storage.objects for update to authenticated
  using (bucket_id = 'catalog-assets' and (select public.is_admin()))
  with check (bucket_id = 'catalog-assets' and (select public.is_admin()));

create policy "Admins can delete catalog assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'catalog-assets' and (select public.is_admin()));
