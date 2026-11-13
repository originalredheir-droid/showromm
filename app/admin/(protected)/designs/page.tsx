import Link from 'next/link';
import { getAdminCategories, getAdminDesigns } from '@/lib/catalog';

export default async function AdminDesignsPage() {
  const [categories, designs] = await Promise.all([getAdminCategories(), getAdminDesigns()]);
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Catalogue</h1>
          <p className="mt-1 text-sm text-[#C2C7D0]">Create, edit, publish, or archive showroom designs.</p>
        </div>
        {categories.length ? (
          <Link href="/admin/designs/new" className="rounded-lg bg-[#FF535B] px-4 py-2 text-sm font-semibold">
            Add item
          </Link>
        ) : (
          <span aria-disabled="true" className="rounded-lg bg-[#31353C] px-4 py-2 text-sm font-semibold text-[#8B9199]">
            Add item
          </span>
        )}
      </div>
      {!categories.length && (
        <p className="rounded-lg border border-dashed border-[#4B515B] p-5 text-sm text-[#C2C7D0]">
          Create a category before adding catalog items. <Link href="/admin/categories/new" className="text-[#FF535B] hover:underline">Add a category</Link>
        </p>
      )}
      {designs.length ? (
        <div className="overflow-hidden rounded-xl border border-[#31353C]">
          {designs.map((design) => (
            <div key={design.id} className="flex items-center justify-between gap-4 border-b border-[#31353C] bg-[#181C22] px-4 py-4 last:border-0">
              <div className="min-w-0">
                <h2 className="truncate font-medium">{design.title}</h2>
                <p className="mt-1 text-xs text-[#8B9199]">
                  {categoryNames.get(design.category_id) ?? 'Unavailable category'} · {design.status}
                </p>
              </div>
              <Link href={`/admin/designs/${design.id}`} className="shrink-0 text-sm text-[#FF535B] hover:underline">Edit</Link>
            </div>
          ))}
        </div>
      ) : (
        categories.length > 0 && (
          <p className="rounded-lg border border-dashed border-[#4B515B] p-8 text-center text-sm text-[#C2C7D0]">
            No catalog items yet. Create one to start building the public showroom.
          </p>
        )
      )}
    </div>
  );
}
