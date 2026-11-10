'use client';

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  query?: string;
}

export function EmptyState({ onReset, query }: EmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center rounded-xl bg-[#181C22] border border-[#31353C] max-w-md mx-auto my-8 space-y-4">
      <div className="w-12 h-12 rounded-full bg-[#262A31] border border-[#353940] flex items-center justify-center text-[#FF535B] mx-auto">
        <SearchX className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-[#DFE2EB]">No matching concepts found</h4>
        <p className="text-xs text-[#C2C7D0] leading-relaxed">
          {query
            ? `No showroom designs matched "${query}". Try adjusting your keywords or clearing category filters.`
            : 'No designs match the currently selected criteria. Reset filters to browse the complete catalogue.'}
        </p>
      </div>
      <div>
        <button
          onClick={onReset}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#262A31] hover:bg-[#31353C] text-xs font-semibold text-[#FF535B] border border-[#31353C] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset all filters</span>
        </button>
      </div>
    </div>
  );
}
