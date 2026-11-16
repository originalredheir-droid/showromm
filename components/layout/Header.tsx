'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Maximize, Tv, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { formatINR } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const { totalCount, totalEstimatedBaseINR } = useCart();
  const { showPricing, togglePitchMode, pitchMode } = usePresenter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/catalogue');
    }
  };

  return (
    <header className="sticky top-0 w-full h-16 flex items-center justify-between px-4 sm:px-8 bg-[#10141A]/95 border-b border-[#31353C] z-30 backdrop-blur-md">
      {/* Search Input with ⌘K */}
      <form onSubmit={handleSearchSubmit} className="relative flex w-full max-w-[min(58vw,24rem)] items-center sm:max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 text-[#C2C7D0]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search catalogue..."
          className="min-h-11 w-full pl-10 pr-3 py-2 bg-[#1C2026] border border-[#31353C] rounded text-base sm:text-sm text-[#DFE2EB] placeholder-[#8B9199] focus:outline-none focus:border-[#B9C9D5] focus:ring-1 focus:ring-[#B9C9D5] transition-all"
        />
        <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#31353C] text-[#C2C7D0] text-[10px] font-mono border border-[#353940]">
          <span>⌘</span>K
        </div>
      </form>

      {/* Trailing Actions */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Quick Pitch Mode Toggle */}
        <button
          onClick={togglePitchMode}
          type="button"
          title="Toggle Presenter Pitch Mode"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1C2026] border border-[#31353C] text-xs font-medium text-[#C2C7D0] hover:text-[#DFE2EB] hover:border-[#B9C9D5] transition-colors"
        >
          <Tv className="w-3.5 h-3.5 text-[#B9C9D5]" />
          <span>{pitchMode ? 'Exit Pitch' : 'Pitch Mode'}</span>
        </button>

        {/* Selection Cart Launcher Badge */}
        <Link
          href="/selection"
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1C2026] border border-[#31353C] hover:border-[#B9C9D5] text-[#DFE2EB] transition-all group"
        >
          <ShoppingBag className="w-4 h-4 text-[#B9C9D5] group-hover:scale-110 transition-transform" />
          <span className="hidden text-xs font-semibold text-[#B9C9D5] sm:inline">Cart:</span>
          <span className="text-[11px] text-[#DFE2EB] sm:text-xs">
            {totalCount} {totalCount === 1 ? 'item' : 'items'}
            {showPricing && totalEstimatedBaseINR > 0 && <span className="hidden sm:inline">{` (${formatINR(totalEstimatedBaseINR)})`}</span>}
          </span>
        </Link>
      </div>
    </header>
  );
}
