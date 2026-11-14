'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Settings,
  PanelLeftClose,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { cn } from '@/lib/utils';

export function Sidebar({
  isOpen,
  onCollapse,
}: {
  isOpen: boolean;
  onCollapse: () => void;
}) {
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
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn(
        'hidden lg:flex fixed top-0 left-0 h-screen w-[280px] flex-col justify-between p-4 bg-[#181C22] border-r border-[#31353C] z-40 select-none transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
      )}
    >
      {/* Top Segment: Brand & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-[#262A31]">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/icon.png" alt="REDHEIR logo" width={36} height={36} className="rounded-lg" />
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-[#DFE2EB] text-base leading-tight">REDHEIR</span>
              <span className="text-[11px] text-[#C2C7D0] tracking-wide">Showroom Stage</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#262A31] border border-[#31353C] text-[#B9C9D5]">
              Live
            </span>
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Hide sidebar"
              title="Hide sidebar"
              className="rounded p-1.5 text-[#C2C7D0] transition-colors hover:bg-[#262A31] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B9C9D5]"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
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
                    ? 'bg-[#262A31] text-[#B9C9D5] font-semibold border-l-2 border-[#B9C9D5]'
                    : 'text-[#C2C7D0] hover:text-[#DFE2EB] hover:bg-[#1C2026]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="w-5 h-5 rounded-full bg-[#B9C9D5] text-[#10141A] text-[11px] font-bold flex items-center justify-center shadow-sm">
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
                : 'bg-[#B9C9D5] text-[#10141A] hover:bg-[#DDE5EA]'
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
                showPricing ? 'bg-[#B9C9D5]' : 'bg-[#31353C]'
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
                showInternalDetails ? 'bg-[#B9C9D5]' : 'bg-[#31353C]'
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
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded px-2 py-2 text-xs text-[#8B9199] hover:bg-[#1C2026] hover:text-[#DFE2EB]"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Admin</span>
        </Link>
        <div className="flex items-center gap-3 p-2 rounded bg-[#10141A] border border-[#31353C]">
          <Image src="/icon.png" alt="REDHEIR logo" width={36} height={36} className="rounded-full border border-[#353940]" />
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-[#DFE2EB] truncate">Showroom Operator</span>
            <span className="text-[10px] text-[#C2C7D0] truncate">Internal Presentation Mode</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
