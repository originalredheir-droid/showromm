import React from 'react';
import { notFound } from 'next/navigation';
import { DesignShowcase } from '@/components/design/DesignShowcase';
import { getPublicDesign } from '@/lib/catalog';

interface DesignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DesignDetailPage({ params }: DesignDetailPageProps) {
  const { id } = await params;
  const design = await getPublicDesign(id);
  if (!design) {
    notFound();
  }

  return <DesignShowcase design={design} />;
}

export const dynamic = 'force-dynamic';
