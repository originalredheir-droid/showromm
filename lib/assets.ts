export function getAssetUrl(path: string) {
  if (!path || /^https?:\/\//i.test(path)) return path;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL.');
  }
  return `${url.replace(/\/$/, '')}/storage/v1/object/public/catalog-assets/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
}
