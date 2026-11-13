import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { getAdminCategories } from '@/lib/catalog';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const categories = await getAdminCategories();
  const category = categories.find((item) => item.id === id);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/admin/categories" className="text-sm text-[#C2C7D0] hover:text-white">← Categories</Link>
      <h1 className="text-2xl font-bold">Edit category</h1>
      <div className="rounded-xl border border-[#31353C] bg-[#181C22] p-5">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
