'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Check,
  Plus,
  ShoppingBag,
  Sparkles,
  Terminal,
  Palette,
  ShieldCheck,
  Clock,
  Code,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Design } from '@/types';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { ViewportPreview } from './ViewportPreview';
import { CapabilityNotice } from './CapabilityNotice';
import { formatINR, cn } from '@/lib/utils';

interface DesignShowcaseProps {
  design: Design;
  relatedDesigns: Design[];
}

export function DesignShowcase({ design, relatedDesigns }: DesignShowcaseProps) {
  const { isInCart, addToCart, removeFromCart } = useCart();
  const { showPricing, showInternalDetails } = usePresenter();
  const [activeScopeTab, setActiveScopeTab] = useState<'visual' | 'functional'>('visual');
  const inCart = isInCart(design.id);

  const handleCartToggle = () => {
    if (inCart) {
      removeFromCart(design.id);
    } else {
      addToCart(design);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#8B9199] overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-[#DFE2EB] transition-colors">Showroom</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#31353C]" />
        <Link href={`/catalogue?category=${design.categoryId}`} className="hover:text-[#DFE2EB] transition-colors">
          {design.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#31353C]" />
        <span className="text-[#DFE2EB] font-medium truncate max-w-sm">{design.title}</span>
      </nav>

      {/* Main Showcase Layout: 7 Cols Preview & Details / 3 Cols Sticky Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {/* Left Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Viewport Showcase */}
          <ViewportPreview design={design} />

          {/* Dual Scope Breakdown Tabs */}
          <div className="rounded-xl bg-[#181C22] border border-[#31353C] p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#31353C] pb-3">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveScopeTab('visual')}
                  className={cn(
                    'flex items-center gap-2 text-sm font-semibold pb-2 -mb-3.5 transition-all',
                    activeScopeTab === 'visual'
                      ? 'text-[#DFE2EB] border-b-2 border-[#B9C9D5]'
                      : 'text-[#8B9199] hover:text-[#DFE2EB]'
                  )}
                >
                  <Palette className="w-4 h-4 text-[#B9C9D5]" />
                  <span>Visual & Interactive Design</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScopeTab('functional')}
                  className={cn(
                    'flex items-center gap-2 text-sm font-semibold pb-2 -mb-3.5 transition-all',
                    activeScopeTab === 'functional'
                      ? 'text-[#DFE2EB] border-b-2 border-[#B9C9D5]'
                      : 'text-[#8B9199] hover:text-[#DFE2EB]'
                  )}
                >
                  <Terminal className="w-4 h-4 text-[#B9C9D5]" />
                  <span>Functional Architecture</span>
                </button>
              </div>
              <span className="text-xs text-[#8B9199] hidden sm:inline">Production Deliverables</span>
            </div>

            {/* Scope Content depending on active tab */}
            {activeScopeTab === 'visual' ? (
              <div className="space-y-4">
                <p className="text-xs text-[#C2C7D0] leading-relaxed">
                  {design.fullDescription}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-lg bg-[#10141A] border border-[#262A31] space-y-1.5">
                    <div className="text-xs font-semibold text-[#DFE2EB] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B9C9D5]" />
                      <span>Component System & Responsive Scaling</span>
                    </div>
                    <p className="text-[11px] text-[#C2C7D0]">
                      Fluid layouts calibrated for high-density desktop dashboards down to thumb-friendly mobile views. Zero layout shifts.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#10141A] border border-[#262A31] space-y-1.5">
                    <div className="text-xs font-semibold text-[#DFE2EB] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#B9C9D5]" />
                      <span>Interaction Choreography</span>
                    </div>
                    <p className="text-[11px] text-[#C2C7D0]">
                      Smooth micro-interactions, modal drawers, and subgrid alignment adhering to the anti-slop executive standard.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#C2C7D0] leading-relaxed">
                  Engineered using clean, modular React components designed for handoff and future extension via GitHub and VS Code.
                </p>
                <div className="p-3.5 rounded-lg bg-[#10141A] border border-[#262A31] space-y-2">
                  <span className="text-xs font-semibold text-[#DFE2EB] block">Modular Deliverables:</span>
                  <ul className="space-y-1 text-xs text-[#C2C7D0]">
                    {design.technicalSpecs.deliverables.map((del, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Mandatory Visual vs Functional Capability Notice */}
          <CapabilityNotice customNotice={design.functionalNotice} />

          {/* Included Features Checklist */}
          {design.features.length > 0 && (
            <div className="rounded-xl bg-[#181C22] border border-[#31353C] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#DFE2EB]">Included Core Features</h3>
                <span className="text-xs text-[#8B9199]">{design.features.length} Features Included</span>
              </div>
              <div className="divide-y divide-[#262A31]">
                {design.features.map((feat, i) => (
                  <div key={i} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-[#DFE2EB]">{feat.title}</div>
                      <div className="text-xs text-[#C2C7D0] mt-0.5 leading-relaxed">{feat.description}</div>
                    </div>
                    {feat.status && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        {feat.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related / Complementary Showcase Modules */}
          {relatedDesigns.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#DFE2EB]">Complementary Showcase Modules</h3>
                <Link href="/catalogue" className="text-xs text-[#B9C9D5] hover:underline flex items-center gap-1">
                  <span>View All in Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedDesigns.map((rel) => {
                  const relInCart = isInCart(rel.id);
                  return (
                    <div
                      key={rel.id}
                      className="p-3.5 rounded-lg bg-[#181C22] border border-[#31353C] hover:border-[#B9C9D5]/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#8B9199] uppercase font-semibold mb-1">
                          <span>{rel.conceptTypeLabel}</span>
                          {relInCart && <span className="text-[#B9C9D5] font-bold">IN CART</span>}
                        </div>
                        <Link href={`/design/${rel.id}`} className="block">
                          <h4 className="text-xs font-semibold text-[#DFE2EB] hover:text-[#B9C9D5] transition-colors line-clamp-1">
                            {rel.title}
                          </h4>
                        </Link>
                        <p className="text-[11px] text-[#C2C7D0] line-clamp-2 mt-1">
                          {rel.shortDescription}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#262A31] flex items-center justify-between text-xs">
                        {showPricing && (
                          <span className="font-semibold text-[#DFE2EB]">
                            {formatINR(rel.commercial.estimatedBaseINR)}
                          </span>
                        )}
                        <Link
                          href={`/design/${rel.id}`}
                          className="text-[11px] font-semibold text-[#B9C9D5] hover:underline ml-auto"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Commercial Action Inspector (3 Cols) */}
        <div className="lg:col-span-3 sticky top-24 space-y-4">
          <div className="rounded-xl bg-[#181C22] border border-[#31353C] p-5 space-y-5 shadow-xl">
            {/* Header Tags */}
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#B9C9D5]/15 text-[#B9C9D5] border border-[#B9C9D5]/30">
                {design.conceptTypeLabel}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#262A31] text-[#C2C7D0] border border-[#31353C]">
                {design.categoryName.split('&')[0].trim()}
              </span>
            </div>

            {/* Title & Subhead */}
            <div className="space-y-1.5 border-b border-[#262A31] pb-4">
              <h1 className="text-lg font-bold text-[#DFE2EB] leading-tight">
                {design.title}
              </h1>
              <p className="text-xs text-[#C2C7D0] leading-relaxed">
                {design.shortDescription}
              </p>
            </div>

            {/* Commercial Base Estimate (Shown when Show Pricing is ON) */}
            {showPricing && design.commercial.estimatedBaseINR > 0 && (
              <div className="p-3.5 rounded-lg bg-[#10141A] border border-[#262A31] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8B9199]">
                  <span>Commercial Base</span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">100% Client IP</span>
                </div>
                <div className="text-2xl font-bold text-[#DFE2EB] tabular-nums">
                  {formatINR(design.commercial.estimatedBaseINR)}
                </div>
                <div className="space-y-1 text-[11px] text-[#C2C7D0] border-t border-[#262A31] pt-2">
                  <div className="flex justify-between">
                    <span>License:</span>
                    <span className="text-[#DFE2EB] font-medium">{design.commercial.licenseType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warranty:</span>
                    <span className="text-[#DFE2EB] font-medium">{design.commercial.warrantyDays} Days Hotfix</span>
                  </div>
                </div>
              </div>
            )}
            {showPricing && design.commercial.estimatedBaseINR <= 0 && (
              <p className="text-xs text-[#8B9199]">Pricing available on request</p>
            )}

            {/* Technical Specifications (Shown when Technical Specs is ON) */}
            {showInternalDetails && (
              design.technicalSpecs.devHours > 0 ||
              design.technicalSpecs.techStack.length > 0 ||
              design.technicalSpecs.deliverables.length > 0
            ) && (
              <div className="p-3.5 rounded-lg bg-[#10141A] border border-[#262A31] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8B9199]">
                  <span className="flex items-center gap-1 text-[#B9C9D5]">
                    <Clock className="w-3 h-3" />
                    <span>Technical Dev Specs</span>
                  </span>
                  <span className="font-mono text-[#DFE2EB] font-bold">~{design.technicalSpecs.devHours}h</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {design.technicalSpecs.techStack.map((tech) => (
                    <span key={tech} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#181C22] text-[#C2C7D0] border border-[#31353C]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCartToggle}
                className={cn(
                  'w-full py-3 px-4 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]',
                  inCart
                    ? 'bg-[#1C2026] border border-[#B9C9D5] text-[#B9C9D5] hover:bg-[#262A31]'
                    : 'bg-[#B9C9D5] text-[#10141A] hover:bg-[#DDE5EA]'
                )}
              >
                {inCart ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>In Selection Cart (Click to Remove)</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Concept to Selection Cart</span>
                  </>
                )}
              </button>

              <Link
                href="/selection"
                className="w-full py-2.5 px-4 rounded bg-[#1C2026] border border-[#31353C] hover:border-[#DFE2EB] text-xs font-medium text-[#DFE2EB] flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <span>View Full Selection Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
