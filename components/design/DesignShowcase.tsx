'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronRight, Clock, Plus, Trash2, X } from 'lucide-react';
import { Design } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatINR, cn } from '@/lib/utils';

interface DesignShowcaseProps {
  design: Design;
}

export function DesignShowcase({ design }: DesignShowcaseProps) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  const offers = [...design.screenPreviews].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  useEffect(() => {
    if (!zoomedImage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomedImage(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [zoomedImage]);

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
                <button
                  type="button"
                  onClick={() => setZoomedImage({ src: offer.image, alt: offer.title || design.title })}
                  aria-label={`Enlarge image: ${offer.title || design.title}`}
                  className="relative aspect-[4/3] w-full bg-[#0A0E14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B9C9D5] sm:aspect-auto sm:min-h-[280px] sm:w-1/2"
                >
                  <Image
                    src={offer.image}
                    alt={offer.title || design.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
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
                      'flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors',
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
      {zoomedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image preview"
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-3 sm:p-8"
        >
          <button
            type="button"
            autoFocus
            onClick={() => setZoomedImage(null)}
            aria-label="Close enlarged image"
            className="absolute right-3 top-3 z-10 flex min-h-12 min-w-12 items-center justify-center rounded-full bg-[#181C22] text-white"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-[85dvh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <Image
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
