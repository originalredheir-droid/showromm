import React from 'react';
import { notFound } from 'next/navigation';
import { DESIGNS } from '@/data/designs';
import { DesignShowcase } from '@/components/design/DesignShowcase';

interface DesignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DesignDetailPage({ params }: DesignDetailPageProps) {
  const { id } = await params;
  const design = DESIGNS.find((d) => d.id === id || d.slug === id);

  if (!design) {
    notFound();
  }

  return <DesignShowcase design={design} />;
}

export function generateStaticParams() {
  return DESIGNS.map((d) => ({
    id: d.id,
  }));
}
