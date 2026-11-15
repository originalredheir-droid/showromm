'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Trash2 } from 'lucide-react';
import { CartItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { removeFromCart } = useCart();
  const { design, screen } = item;

  return (
    <article className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#31353C] bg-[#181C22] p-4 transition-all hover:border-[#353940] sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <Link
          href={`/design/${design.id}`}
          className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-[#31353C] bg-[#0A0E14]"
        >
          <Image
            src={screen.image}
            alt={screen.title || design.title}
            fill
            sizes="128px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </Link>
        <div className="min-w-0 space-y-1">
          <p className="truncate text-xs text-[#8B9199]">{design.title}</p>
          <Link href={`/design/${design.id}`} className="block">
            <h2 className="truncate text-sm font-semibold text-[#DFE2EB] hover:text-[#B9C9D5]">
              {screen.title || 'Image offer'}
            </h2>
          </Link>
          {screen.description && <p className="text-xs text-[#C2C7D0]">{screen.description}</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-[#8B9199]">
            <span className="font-medium text-[#DFE2EB]">
              {screen.estimatedPriceINR === undefined
                ? 'Price on request'
                : formatINR(screen.estimatedPriceINR)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {screen.devHours === undefined ? 'Time not estimated' : `~${screen.devHours} hours`}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        type="button"
        className="print-hide flex items-center gap-2 self-end rounded px-2 py-1.5 text-xs text-[#8B9199] transition-colors hover:bg-[#262A31] hover:text-[#B9C9D5] sm:self-auto"
        aria-label={`Remove ${screen.title || 'image offer'} from selection`}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sm:hidden">Remove</span>
      </button>
    </article>
  );
}
