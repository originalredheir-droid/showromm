'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Layers,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';

export default function SelectionCartPage() {
  const { items, totalCount, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <div className="py-24 text-center text-xs text-[#8B9199]">
        Loading your selection cart...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#31353C]">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FF535B]" />
            <span className="text-xs uppercase tracking-wider text-[#FF535B] font-semibold">
              Client Project Scope
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#DFE2EB]">
            Selection Cart
          </h1>
          <p className="text-sm text-[#C2C7D0] mt-1 max-w-2xl">
            Shortlisted website designs, functional modules, and screens curated for the proposed project.
            Selections persist in your browser for upcoming client presentations.
          </p>
        </div>

        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#262A31] hover:bg-[#31353C] text-xs font-semibold text-[#DFE2EB] border border-[#31353C] transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Browsing</span>
        </Link>
      </div>

      {/* Cart Content: Two-column layout if items exist, or empty state */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: List of Selected Items (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#C2C7D0] pb-1">
              <span>{totalCount} {totalCount === 1 ? 'item' : 'items'} in current project scope</span>
              <span className="text-[#8B9199]">Operator: Review with client</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Summary & Actions (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <CartSummary />
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="py-20 px-6 text-center rounded-2xl bg-[#181C22] border border-[#31353C] max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#262A31] border border-[#353940] flex items-center justify-center text-[#FF535B] mx-auto shadow-inner">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#DFE2EB]">Your selection cart is currently empty</h3>
            <p className="text-xs text-[#C2C7D0] max-w-sm mx-auto leading-relaxed">
              Explore the showroom catalogue and add website concepts, individual pages, or functional modules to assemble your client proposal.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF535B] hover:bg-[#bb152c] text-white text-xs font-semibold tracking-wide transition-colors shadow-md"
            >
              <span>Explore Showroom Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
