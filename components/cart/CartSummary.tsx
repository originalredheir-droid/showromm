'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trash2,
  ArrowRight,
  ClipboardCheck,
  Copy,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePresenter } from '@/context/PresenterContext';
import { formatINR } from '@/lib/utils';

export function CartSummary() {
  const { items, totalCount, totalEstimatedHours, totalEstimatedBaseINR, clearCart } = useCart();
  const { showPricing, showInternalDetails } = usePresenter();
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Group counts by type
  const formatBreakdown = items.reduce((acc, item) => {
    const type = item.design.conceptTypeLabel || 'Other';
    acc[type] = (acc[type] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const handleCopySummary = () => {
    const summaryText = [
      `REDHEIR SHOWROOM — CLIENT PROJECT SELECTION SUMMARY`,
      `Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}`,
      `Total Shortlisted Items: ${totalCount}`,
      showInternalDetails ? `Estimated Engineering Effort: ~${totalEstimatedHours} hours` : '',
      showPricing ? `Estimated Base Total: ${formatINR(totalEstimatedBaseINR)}` : '',
      '',
      `SELECTED SCOPE DELIVERABLES:`,
      ...items.map((item, idx) => {
        return `${idx + 1}. ${item.design.title} (${item.design.conceptTypeLabel}) × ${item.quantity}`;
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

  return (
    <div className="rounded-xl bg-[#181C22] border border-[#31353C] p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* Top Accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF535B]" />

      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-[#31353C]">
        <div>
          <h3 className="text-base font-bold text-[#DFE2EB]">Selection Summary</h3>
          <span className="text-xs text-[#8B9199]">Client Meeting Shortlist</span>
        </div>
        <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#262A31] text-[#FF535B] border border-[#31353C]">
          {totalCount} {totalCount === 1 ? 'Deliverable' : 'Deliverables'}
        </span>
      </div>

      {/* Scope Breakdown by Format */}
      <div className="space-y-2 text-xs">
        <span className="text-[#8B9199] uppercase tracking-wider text-[10px] font-semibold block">
          Composition Breakdown
        </span>
        <div className="space-y-1.5 pt-1">
          {Object.entries(formatBreakdown).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between text-[#C2C7D0]">
              <span>{type}</span>
              <span className="font-semibold text-[#DFE2EB] tabular-nums">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Hours (shown if presenter tech specs is active) */}
      {showInternalDetails && (
        <div className="p-3.5 rounded-lg bg-[#10141A] border border-[#262A31] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8B9199]">
            <span className="flex items-center gap-1.5 text-[#FF535B]">
              <Clock className="w-3.5 h-3.5" />
              <span>Total Engineering Scope</span>
            </span>
            <span className="font-mono text-sm font-bold text-[#DFE2EB]">
              ~{totalEstimatedHours} hrs
            </span>
          </div>
          <p className="text-[11px] text-[#8B9199]">
            Cumulative frontend build, component tuning, and responsive viewport tests.
          </p>
        </div>
      )}

      {/* Pricing Estimate (shown if presenter pricing is active) */}
      {showPricing && (
        <div className="pt-3 border-t border-[#31353C] space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[#8B9199] uppercase tracking-wider">Estimated Base Value</span>
            <span className="text-2xl font-bold text-[#DFE2EB] tabular-nums">
              {formatINR(totalEstimatedBaseINR)}
            </span>
          </div>
          <p className="text-[10px] text-[#8B9199]">
            * Base estimates exclude customized third-party subscriptions and cloud hosting.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-2">
        {/* Copy Brief Button */}
        <button
          onClick={handleCopySummary}
          type="button"
          className="w-full py-2.5 px-4 rounded-lg bg-[#262A31] hover:bg-[#31353C] text-xs font-semibold text-[#DFE2EB] border border-[#31353C] flex items-center justify-center gap-2 transition-colors"
        >
          {copied ? (
            <>
              <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Selection Brief Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#C2C7D0]" />
              <span>Copy Selection Brief</span>
            </>
          )}
        </button>

        {/* Continue Browsing */}
        <Link
          href="/catalogue"
          className="w-full py-2.5 px-4 rounded-lg bg-[#FF535B] hover:bg-[#bb152c] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <span>Continue Browsing Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Clear Cart */}
        {showClearConfirm ? (
          <div className="p-3 rounded-lg bg-[#10141A] border border-red-500/40 space-y-2 text-center">
            <p className="text-xs text-[#DFE2EB]">Empty all selected designs from cart?</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Yes, Empty
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1 rounded bg-[#262A31] text-[#C2C7D0] text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            type="button"
            className="w-full py-2 px-3 rounded text-xs text-[#8B9199] hover:text-[#FF535B] hover:bg-[#1C2026] transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Selection Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
