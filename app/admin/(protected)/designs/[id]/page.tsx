import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DesignForm } from '@/components/admin/DesignForm';
import { getAdminCategories, getAdminDesign } from '@/lib/catalog';

interface EditDesignPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDesignPage({ params }: EditDesignPageProps) {
  const { id } = await params;
  const [categories, design] = await Promise.all([getAdminCategories(), getAdminDesign(id)]);
  if (!design) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href="/admin/designs" className="text-sm text-[#C2C7D0] hover:text-white">← Catalogue</Link>
      <h1 className="text-2xl font-bold">Edit catalog item</h1>
      <DesignForm categories={categories} design={design} />
    </div>
  );
}
