'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, Clock, Eye } from 'lucide-react';
import { CartItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { formatINR } from '@/lib/utils';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { showPricing, showInternalDetails } = usePresenter();
  const { design, quantity } = item;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#181C22] border border-[#31353C] hover:border-[#353940] transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Left: Thumbnail & Details */}
      <div className="flex gap-4 items-start flex-1 min-w-0">
        <Link
          href={`/design/${design.id}`}
          className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden bg-[#0A0E14] border border-[#31353C] shrink-0"
        >
          <Image
            src={design.visualPreviewImage}
            alt={design.title}
            fill
            sizes="128px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </Link>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.2 rounded text-[10px] font-semibold uppercase bg-[#262A31] text-[#B9C9D5] border border-[#31353C]">
              {design.conceptTypeLabel}
            </span>
            <span className="text-xs text-[#8B9199] truncate">{design.categoryName}</span>
          </div>

          <Link href={`/design/${design.id}`} className="block">
            <h4 className="text-sm font-semibold text-[#DFE2EB] hover:text-[#B9C9D5] transition-colors truncate">
              {design.title}
            </h4>
          </Link>

          <p className="text-xs text-[#C2C7D0] line-clamp-1">
            {design.shortDescription}
          </p>

          {showInternalDetails && (
            <div className="flex items-center gap-2 text-[11px] text-[#8B9199] pt-1">
              <span className="inline-flex items-center gap-1 text-[#B9C9D5] font-mono">
                <Clock className="w-3 h-3" />
                ~{design.technicalSpecs.devHours * quantity}h total
              </span>
              <span>·</span>
              <span>{design.features.length} core features</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Quantity Stepper, Pricing & Delete */}
      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#262A31]">
        {/* Quantity Stepper */}
        <div className="flex items-center rounded-lg border border-[#31353C] bg-[#10141A]">
          <button
            onClick={() => updateQuantity(design.id, quantity - 1)}
            type="button"
            className="w-7 h-7 flex items-center justify-center text-[#C2C7D0] hover:text-[#DFE2EB] hover:bg-[#262A31] rounded-l-lg transition-colors"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-semibold text-[#DFE2EB] tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(design.id, quantity + 1)}
            type="button"
            className="w-7 h-7 flex items-center justify-center text-[#C2C7D0] hover:text-[#DFE2EB] hover:bg-[#262A31] rounded-r-lg transition-colors"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Estimated Price */}
        {showPricing && (
          <div className="text-right min-w-[90px]">
            <span className="text-sm font-bold text-[#DFE2EB] tabular-nums block">
              {formatINR(design.commercial.estimatedBaseINR * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-[10px] text-[#8B9199] block font-mono">
                ({formatINR(design.commercial.estimatedBaseINR)} ea)
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            href={`/design/${design.id}`}
            className="p-1.5 rounded text-[#C2C7D0] hover:text-[#DFE2EB] hover:bg-[#262A31] transition-colors"
            title="Inspect"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => removeFromCart(design.id)}
            type="button"
            className="p-1.5 rounded text-[#8B9199] hover:text-[#B9C9D5] hover:bg-[#262A31] transition-colors"
            title="Remove from selection"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
