'use client';

import React, { useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Category, Design } from '@/types';
import { FilterBar } from '@/components/catalogue/FilterBar';
import { CatalogueCard } from '@/components/catalogue/CatalogueCard';
import { EmptyState } from '@/components/catalogue/EmptyState';
import { PublicEmptyState } from '@/components/catalogue/PublicEmptyState';

function CatalogueContent({ designs, categories }: { designs: Design[]; categories: Category[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredDesigns = useMemo(() => designs.filter((design) => {
    if (selectedCategory !== 'all' && design.categoryId !== selectedCategory) return false;
    if (selectedType !== 'all' && design.conceptType !== selectedType) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const searchable = [
        design.title,
        design.shortDescription,
        design.categoryName,
        ...design.tags,
        ...design.technicalSpecs.techStack,
      ];
      if (!searchable.some((value) => value.toLowerCase().includes(query))) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'featured') return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (sortBy === 'popular') return Number(Boolean(b.popular)) - Number(Boolean(a.popular));
    if (sortBy === 'price-asc') return a.commercial.estimatedBaseINR - b.commercial.estimatedBaseINR;
    if (sortBy === 'price-desc') return b.commercial.estimatedBaseINR - a.commercial.estimatedBaseINR;
    if (sortBy === 'hours') return b.technicalSpecs.devHours - a.technicalSpecs.devHours;
    return 0;
  }), [designs, searchQuery, selectedCategory, selectedType, sortBy]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    router.replace('/catalogue');
  };
  const currentCategory = categories.find((category) => category.id === selectedCategory);

  if (!designs.length) {
    return (
      <PublicEmptyState
        title="The catalogue is being prepared"
        description="There are no published designs yet. Please check back soon."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-[#31353C] pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#DFE2EB]">
            {currentCategory?.name ?? 'Website Designs & Modular Catalogue'}
          </h1>
          <p className="mt-1 text-xs text-[#C2C7D0]">
            {currentCategory?.description ?? 'Browse published website concepts, pages, and modules.'}
          </p>
        </div>
        {selectedCategory !== 'all' && (
          <button onClick={() => setSelectedCategory('all')} className="self-start rounded-lg border border-[#31353C] bg-[#181C22] px-3 py-1.5 text-xs font-semibold text-[#B9C9D5] sm:self-auto">
            Show All Categories
          </button>
        )}
      </div>
      <FilterBar
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
        totalResults={filteredDesigns.length}
      />
      {filteredDesigns.length ? (
        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {filteredDesigns.map((design) => <CatalogueCard key={design.id} design={design} />)}
        </div>
      ) : (
        <EmptyState onReset={clearFilters} query={searchQuery} />
      )}
    </div>
  );
}

export function CatalogueBrowser({ designs, categories }: { designs: Design[]; categories: Category[] }) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-[#8B9199]">Loading catalogue…</div>}>
      <CatalogueContent designs={designs} categories={categories} />
    </Suspense>
  );
}
