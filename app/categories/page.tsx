import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { PublicEmptyState } from '@/components/catalogue/PublicEmptyState';
import { getPublicCatalog } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const { categories } = await getPublicCatalog();
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#31353C]">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-[#FF535B]" />
            <span className="text-xs uppercase tracking-wider text-[#FF535B] font-semibold">
              Taxonomy & Vertical Engines
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#DFE2EB]">
            Industry Domain Categories
          </h1>
          <p className="text-sm text-[#C2C7D0] mt-1 max-w-2xl">
            Pre-architected industry engines engineered for rapid tailored deployment.
            Click any sector to explore its associated website designs, modules, and screens.
          </p>
        </div>

        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#262A31] hover:bg-[#31353C] text-xs font-semibold text-[#DFE2EB] border border-[#31353C] transition-colors self-start sm:self-auto"
        >
          <span>View All Designs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {categories.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} span="col-span-1" />
          ))}
        </div>
      ) : (
        <PublicEmptyState
          title="No categories yet"
          description="The showroom’s industry categories are being prepared. Please check back soon."
        />
      )}
    </div>
  );
}
