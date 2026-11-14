import Link from 'next/link';
import { getAdminCategories, getAdminDesigns } from '@/lib/catalog';

export default async function AdminOverviewPage() {
  const [categories, designs] = await Promise.all([getAdminCategories(), getAdminDesigns()]);
  const publishedCount = designs.filter((design) => design.status === 'published').length;
  const draftCount = designs.filter((design) => design.status === 'draft').length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#B9C9D5]">Admin overview</p>
        <h1 className="mt-2 text-2xl font-bold">Manage your showroom</h1>
        <p className="mt-2 text-sm text-[#C2C7D0]">Create categories and catalog items. Draft items stay hidden from visitors.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Categories', value: categories.length },
          { label: 'Published items', value: publishedCount },
          { label: 'Draft items', value: draftCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#31353C] bg-[#181C22] p-5">
            <p className="text-xs text-[#8B9199]">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/categories/new" className="rounded-xl border border-[#31353C] bg-[#181C22] p-5 hover:border-[#B9C9D5]">
          <h2 className="font-semibold">Create a category</h2>
          <p className="mt-1 text-sm text-[#C2C7D0]">Set up a category before adding items.</p>
        </Link>
        <Link href="/admin/designs/new" className="rounded-xl border border-[#31353C] bg-[#181C22] p-5 hover:border-[#B9C9D5]">
          <h2 className="font-semibold">Create a catalog item</h2>
          <p className="mt-1 text-sm text-[#C2C7D0]">Add a design, descriptions, and images.</p>
        </Link>
      </div>
      {categories.length === 0 && (
        <p className="rounded-lg border border-dashed border-[#4B515B] p-5 text-sm text-[#C2C7D0]">
          Your catalog is empty. Start by creating a category; then you can add and publish designs.
        </p>
      )}
    </div>
  );
}
