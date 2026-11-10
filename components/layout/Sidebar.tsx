'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Grid3X3,
  ShoppingBag,
  Layers,
  Tv,
  Check,
  Eye,
  EyeOff,
  User,
  Sliders,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const { showPricing, showInternalDetails, togglePricing, toggleInternalDetails, togglePitchMode, pitchMode } = usePresenter();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Catalogue',
      href: '/catalogue',
      icon: Grid3X3,
      isActive: pathname.startsWith('/catalogue') || pathname.startsWith('/design'),
    },
    {
      label: 'Categories',
      href: '/categories',
      icon: Layers,
      isActive: pathname.startsWith('/categories'),
    },
    {
      label: 'Selection Cart',
      href: '/selection',
      icon: ShoppingBag,
      isActive: pathname.startsWith('/selection'),
      badge: totalCount > 0 ? totalCount : undefined,
    },
  ];

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-[280px] flex-col justify-between p-4 bg-[#181C22] border-r border-[#31353C] z-40 select-none">
      {/* Top Segment: Brand & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-[#262A31]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded bg-[#FF535B] text-white flex items-center justify-center font-bold tracking-tight shadow-sm text-sm group-hover:bg-[#bb152c] transition-colors">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-[#DFE2EB] text-base leading-tight">REDHEIR</span>
              <span className="text-[11px] text-[#C2C7D0] tracking-wide">Showroom Stage</span>
            </div>
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#262A31] border border-[#31353C] text-[#FF535B]">
            Live
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded transition-all duration-150 text-sm font-medium',
                  item.isActive
                    ? 'bg-[#262A31] text-[#FF535B] font-semibold border-l-2 border-[#FF535B]'
                    : 'text-[#C2C7D0] hover:text-[#DFE2EB] hover:bg-[#1C2026]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="w-5 h-5 rounded-full bg-[#FF535B] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Present Pitch Action */}
        <div className="px-1">
          <button
            onClick={togglePitchMode}
            type="button"
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded transition-all text-xs font-semibold tracking-wide shadow-sm',
              pitchMode
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[#FF535B] text-white hover:bg-[#bb152c]'
            )}
          >
            <Tv className="w-4 h-4" />
            <span>{pitchMode ? 'Exit Pitch Mode' : 'Present Pitch Mode'}</span>
          </button>
        </div>

        {/* Presenter In-Meeting Controls */}
        <div className="p-3 mx-1 rounded bg-[#10141A] border border-[#31353C] flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#C2C7D0]">
            <span>Presenter Controls</span>
            <Sliders className="w-3.5 h-3.5" />
          </div>

          {/* Toggle: Show Pricing */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#DFE2EB]">Show Pricing</span>
            <button
              type="button"
              onClick={togglePricing}
              aria-label="Toggle Pricing"
              className={cn(
                'w-8 h-4 rounded-full relative flex items-center px-0.5 transition-colors focus:outline-none',
                showPricing ? 'bg-[#FF535B]' : 'bg-[#31353C]'
              )}
            >
              <span
                className={cn(
                  'w-3 h-3 bg-white rounded-full transition-transform',
                  showPricing ? 'translate-x-4' : 'translate-x-0'
                )}
              />
            </button>
          </div>

          {/* Toggle: Show Internal Details */}
          <div className="flex items-center justify-between border-t border-[#262A31] pt-2.5">
            <span className="text-xs text-[#C2C7D0]">Technical Specs</span>
            <button
              type="button"
              onClick={toggleInternalDetails}
              aria-label="Toggle Technical Specs"
              className={cn(
                'w-8 h-4 rounded-full relative flex items-center px-0.5 transition-colors focus:outline-none',
                showInternalDetails ? 'bg-[#FF535B]' : 'bg-[#31353C]'
              )}
            >
              <span
                className={cn(
                  'w-3 h-3 bg-white rounded-full transition-transform',
                  showInternalDetails ? 'translate-x-4' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Segment: Operator Status */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[#262A31]">
        <div className="flex items-center gap-3 p-2 rounded bg-[#10141A] border border-[#31353C]">
          <div className="w-8 h-8 rounded-full bg-[#262A31] border border-[#353940] flex items-center justify-center text-[#FF535B] font-bold text-xs">
            RH
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-[#DFE2EB] truncate">Showroom Operator</span>
            <span className="text-[10px] text-[#C2C7D0] truncate">Internal Presentation Mode</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
