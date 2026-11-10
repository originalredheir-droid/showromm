'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { ConceptType } from '@/types';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  totalResults: number;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  onClearFilters,
  activeFilterCount,
  totalResults,
}: FilterBarProps) {
  const conceptTypes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Formats' },
    { id: 'concept', label: 'Complete Concepts' },
    { id: 'module', label: 'Functional Modules' },
    { id: 'page', label: 'Individual Pages' },
    { id: 'section', label: 'UI Sections & Screens' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter Row: Search & Dropdowns */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B9199]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search concepts by title, technology, or keywords..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#181C22] border border-[#31353C] rounded-lg text-sm text-[#DFE2EB] placeholder-[#8B9199] focus:outline-none focus:border-[#FF535B] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B9199] hover:text-[#DFE2EB]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Sorters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-10 pl-3 pr-8 bg-[#181C22] border border-[#31353C] rounded-lg text-xs font-medium text-[#DFE2EB] focus:outline-none focus:border-[#FF535B] cursor-pointer"
            >
              <option value="all">All Industries (10)</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-10 pl-3 pr-8 bg-[#181C22] border border-[#31353C] rounded-lg text-xs font-medium text-[#DFE2EB] focus:outline-none focus:border-[#FF535B] cursor-pointer"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="price-asc">Estimated: Low to High</option>
              <option value="price-desc">Estimated: High to Low</option>
              <option value="hours">Sort: Dev Hours</option>
            </select>
          </div>

          {/* Clear Filters Button (shown when any filter active) */}
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              type="button"
              className="h-10 px-3 flex items-center gap-1.5 rounded-lg bg-[#262A31] border border-[#31353C] text-xs font-medium text-[#FF535B] hover:bg-[#31353C] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented Concept Type Tabs */}
      <div className="flex items-center justify-between border-b border-[#262A31] pb-3 gap-4 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          {conceptTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => onTypeChange(type.id)}
                type="button"
                className={cn(
                  'px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap',
                  isSelected
                    ? 'bg-[#FF535B] text-white shadow-sm font-semibold'
                    : 'text-[#C2C7D0] hover:text-[#DFE2EB] hover:bg-[#181C22]'
                )}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="text-xs text-[#8B9199] whitespace-nowrap shrink-0">
          Showing <span className="text-[#DFE2EB] font-semibold">{totalResults}</span> designs
        </div>
      </div>
    </div>
  );
}
