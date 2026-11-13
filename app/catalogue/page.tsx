import { CatalogueBrowser } from '@/components/catalogue/CatalogueBrowser';
import { getPublicCatalog } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export default async function CataloguePage() {
  const { categories, designs } = await getPublicCatalog();
  return <CatalogueBrowser categories={categories} designs={designs} />;
}
