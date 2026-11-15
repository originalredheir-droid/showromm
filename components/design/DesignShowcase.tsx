'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Clock, Plus, Trash2 } from 'lucide-react';
import { Design } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatINR, cn } from '@/lib/utils';

interface DesignShowcaseProps {
  design: Design;
}

export function DesignShowcase({ design }: DesignShowcaseProps) {
  const { addToCart, removeFromCart, isInCart } = useCart();

  const offers = [...design.screenPreviews].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1 text-xs text-[#8B9199]">
        <Link href="/" className="transition-colors hover:text-[#DFE2EB]">Showroom</Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#31353C]" />
        <Link href={`/catalogue?category=${design.categoryId}`} className="transition-colors hover:text-[#DFE2EB]">
          {design.categoryName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#31353C]" />
        <span className="max-w-sm truncate font-medium text-[#DFE2EB]">{design.title}</span>
      </nav>

      <header className="border-b border-[#31353C] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#DFE2EB]">{design.title}</h1>
      </header>

      {offers.length ? (
        <div className="space-y-5">
          {offers.map((offer) => {
            const cartId = `${design.id}:${offer.id}`;
            const inCart = isInCart(cartId);
            return (
              <article
                key={offer.id}
                className="flex flex-col overflow-hidden rounded-xl border border-[#31353C] bg-[#181C22] sm:flex-row"
              >
                <div className="relative aspect-[4/3] bg-[#0A0E14] sm:aspect-auto sm:min-h-[280px] sm:w-1/2">
                  <Image
                    src={offer.image}
                    alt={offer.title || design.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-6">
                  <div className="min-h-12">
                    {offer.title && <h2 className="text-sm font-semibold text-[#DFE2EB]">{offer.title}</h2>}
                    {offer.description && (
                      <p className="mt-1 text-xs leading-relaxed text-[#C2C7D0]">{offer.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-[#262A31] pt-3">
                    <span className="text-sm font-semibold tabular-nums text-[#DFE2EB]">
                      {offer.estimatedPriceINR === undefined
                        ? 'Price on request'
                        : formatINR(offer.estimatedPriceINR)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#C2C7D0]">
                      <Clock className="h-3.5 w-3.5 text-[#B9C9D5]" />
                      {offer.devHours === undefined ? 'Time not estimated' : `~${offer.devHours}h`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => inCart
                      ? removeFromCart(cartId)
                      : addToCart(design, offer)}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors',
                      inCart
                        ? 'border border-[#B9C9D5] bg-[#1C2026] text-[#B9C9D5] hover:bg-[#262A31]'
                        : 'bg-[#B9C9D5] text-[#10141A] hover:bg-[#DDE5EA]'
                    )}
                  >
                    {inCart ? (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Remove from selection</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Add to selection</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-[#31353C] p-8 text-center text-sm text-[#8B9199]">
          No image offers are available in this catalog yet.
        </p>
      )}
    </div>
  );
}
