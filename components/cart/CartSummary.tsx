'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trash2,
  ArrowRight,
  ClipboardCheck,
  Copy,
  Clock,
  Printer,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { formatINR } from '@/lib/utils';

export function CartSummary() {
  const { items, totalCount, totalEstimatedHours, totalEstimatedBaseINR, clearCart } = useCart();
  const { showPricing, showInternalDetails } = usePresenter();
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCopySummary = () => {
    const summaryText = [
      `REDHEIR SHOWROOM — CLIENT PROJECT SELECTION SUMMARY`,
      `Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}`,
      `Total Image Offers: ${totalCount}`,
      showInternalDetails ? `Estimated Engineering Effort: ~${totalEstimatedHours} hours` : '',
      showPricing ? `Estimated Base Total: ${formatINR(totalEstimatedBaseINR)}` : '',
      '',
      `SELECTED SCOPE DELIVERABLES:`,
      ...items.map((item, idx) => {
        const parts = [
          `${idx + 1}. ${item.design.title}${item.screen.title ? ` — ${item.screen.title}` : ''}`,
          item.screen.description,
          item.screen.estimatedPriceINR === undefined ? 'Price on request' : formatINR(item.screen.estimatedPriceINR),
          item.screen.devHours === undefined ? 'Time not estimated' : `~${item.screen.devHours} hours`,
        ];
        return parts.filter(Boolean).join(' · ');
      }),
      '',
      `Generated via REDHEIR Interactive Showroom`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    document.body.classList.add('printing-selection');
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing-selection');
    }, { once: true });
    window.print();
  };

  return (
    <div className="print-summary rounded-xl bg-[#181C22] border border-[#31353C] p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Top Accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#B9C9D5]" />

      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-[#31353C]">
        <div>
          <h3 className="text-base font-bold text-[#DFE2EB]">Selection Summary</h3>
          <span className="text-xs text-[#8B9199]">Selected image offers</span>
        </div>
        <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#262A31] text-[#B9C9D5] border border-[#31353C]">
          {totalCount} {totalCount === 1 ? 'Deliverable' : 'Deliverables'}
        </span>
      </div>

      <div className="print-total space-y-2 rounded-lg border border-[#262A31] bg-[#10141A] p-3.5">
        <div className="flex items-center justify-between text-xs text-[#8B9199]">
          <span className="flex items-center gap-1.5 text-[#B9C9D5]">
            <Clock className="w-3.5 h-3.5" />
            <span>Total development time</span>
          </span>
          <span className="font-mono text-sm font-bold text-[#DFE2EB]">
            ~{totalEstimatedHours} hrs
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#262A31] pt-2">
          <span className="text-xs uppercase tracking-wider text-[#8B9199]">Estimated total</span>
          <span className="text-xl font-bold tabular-nums text-[#DFE2EB]">
            {formatINR(totalEstimatedBaseINR)}
          </span>
        </div>
        <p className="text-[10px] text-[#8B9199]">
          Totals include entered estimates only. Offers without a price or time estimate are marked individually.
        </p>
      </div>

      <div className="print-hide space-y-3 pt-2">
        <button
          onClick={handlePrint}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#B9C9D5] px-4 py-2.5 text-xs font-semibold text-[#10141A] transition-colors hover:bg-[#DDE5EA]"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save as PDF</span>
        </button>
        <button
          onClick={handleCopySummary}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#31353C] bg-[#262A31] px-4 py-2.5 text-xs font-semibold text-[#DFE2EB] transition-colors hover:bg-[#31353C]"
        >
          {copied ? (
            <>
              <ClipboardCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">Selection Brief Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-[#C2C7D0]" />
              <span>Copy Selection Brief</span>
            </>
          )}
        </button>

        <Link
          href="/catalogue"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#31353C] bg-[#1C2026] px-4 py-2.5 text-xs font-semibold text-[#DFE2EB] transition-colors hover:border-[#DFE2EB]"
        >
          <span>Continue Browsing Catalogue</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        {showClearConfirm ? (
          <div className="space-y-2 rounded-lg border border-red-500/40 bg-[#10141A] p-3 text-center">
            <p className="text-xs text-[#DFE2EB]">Empty all selected image offers?</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
              >
                Yes, Empty
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded bg-[#262A31] px-3 py-1 text-xs text-[#C2C7D0]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            type="button"
            className="flex w-full items-center justify-center gap-1.5 rounded px-3 py-2 text-xs text-[#8B9199] transition-colors hover:bg-[#1C2026] hover:text-[#B9C9D5]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Empty Selection Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
