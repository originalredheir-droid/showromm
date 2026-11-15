import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  span?: string;
  isFeatured?: boolean;
}

export function CategoryCard({ category, span, isFeatured }: CategoryCardProps) {
  return (
    <Link
      href={`/catalogue?category=${category.id}`}
      className={cn(
        'group relative flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-[#31353C] bg-[#181C22] transition-all duration-200 hover:border-[#C2C7D0]/70',
        span || 'col-span-1 md:col-span-6 lg:col-span-4',
        isFeatured && 'lg:col-span-8'
      )}
    >
      <div className="relative h-44 shrink-0 overflow-hidden bg-[#10141A] sm:h-48">
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
        {category.accentBadge && (
          <span className="absolute right-4 top-4 z-10 rounded border border-[#31353C] bg-[#10141A]/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DFE2EB] sm:right-5 sm:top-5">
            {category.accentBadge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div>
          <h3 className="text-lg font-semibold text-[#DFE2EB] transition-colors group-hover:text-white">
            {category.name}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#C2C7D0]">
            {category.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#31353C] pt-3 text-xs text-[#C2C7D0]">
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
    </Link>
  );
}
