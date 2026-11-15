'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Clock } from 'lucide-react';
import { Design } from '@/types';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { formatINR } from '@/lib/utils';

interface CatalogueCardProps {
  design: Design;
}

export function CatalogueCard({ design }: CatalogueCardProps) {
  const { items } = useCart();
  const { showPricing, showInternalDetails } = usePresenter();
  const selectedOfferCount = items.filter((item) => item.design.id === design.id).length;
  const estimatedPrice = design.screenPreviews.reduce(
    (sum, screen) => sum + (screen.estimatedPriceINR ?? 0),
    0
  );
  const estimatedHours = design.screenPreviews.reduce(
    (sum, screen) => sum + (screen.devHours ?? 0),
    0
  );

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

          {selectedOfferCount > 0 && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-bold bg-[#B9C9D5] text-[#10141A] shadow-md">
              {selectedOfferCount} {selectedOfferCount === 1 ? 'offer selected' : 'offers selected'}
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
          </div>

          {/* Tags & Tech Specs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#8B9199] pt-1">
            {design.tags.slice(0, 3).map((tag, idx) => (
              <span key={tag} className="text-[11px] text-[#C2C7D0]">
                {tag}
                {idx < Math.min(design.tags.length - 1, 2) && <span className="mx-1 text-[#42474F]">·</span>}
              </span>
            ))}
            {showInternalDetails && estimatedHours > 0 && (
              <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-[#B9C9D5] font-mono">
                <Clock className="w-3 h-3" />
                ~{estimatedHours}h across offers
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Commercial Actions */}
      <div className="p-5 pt-3 border-t border-[#262A31] flex items-center justify-between gap-3">
        {showPricing && estimatedPrice > 0 ? (
          <div>
            <span className="text-[10px] text-[#8B9199] uppercase tracking-wider block">All offer estimates</span>
            <span className="text-sm font-bold text-[#DFE2EB] tabular-nums">
              {formatINR(estimatedPrice)}
            </span>
          </div>
        ) : showPricing ? (
          <div className="text-[11px] text-[#8B9199]">{design.screenPreviews.length} image offers</div>
        ) : (
          <div className="text-[11px] text-[#8B9199]">{design.screenPreviews.length} image offers</div>
        )}

        <div className="flex items-center gap-2">
          <Link
            href={`/design/${design.id}`}
            className="p-2 rounded bg-[#1C2026] border border-[#31353C] hover:border-[#DFE2EB] text-[#C2C7D0] hover:text-[#DFE2EB] transition-colors"
            title="Inspect Showcase"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <Link
            href={`/design/${design.id}`}
            className="inline-flex items-center gap-1.5 rounded bg-[#B9C9D5] px-3 py-1.5 text-xs font-semibold text-[#10141A] transition-colors hover:bg-[#DDE5EA]"
          >
            <span>View image offers</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
