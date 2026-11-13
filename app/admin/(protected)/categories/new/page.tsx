import Link from 'next/link';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/admin/categories" className="text-sm text-[#C2C7D0] hover:text-white">← Categories</Link>
      <h1 className="text-2xl font-bold">Create category</h1>
      <div className="rounded-xl border border-[#31353C] bg-[#181C22] p-5">
        <CategoryForm />
      </div>
    </div>
  );
}
