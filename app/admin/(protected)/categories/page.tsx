import Link from 'next/link';
import { getAdminCategories } from '@/lib/catalog';

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-[#C2C7D0]">Organize the public showroom. Inactive categories are hidden.</p>
        </div>
        <Link href="/admin/categories/new" className="rounded-lg bg-[#B9C9D5] px-4 py-2 text-sm font-semibold text-[#10141A]">Add category</Link>
      </div>
      {categories.length ? (
        <div className="overflow-hidden rounded-xl border border-[#31353C]">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between gap-4 border-b border-[#31353C] bg-[#181C22] px-4 py-4 last:border-0">
              <div>
                <h2 className="font-medium">{category.name}</h2>
                <p className="mt-1 text-xs text-[#8B9199]">/{category.slug} · {category.is_active ? 'Active' : 'Hidden'}</p>
              </div>
              <Link href={`/admin/categories/${category.id}`} className="text-sm text-[#B9C9D5] hover:underline">Edit</Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[#4B515B] p-8 text-center text-sm text-[#C2C7D0]">
          No categories yet. Add one before creating catalog items.
        </p>
      )}
    </div>
  );
}
