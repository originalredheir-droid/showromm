import type { Category, Design } from '@/types';
import type { CategoryRow, DesignRow } from '@/types/database';
import { createClient } from '@/lib/supabase/server';

const STORAGE_BUCKET = 'catalog-assets';

export function getAssetUrl(path: string) {
  if (!path || /^https?:\/\//i.test(path)) return path;
  const { url } = getSupabaseAssetConfig();
  return `${url}/storage/v1/object/public/${STORAGE_BUCKET}/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
}

function getSupabaseAssetConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL.');
  }
  return { url: url.replace(/\/$/, '') };
}

export function mapCategory(
  row: CategoryRow,
  counts: { modules: number; portals: number } = { modules: 0, portals: 0 }
): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    iconName: row.icon_name,
    moduleCount: counts.modules,
    portalCount: counts.portals,
    featuredImage: getAssetUrl(row.featured_image),
    accentBadge: row.accent_badge ?? undefined,
    tags: row.tags,
  };
}

export function mapDesign(row: DesignRow, category: CategoryRow): Design {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    categoryId: row.category_id,
    categoryName: category.name,
    conceptType: row.concept_type,
    conceptTypeLabel: row.concept_type_label,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    visualPreviewImage: getAssetUrl(row.visual_preview_image),
    screenPreviews: row.screen_previews.map((screen) => ({
      ...screen,
      image: getAssetUrl(screen.image),
    })),
    features: row.features,
    technicalSpecs: row.technical_specs,
    commercial: row.commercial,
    tags: row.tags,
    featured: row.featured,
    popular: row.popular,
    newAddition: row.new_addition,
    functionalNotice: row.functional_notice,
    relatedIds: row.related_ids,
    status: row.status,
  };
}

export async function getPublicCatalog() {
  const supabase = await createClient();
  const [categoriesResult, designsResult] = await Promise.all([
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('designs').select('*').eq('status', 'published').order('sort_order'),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (designsResult.error) throw designsResult.error;

  const categoriesById = new Map(
    categoriesResult.data.map((category) => [category.id, category])
  );
  const designs = designsResult.data.flatMap((design) => {
    const category = categoriesById.get(design.category_id);
    return category ? [mapDesign(design, category)] : [];
  });
  const categories = categoriesResult.data.map((category) =>
    mapCategory(category, {
      modules: designs.filter((design) => design.categoryId === category.id).length,
      portals: designs.filter(
        (design) => design.categoryId === category.id && design.conceptType === 'concept'
      ).length,
    })
  );

  return { categories, designs };
}

export async function getAdminCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getAdminDesigns() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAdminDesign(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
