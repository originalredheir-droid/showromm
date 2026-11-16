'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, ShoppingBag, Sliders, Menu, X, Layers, Settings } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const { showPricing, showInternalDetails, togglePricing, toggleInternalDetails } = usePresenter();
  const [showMore, setShowMore] = React.useState(false);

  const items = [
    { label: 'Home', href: '/', icon: Home, isActive: pathname === '/' },
    { label: 'Catalogue', href: '/catalogue', icon: Grid3X3, isActive: pathname.startsWith('/catalogue') || pathname.startsWith('/design') },
    {
      label: 'Cart',
      href: '/selection',
      icon: ShoppingBag,
      isActive: pathname.startsWith('/selection'),
      badge: totalCount > 0 ? totalCount : undefined,
    },
  ];

  return (
    <>
      {showMore && (
        <>
          <button
            type="button"
            aria-label="Close more menu"
            onClick={() => setShowMore(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
          <section
            id="mobile-more-menu"
            className="fixed inset-x-0 z-50 space-y-4 rounded-t-2xl border-t border-[#31353C] bg-[#181C22] p-4 shadow-2xl lg:hidden"
            style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
            aria-label="More navigation and presenter controls"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#DFE2EB]">More</h2>
              <button type="button" onClick={() => setShowMore(false)} aria-label="Close more menu" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#C2C7D0] hover:bg-[#262A31]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/categories" onClick={() => setShowMore(false)} className="flex min-h-12 items-center gap-2 rounded-lg border border-[#31353C] bg-[#10141A] px-3 text-sm text-[#DFE2EB]">
                <Layers className="h-4 w-4 text-[#B9C9D5]" /> Categories
              </Link>
              <Link href="/admin" onClick={() => setShowMore(false)} className="flex min-h-12 items-center gap-2 rounded-lg border border-[#31353C] bg-[#10141A] px-3 text-sm text-[#DFE2EB]">
                <Settings className="h-4 w-4 text-[#B9C9D5]" /> Admin
              </Link>
            </div>
            <div className="space-y-3 border-t border-[#31353C] pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#8B9199]">
                <Sliders className="h-4 w-4" /> Presenter controls
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={togglePricing}
                  aria-pressed={showPricing}
                  className={cn(
                    'min-h-12 rounded-lg border px-3 text-sm font-medium',
                    showPricing ? 'border-[#B9C9D5] bg-[#B9C9D5]/15 text-[#B9C9D5]' : 'border-[#31353C] text-[#C2C7D0]'
                  )}
                >
                  Pricing: {showPricing ? 'On' : 'Off'}
                </button>
                <button
                  type="button"
                  onClick={toggleInternalDetails}
                  aria-pressed={showInternalDetails}
                  className={cn(
                    'min-h-12 rounded-lg border px-3 text-sm font-medium',
                    showInternalDetails ? 'border-[#B9C9D5] bg-[#B9C9D5]/15 text-[#B9C9D5]' : 'border-[#31353C] text-[#C2C7D0]'
                  )}
                >
                  Specs: {showInternalDetails ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-[#31353C] bg-[#181C22] px-2 pt-1 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', minHeight: 'calc(4rem + env(safe-area-inset-bottom))' }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.isActive ? 'page' : undefined}
              className={cn(
                'relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-xs',
                item.isActive ? 'font-semibold text-[#B9C9D5]' : 'text-[#C2C7D0] hover:text-[#DFE2EB]'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="absolute right-1/4 top-1 h-4 min-w-4 rounded-full bg-[#B9C9D5] px-1 text-center text-[10px] font-bold leading-4 text-[#10141A]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setShowMore((value) => !value)}
          aria-expanded={showMore}
          aria-controls="mobile-more-menu"
          className={cn(
            'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-xs',
            showMore ? 'font-semibold text-[#B9C9D5]' : 'text-[#C2C7D0]'
          )}
        >
          {showMore ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
