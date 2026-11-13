import React from 'react';
import { notFound } from 'next/navigation';
import { DesignShowcase } from '@/components/design/DesignShowcase';
import { getPublicCatalog } from '@/lib/catalog';

interface DesignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DesignDetailPage({ params }: DesignDetailPageProps) {
  const { id } = await params;
  const { designs } = await getPublicCatalog();
  const design = designs.find((item) => item.id === id || item.slug === id);

  if (!design) {
    notFound();
  }

  const relatedDesigns = designs.filter((item) => design.relatedIds.includes(item.id));
  return <DesignShowcase design={design} relatedDesigns={relatedDesigns} />;
}

export const dynamic = 'force-dynamic';
