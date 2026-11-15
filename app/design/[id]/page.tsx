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

  return <DesignShowcase design={design} />;
}

export const dynamic = 'force-dynamic';
