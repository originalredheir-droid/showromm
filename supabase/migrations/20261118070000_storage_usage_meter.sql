create table public.admin_storage_settings (
  id boolean primary key default true check (id),
  quota_bytes bigint check (quota_bytes is null or quota_bytes > 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.admin_storage_settings enable row level security;
revoke all on public.admin_storage_settings from public, anon, authenticated;

create or replace function public.get_catalog_storage_usage()
returns table (
  total_storage_bytes bigint,
  total_storage_objects bigint,
  catalog_asset_bytes bigint,
  catalog_asset_objects bigint,
  referenced_catalog_bytes bigint,
  referenced_catalog_objects bigint,
  published_catalog_count bigint,
  quota_bytes bigint
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access is required.'
      using errcode = '42501';
  end if;

  return query
  with objects as (
    select
      object.bucket_id,
      object.name,
      case
        when object.metadata->>'size' ~ '^[0-9]+$'
          then (object.metadata->>'size')::bigint
        else 0::bigint
      end as size_bytes
    from storage.objects as object
  ),
  referenced_paths as (
    select distinct images.image_path
    from (
      select design.visual_preview_image as image_path
      from public.designs as design
      where design.status = 'published'
        and design.visual_preview_image <> ''
        and design.visual_preview_image !~* '^https?://'

      union all

      select screen.value->>'image' as image_path
      from public.designs as design
      cross join lateral jsonb_array_elements(
        case
          when jsonb_typeof(design.screen_previews) = 'array'
            then design.screen_previews
          else '[]'::jsonb
        end
      ) as screen(value)
      where design.status = 'published'
        and coalesce(screen.value->>'image', '') <> ''
        and screen.value->>'image' !~* '^https?://'
    ) as images
  ),
  stats as (
    select
      coalesce(sum(object.size_bytes), 0)::bigint as total_bytes,
      count(*)::bigint as total_objects,
      coalesce(sum(object.size_bytes) filter (where object.bucket_id = 'catalog-assets'), 0)::bigint as catalog_bytes,
      (count(*) filter (where object.bucket_id = 'catalog-assets'))::bigint as catalog_objects,
      coalesce(sum(object.size_bytes) filter (
        where object.bucket_id = 'catalog-assets'
          and object.name in (select path.image_path from referenced_paths as path)
      ), 0)::bigint as referenced_bytes,
      (count(*) filter (
        where object.bucket_id = 'catalog-assets'
          and object.name in (select path.image_path from referenced_paths as path)
      ))::bigint as referenced_objects
    from objects as object
  ),
  settings as (
    select setting.quota_bytes
    from public.admin_storage_settings as setting
    where setting.id = true
  )
  select
    stats.total_bytes,
    stats.total_objects,
    stats.catalog_bytes,
    stats.catalog_objects,
    stats.referenced_bytes,
    stats.referenced_objects,
    (select count(*)::bigint from public.designs as design where design.status = 'published'),
    (select settings.quota_bytes from settings);
end;
$$;

create or replace function public.set_catalog_storage_quota(p_quota_bytes bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access is required.'
      using errcode = '42501';
  end if;

  if p_quota_bytes is not null and p_quota_bytes <= 0 then
    raise exception 'Storage quota must be greater than zero.'
      using errcode = '22023';
  end if;

  insert into public.admin_storage_settings as existing_setting (
    id,
    quota_bytes,
    updated_at,
    updated_by
  )
  values (true, p_quota_bytes, now(), auth.uid())
  on conflict (id) do update
  set quota_bytes = excluded.quota_bytes,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by;
end;
$$;

revoke all on function public.get_catalog_storage_usage() from public, anon;
revoke all on function public.set_catalog_storage_quota(bigint) from public, anon;
grant execute on function public.get_catalog_storage_usage() to authenticated;
grant execute on function public.set_catalog_storage_quota(bigint) to authenticated;
