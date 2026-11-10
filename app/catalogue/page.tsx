'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DESIGNS } from '@/data/designs';
import { CATEGORIES } from '@/data/categories';
import { FilterBar } from '@/components/catalogue/FilterBar';
import { CatalogueCard } from '@/components/catalogue/CatalogueCard';
import { EmptyState } from '@/components/catalogue/EmptyState';

function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial values from URL query parameters if available
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState(initialType);
  const [sortBy, setSortBy] = useState('featured');

  // Filter & Sort designs
  const filteredDesigns = useMemo(() => {
    return DESIGNS.filter((design) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && design.categoryId !== selectedCategory) {
        return false;
      }

      // 2. Concept Type Filter
      if (selectedType !== 'all' && design.conceptType !== selectedType) {
        return false;
      }

      // 3. Keyword Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = design.title.toLowerCase().includes(query);
        const matchesDesc = design.shortDescription.toLowerCase().includes(query);
        const matchesCategory = design.categoryName.toLowerCase().includes(query);
        const matchesTags = design.tags.some((t) => t.toLowerCase().includes(query));
        const matchesStack = design.technicalSpecs.techStack.some((s) => s.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesTags && !matchesStack) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }
      if (sortBy === 'popular') {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return 0;
      }
      if (sortBy === 'price-asc') {
        return a.commercial.estimatedBaseINR - b.commercial.estimatedBaseINR;
      }
      if (sortBy === 'price-desc') {
        return b.commercial.estimatedBaseINR - a.commercial.estimatedBaseINR;
      }
      if (sortBy === 'hours') {
        return b.technicalSpecs.devHours - a.technicalSpecs.devHours;
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedType, sortBy]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    router.replace('/catalogue');
  };

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category / Catalogue Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#31353C]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#DFE2EB]">
            {currentCategoryObj ? currentCategoryObj.name : 'Website Designs & Modular Catalogue'}
          </h1>
          <p className="text-xs text-[#C2C7D0] mt-1">
            {currentCategoryObj
              ? currentCategoryObj.description
              : 'Browse ready-to-deploy website concepts, landing pages, interactive calculators, and specialized modules.'}
          </p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#181C22] border border-[#31353C] text-xs font-semibold text-[#FF535B] hover:bg-[#262A31] transition-colors"
          >
            Show All Categories
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
        totalResults={filteredDesigns.length}
      />

      {/* Catalogue Cards Grid */}
      {filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredDesigns.map((design) => (
            <CatalogueCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <EmptyState onReset={handleClearFilters} query={searchQuery} />
      )}
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-[#8B9199]">
          Loading showroom catalogue...
        </div>
      }
    >
      <CatalogueContent />
    </Suspense>
  );
}
