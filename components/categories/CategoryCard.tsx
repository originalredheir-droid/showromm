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
        'group rounded-xl bg-[#181C22] p-6 border border-[#31353C] hover:border-[#FF535B]/70 transition-all duration-200 flex flex-col justify-between relative overflow-hidden',
        span || 'col-span-1 md:col-span-6 lg:col-span-4',
        isFeatured && 'lg:col-span-8'
      )}
    >
      {/* Background Graphic Watermark */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity duration-300">
        <Image
          src={category.featuredImage}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-left"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181C22] via-[#181C22]/80 to-transparent" />
      </div>

      {/* Top Segment: Icon & Badge */}
      <div className="relative z-10 max-w-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="p-2.5 rounded-lg bg-[#262A31] border border-[#353940] text-[#FF535B] inline-flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </span>
          {category.accentBadge && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#262A31] border border-[#31353C] text-[#C2C7D0]">
              {category.accentBadge}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#DFE2EB] group-hover:text-[#FF535B] transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-[#C2C7D0] leading-relaxed mt-1.5">
            {category.description}
          </p>
        </div>
      </div>

      {/* Bottom Segment: Metrics & CTA */}
      <div className="relative z-10 pt-6 mt-4 border-t border-[#262A31] flex items-center justify-between text-xs text-[#C2C7D0]">
        <div className="flex items-center gap-4">
          <span>
            <strong className="text-[#DFE2EB] font-semibold">{category.moduleCount}</strong> Ready Modules
          </span>
          {category.portalCount > 0 && (
            <span>
              <strong className="text-[#DFE2EB] font-semibold">{category.portalCount}</strong> Portals
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 font-semibold text-[#FF535B] group-hover:translate-x-1 transition-transform">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
