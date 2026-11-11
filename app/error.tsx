'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for operator diagnostics
    console.error('Showroom runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center rounded-2xl bg-[#181C22] border border-[#31353C] p-8 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Crimson Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF535B]" />

        {/* Soft Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-[#FF535B] opacity-10 blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#10141A] border border-[#31353C] flex items-center justify-center text-[#FF535B] mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8 text-[#FF535B]" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#262A31] text-[#FF535B] border border-[#31353C]">
            Application Error
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#DFE2EB]">
            Something Went Wrong
          </h1>
          <p className="text-xs text-[#C2C7D0] leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while rendering the showroom interface. You can attempt to reload the view or return to the showroom home.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF535B] hover:bg-[#bb152c] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#262A31] hover:bg-[#31353C] text-xs font-semibold text-[#DFE2EB] border border-[#31353C] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Showroom Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
