'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Grid3X3,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { DESIGNS } from '@/data/designs';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { CatalogueCard } from '@/components/catalogue/CatalogueCard';

export default function HomePage() {
  const featuredDesigns = DESIGNS.filter((d) => d.featured || d.popular).slice(0, 3);
  const featuredCategory = CATEGORIES.find((c) => c.id === 'education') || CATEGORIES[0];
  const regularCategories = CATEGORIES.filter((c) => c.id !== featuredCategory.id);

  return (
    <div className="space-y-10">
      {/* Hero Welcome Banner */}
      <section className="relative rounded-2xl p-6 sm:p-8 bg-[#181C22] border border-[#31353C] overflow-hidden">
        {/* Soft Crimson Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#FF535B] opacity-5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#10141A] border border-[#31353C]">
              <span className="w-2 h-2 rounded-full bg-[#FF535B] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#C2C7D0] uppercase tracking-wider">
                Digital Showroom Stage
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#DFE2EB]">
              REDHEIR Interactive Showroom
            </h1>

            <p className="text-sm text-[#C2C7D0] leading-relaxed max-w-2xl">
              Presenting bespoke digital experiences, modular architectures, and conversion-focused web applications.
              Browse live during client consultations and curate project selections seamlessly.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF535B] hover:bg-[#bb152c] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
              >
                <span>Browse Full Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#262A31] hover:bg-[#31353C] text-xs font-semibold text-[#DFE2EB] border border-[#31353C] transition-colors"
              >
                <Layers className="w-4 h-4 text-[#C2C7D0]" />
                <span>Industry Verticals</span>
              </Link>
            </div>
          </div>

          {/* Quick Industry Filter Badges */}
          <div className="flex flex-wrap lg:flex-col gap-2 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-[#262A31] pt-4 lg:pt-0 lg:pl-6">
            <span className="text-[11px] text-[#8B9199] uppercase font-semibold block">
              Quick Jump:
            </span>
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogue?category=${cat.id}`}
                  className="px-2.5 py-1 rounded bg-[#10141A] hover:bg-[#262A31] text-[11px] text-[#C2C7D0] hover:text-[#DFE2EB] border border-[#31353C] transition-colors"
                >
                  {cat.name.split('&')[0].trim()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SPECIALIZED INDUSTRY DOMAINS (Bento Grid of Categories) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#DFE2EB]">Specialized Industry Domains</h2>
            <p className="text-xs text-[#C2C7D0] mt-0.5">
              Engineered web applications and modular UI components organized by commercial vertical
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#FF535B] hover:underline font-semibold"
          >
            <span>View All 10 Sectors</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 12-Column Responsive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Featured Large Bento Card (Education - 8 cols) */}
          <CategoryCard
            category={featuredCategory}
            span="col-span-1 md:col-span-12 lg:col-span-8"
            isFeatured
          />

          {/* First side card (Healthcare - 4 cols) */}
          {regularCategories[0] && (
            <CategoryCard
              category={regularCategories[0]}
              span="col-span-1 md:col-span-6 lg:col-span-4"
            />
          )}

          {/* Next row of cards */}
          {regularCategories.slice(1, 4).map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              span="col-span-1 md:col-span-6 lg:col-span-4"
            />
          ))}

          {/* E-commerce (6 cols) and Hospitality (6 cols) */}
          {regularCategories.slice(4, 6).map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              span="col-span-1 md:col-span-6 lg:col-span-6"
            />
          ))}
        </div>
      </section>

      {/* SECTION: FEATURED SHOWROOM DESIGNS */}
      <section className="space-y-5 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#DFE2EB]">Featured Website Concepts</h2>
            <p className="text-xs text-[#C2C7D0] mt-0.5">
              High-conversion assets verified across production deployments and interactive prototypes
            </p>
          </div>
          <Link
            href="/catalogue"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181C22] border border-[#31353C] hover:border-[#FF535B] text-xs font-semibold text-[#DFE2EB] transition-colors"
          >
            <span>Explore All Concepts</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF535B]" />
          </Link>
        </div>

        {/* 3-Column Showcase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDesigns.map((design) => (
            <CatalogueCard key={design.id} design={design} />
          ))}
        </div>
      </section>

      {/* BOTTOM SHOWROOM FOOTER STRIP */}
      <footer className="pt-6 pb-2 border-t border-[#31353C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B9199]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Showroom Mode Active</span>
          </span>
          <span>·</span>
          <span>Core Concept: Explore → Select → Review</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Internal Client Meeting Console</span>
          <span className="font-mono text-[#DFE2EB]">REDHEIR STUDIO</span>
        </div>
      </footer>
    </div>
  );
}
