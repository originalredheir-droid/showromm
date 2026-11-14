import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Grid3X3 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center rounded-2xl bg-[#181C22] border border-[#31353C] p-8 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Crimson Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#B9C9D5]" />

        {/* Soft Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-[#B9C9D5] opacity-10 blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#10141A] border border-[#31353C] flex items-center justify-center text-[#B9C9D5] mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#262A31] text-[#B9C9D5] border border-[#31353C]">
            404 Error
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#DFE2EB]">
            Showroom Concept Not Found
          </h1>
          <p className="text-xs text-[#C2C7D0] leading-relaxed max-w-sm mx-auto">
            The design concept, category, or showroom screen you are looking for does not exist or may have been relocated.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/catalogue"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#B9C9D5] hover:bg-[#DDE5EA] text-[#10141A] text-xs font-semibold tracking-wide transition-colors shadow-sm"
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Browse Catalogue</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#262A31] hover:bg-[#31353C] text-xs font-semibold text-[#DFE2EB] border border-[#31353C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Showroom Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
