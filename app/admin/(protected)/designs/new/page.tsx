import Link from 'next/link';
import { DesignForm } from '@/components/admin/DesignForm';
import { getAdminCategories } from '@/lib/catalog';

export default async function NewDesignPage() {
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href="/admin/designs" className="text-sm text-[#C2C7D0] hover:text-white">← Catalogue</Link>
      <h1 className="text-2xl font-bold">Create catalog item</h1>
      {categories.length ? (
        <DesignForm categories={categories} />
      ) : (
        <p className="rounded-lg border border-dashed border-[#4B515B] p-6 text-sm text-[#C2C7D0]">
          Add a category first. <Link href="/admin/categories/new" className="text-[#B9C9D5] hover:underline">Create category</Link>
        </p>
      )}
    </div>
  );
}
