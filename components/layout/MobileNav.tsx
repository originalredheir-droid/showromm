'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, Layers, ShoppingBag, Settings, Sliders } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const { showPricing, showInternalDetails, togglePricing, toggleInternalDetails } = usePresenter();
  const [showControls, setShowControls] = React.useState(false);

  const items = [
    { label: 'Home', href: '/', icon: Home, isActive: pathname === '/' },
    { label: 'Catalogue', href: '/catalogue', icon: Grid3X3, isActive: pathname.startsWith('/catalogue') || pathname.startsWith('/design') },
    { label: 'Categories', href: '/categories', icon: Layers, isActive: pathname.startsWith('/categories') },
    { label: 'Admin', href: '/admin', icon: Settings, isActive: pathname.startsWith('/admin') },
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
      {/* Mobile Presenter Controls Sheet */}
      {showControls && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-[#181C22] border-t border-[#31353C] z-40 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-semibold text-[#DFE2EB] uppercase tracking-wider">
            <span>Presenter Controls</span>
            <button
              onClick={() => setShowControls(false)}
              className="text-[#C2C7D0] hover:text-white text-xs px-2 py-1"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={togglePricing}
              className={cn(
                'p-2.5 rounded border text-xs font-semibold text-center transition-colors',
                showPricing
                  ? 'bg-[#FF535B]/15 border-[#FF535B] text-[#FF535B]'
                  : 'bg-[#1C2026] border-[#31353C] text-[#C2C7D0]'
              )}
            >
              Pricing: {showPricing ? 'Visible' : 'Hidden'}
            </button>
            <button
              type="button"
              onClick={toggleInternalDetails}
              className={cn(
                'p-2.5 rounded border text-xs font-semibold text-center transition-colors',
                showInternalDetails
                  ? 'bg-[#FF535B]/15 border-[#FF535B] text-[#FF535B]'
                  : 'bg-[#1C2026] border-[#31353C] text-[#C2C7D0]'
              )}
            >
              Specs: {showInternalDetails ? 'Visible' : 'Hidden'}
            </button>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar for Mobile / Tablet */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#181C22] border-t border-[#31353C] z-50 flex items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 max-w-20 flex-col items-center justify-center h-12 rounded-lg text-xs transition-colors relative',
                item.isActive ? 'text-[#FF535B] font-semibold' : 'text-[#C2C7D0] hover:text-[#DFE2EB]'
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.badge !== undefined && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-[#FF535B] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Presenter Controls Toggle Button */}
        <button
          type="button"
          onClick={() => setShowControls(!showControls)}
          className={cn(
            'flex flex-col items-center justify-center w-16 h-12 rounded-lg text-xs transition-colors',
            showControls ? 'text-[#FF535B]' : 'text-[#C2C7D0]'
          )}
        >
          <Sliders className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Toggles</span>
        </button>
      </nav>
    </>
  );
}
