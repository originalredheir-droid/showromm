'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  Activity,
  Cpu,
  ShoppingBag,
  Building2,
  Scale,
  Utensils,
  Compass,
  HeartHandshake,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  Activity,
  Cpu,
  ShoppingBag,
  Building2,
  Scale,
  Utensils,
  Compass,
  HeartHandshake,
  Layers,
};

interface CategoryCardProps {
  category: Category;
  span?: string;
  isFeatured?: boolean;
}

export function CategoryCard({ category, span, isFeatured }: CategoryCardProps) {
  const Icon = ICON_MAP[category.iconName] || Layers;

  return (
    <Link
      href={`/catalogue?category=${category.id}`}
      className={cn(
        'group relative min-h-[280px] overflow-hidden rounded-xl border border-[#31353C] bg-[#181C22] transition-all duration-200 hover:border-[#C2C7D0]/70',
        span || 'col-span-1 md:col-span-6 lg:col-span-4',
        isFeatured && 'lg:col-span-8'
      )}
    >
      {category.featuredImage && (
        <Image
          src={category.featuredImage}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
        />
      )}

      <div className="relative z-10 flex min-h-[280px] flex-col items-start justify-between gap-6 p-5 sm:p-6">
        <div className="flex w-full items-center justify-between">
          <span className="inline-flex items-center justify-center rounded-lg border border-[#31353C] bg-[#10141A]/90 p-2.5 text-[#C2C7D0]">
            <Icon className="h-5 w-5" />
          </span>
          {category.accentBadge && (
            <span className="rounded border border-[#31353C] bg-[#10141A]/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DFE2EB]">
              {category.accentBadge}
            </span>
          )}
        </div>

        <div className="w-full max-w-xl rounded-lg border border-[#31353C] bg-[#10141A]/95 p-4 shadow-lg">
          <div>
            <h3 className="text-lg font-semibold text-[#DFE2EB] transition-colors group-hover:text-white">
              {category.name}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#C2C7D0]">
              {category.description}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#31353C] pt-3 text-xs text-[#C2C7D0]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span><strong className="font-semibold text-[#DFE2EB]">{category.moduleCount}</strong> Ready Modules</span>
              {category.portalCount > 0 && (
                <span><strong className="font-semibold text-[#DFE2EB]">{category.portalCount}</strong> Portals</span>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#DFE2EB] transition-transform group-hover:translate-x-1">
              <span>Explore</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
