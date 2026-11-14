'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Plus, Eye, Clock } from 'lucide-react';
import { Design } from '@/types';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { formatINR, cn } from '@/lib/utils';

interface CatalogueCardProps {
  design: Design;
}

export function CatalogueCard({ design }: CatalogueCardProps) {
  const { isInCart, addToCart, removeFromCart } = useCart();
  const { showPricing, showInternalDetails } = usePresenter();
  const inCart = isInCart(design.id);

  const handleCartToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      removeFromCart(design.id);
    } else {
      addToCart(design);
    }
  };

  return (
    <article className="group rounded-lg bg-[#181C22] border border-[#31353C] hover:border-[#B9C9D5]/70 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Media Viewport */}
        <Link href={`/design/${design.id}`} className="block relative w-full aspect-[16/10] bg-[#0A0E14] overflow-hidden border-b border-[#31353C]">
          <Image
            src={design.visualPreviewImage}
            alt={design.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          {/* Top Label Cluster */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-[#10141A]/90 backdrop-blur border border-[#31353C] text-[#C2C7D0]">
              {design.conceptTypeLabel}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#10141A]/90 backdrop-blur border border-[#31353C] text-[#B9C9D5]">
              {design.categoryName.split('&')[0].trim()}
            </span>
          </div>

          {inCart && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-bold bg-[#B9C9D5] text-[#10141A] shadow-md flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Selected</span>
            </div>
          )}
        </Link>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div>
            <Link href={`/design/${design.id}`} className="block">
              <h3 className="text-base font-semibold text-[#DFE2EB] group-hover:text-[#B9C9D5] transition-colors line-clamp-1">
                {design.title}
              </h3>
            </Link>
            <p className="text-xs text-[#C2C7D0] line-clamp-2 mt-1 leading-relaxed">
              {design.shortDescription}
            </p>
          </div>

          {/* Tags & Tech Specs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#8B9199] pt-1">
            {design.tags.slice(0, 3).map((tag, idx) => (
              <span key={tag} className="text-[11px] text-[#C2C7D0]">
                {tag}
                {idx < Math.min(design.tags.length - 1, 2) && <span className="mx-1 text-[#42474F]">·</span>}
              </span>
            ))}
            {showInternalDetails && design.technicalSpecs.devHours > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-[#B9C9D5] font-mono">
                <Clock className="w-3 h-3" />
                ~{design.technicalSpecs.devHours}h
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Commercial Actions */}
      <div className="p-5 pt-3 border-t border-[#262A31] flex items-center justify-between gap-3">
        {showPricing && design.commercial.estimatedBaseINR > 0 ? (
          <div>
            <span className="text-[10px] text-[#8B9199] uppercase tracking-wider block">Estimated Base</span>
            <span className="text-sm font-bold text-[#DFE2EB] tabular-nums">
              {formatINR(design.commercial.estimatedBaseINR)}
            </span>
          </div>
        ) : showPricing ? (
          <div className="text-[11px] text-[#8B9199]">Custom estimate</div>
        ) : (
          <div className="text-[11px] text-[#8B9199]">{design.features.length ? `${design.features.length} core features` : 'View details'}</div>
        )}

        <div className="flex items-center gap-2">
          <Link
            href={`/design/${design.id}`}
            className="p-2 rounded bg-[#1C2026] border border-[#31353C] hover:border-[#DFE2EB] text-[#C2C7D0] hover:text-[#DFE2EB] transition-colors"
            title="Inspect Showcase"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <button
            onClick={handleCartToggle}
            type="button"
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all shadow-sm',
              inCart
                ? 'bg-[#1C2026] border border-[#B9C9D5] text-[#B9C9D5] hover:bg-[#262A31]'
                : 'bg-[#B9C9D5] text-[#10141A] hover:bg-[#DDE5EA]'
            )}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Selection</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
