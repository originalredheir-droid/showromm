'use client';

import React, { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Trash2,
  ArrowRight,
  ClipboardCheck,
  Copy,
  Clock,
  Printer,
  FileText,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import type { BusinessProfile, ProposalDocument as ProposalData } from '@/lib/proposals';
import { ProposalDocument } from '@/components/proposals/ProposalDocument';

function localDateValue() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isBusinessProfile(value: unknown): value is BusinessProfile {
  if (typeof value !== 'object' || value === null) return false;
  const profile = value as Record<string, unknown>;
  return ['companyName', 'brandName', 'address', 'email', 'phone', 'website', 'logoPath']
    .every((key) => typeof profile[key] === 'string');
}

export function CartSummary() {
  const { items, totalCount, totalEstimatedHours, totalEstimatedBaseINR, clearCart } = useCart();
  const formRef = useRef<HTMLFormElement>(null);
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [needsAdminSignIn, setNeedsAdminSignIn] = useState(false);
  const [proposalPreview, setProposalPreview] = useState<ProposalData | null>(null);
  const [brandingWarning, setBrandingWarning] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [proposalDate, setProposalDate] = useState(localDateValue);
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');

  const handleCopySummary = async () => {
    const summaryText = [
      'REDHEIR SHOWROOM — CLIENT PROJECT PROPOSAL',
      `Date: ${proposalDate}`,
      `Client: ${clientName}${clientCompany ? ` (${clientCompany})` : ''}`,
      `Project: ${projectName}`,
      `Total Image Offers: ${totalCount}`,
      `Estimated Development Time: ~${totalEstimatedHours} hours`,
      `Estimated Total: ${formatINR(totalEstimatedBaseINR)}`,
      '',
      'SELECTED IMAGE OFFERS:',
      ...items.map((item, index) => {
        const detail = [
          `${index + 1}. ${item.design.title}${item.screen.title ? ` — ${item.screen.title}` : ''}`,
          item.screen.description,
          item.screen.estimatedPriceINR === undefined ? 'Price on request' : formatINR(item.screen.estimatedPriceINR),
          item.screen.devHours === undefined ? 'Time not estimated' : `~${item.screen.devHours} hours`,
        ];
        return detail.filter(Boolean).join(' · ');
      }),
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? `Could not copy brief: ${error.message}` : 'Could not copy the proposal brief.');
    }
  };

  const handleGenerateProposal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsGenerating(true);
    try {
      const response = await fetch('/api/proposals/branding', { cache: 'no-store' });
      const result: unknown = await response.json();
      if (!response.ok || !result || typeof result !== 'object') {
        const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
          ? result.error
          : 'Could not load proposal business details.';
        throw new Error(message);
      }
      if (!('profile' in result) || !isBusinessProfile(result.profile)) {
        throw new Error('Proposal business details were returned in an invalid format.');
      }
      const warning = 'warning' in result && typeof result.warning === 'string' ? result.warning : '';

      setBrandingWarning(warning);
      setProposalPreview({
        id: 'draft',
        proposalNumber: '',
        proposalDate,
        validUntil: validUntil || null,
        clientName,
        clientCompany,
        clientEmail,
        clientPhone,
        projectName,
        projectBrief,
        notes,
        items: items.map(({ design, screen }) => ({
          catalogTitle: design.title,
          title: screen.title || '',
          description: screen.description || '',
          image: screen.image,
          estimatedPriceINR: screen.estimatedPriceINR ?? null,
          devHours: screen.devHours ?? null,
        })),
        businessProfile: result.profile,
        totalEstimatedINR: totalEstimatedBaseINR,
        totalEstimatedHours,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not prepare this proposal.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProposal = async () => {
    if (!formRef.current?.reportValidity()) return;
    setErrorMessage('');
    setNeedsAdminSignIn(false);
    setIsSaving(true);
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientCompany,
          clientEmail,
          clientPhone,
          projectName,
          projectBrief,
          proposalDate,
          validUntil,
          notes,
          items: items.map(({ design, screen }) => ({
            catalogTitle: design.title,
            title: screen.title || '',
            description: screen.description || '',
            image: screen.image,
            estimatedPriceINR: screen.estimatedPriceINR ?? null,
            devHours: screen.devHours ?? null,
          })),
        }),
      });
      const result: unknown = await response.json();
      if (response.status === 401) {
        setNeedsAdminSignIn(true);
        throw new Error('Sign in as an admin to save a copy to the admin records.');
      }
      if (!response.ok || !result || typeof result !== 'object' || !('proposal_id' in result)) {
        const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
          ? result.error
          : 'Could not save this proposal.';
        throw new Error(message);
      }
      window.location.assign(`/admin/proposals/${result.proposal_id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not save this proposal.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintCurrentSelection = () => {
    document.body.classList.add('printing-selection');
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing-selection');
    }, { once: true });
    window.print();
  };

  if (proposalPreview) {
    return (
      <div className="proposal-preview-overlay fixed inset-0 z-[100] overflow-y-auto bg-[#10141A] p-3 sm:p-6">
        {brandingWarning && (
          <p role="status" className="print-hide mx-auto mb-3 max-w-5xl rounded-lg border border-amber-500/40 bg-amber-950/20 p-3 text-xs text-amber-200">
            {brandingWarning} The proposal can still be printed without branding.
          </p>
        )}
        <ProposalDocument proposal={proposalPreview} onClose={() => setProposalPreview(null)} />
      </div>
    );
  }

  return (
    <div className="print-summary space-y-5 rounded-xl border border-[#31353C] bg-[#181C22] p-4 shadow-xl sm:p-6">
      <div className="print-hide space-y-2 border-b border-[#31353C] pb-4">
        <h2 className="text-base font-bold text-[#DFE2EB]">Proposal details</h2>
        <p className="text-xs leading-relaxed text-[#8B9199]">
          Generate a proposal PDF without signing in. Your client and project details stay in this browser unless an admin separately saves a copy.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleGenerateProposal} className="print-hide space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-medium text-[#C2C7D0]">Client name *</span>
            <input required maxLength={200} value={clientName} onChange={(event) => setClientName(event.target.value)} className="admin-input min-h-11" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-[#C2C7D0]">Company</span>
            <input maxLength={200} value={clientCompany} onChange={(event) => setClientCompany(event.target.value)} className="admin-input min-h-11" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-[#C2C7D0]">Email</span>
            <input type="email" maxLength={200} value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} className="admin-input min-h-11" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-[#C2C7D0]">Phone</span>
            <input type="tel" maxLength={50} value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} className="admin-input min-h-11" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-[#C2C7D0]">Project name *</span>
            <input required maxLength={200} value={projectName} onChange={(event) => setProjectName(event.target.value)} className="admin-input min-h-11" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-[#C2C7D0]">Proposal date</span>
            <input type="date" required value={proposalDate} onChange={(event) => setProposalDate(event.target.value)} className="admin-input min-h-11" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-[#C2C7D0]">Valid until (optional)</span>
            <input type="date" min={proposalDate} value={validUntil} onChange={(event) => setValidUntil(event.target.value)} className="admin-input min-h-11" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-[#C2C7D0]">Project specification / brief</span>
            <textarea maxLength={10000} rows={4} value={projectBrief} onChange={(event) => setProjectBrief(event.target.value)} className="admin-input" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-[#C2C7D0]">Notes and assumptions</span>
            <textarea maxLength={10000} rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} className="admin-input" />
          </label>
        </div>
        {errorMessage && (
          <div role="alert" className="space-y-2 text-sm text-red-400">
            <p>{errorMessage}</p>
            {needsAdminSignIn && (
              <p className="text-xs text-[#C2C7D0]">
                  Open <Link href="/admin/login" target="_blank" rel="noreferrer" className="font-semibold text-[#B9C9D5] underline">admin sign-in</Link> in another tab, then return here and save again. Generating the client PDF does not require sign-in.
              </p>
            )}
          </div>
        )}
        <button
          disabled={isGenerating || isSaving || items.length === 0}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#B9C9D5] px-4 py-3 text-sm font-semibold text-[#10141A] transition-colors hover:bg-[#DDE5EA] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileText className="h-4 w-4" />
          <span>{isGenerating ? 'Preparing proposal…' : 'Generate proposal & open PDF preview'}</span>
        </button>
        <button
          type="button"
          disabled={isSaving || isGenerating || items.length === 0}
          onClick={handleSaveProposal}
          className="min-h-10 w-full rounded-lg border border-[#31353C] px-4 py-2 text-xs font-medium text-[#C2C7D0] transition-colors hover:border-[#B9C9D5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving admin copy…' : 'Save a copy to admin records (admin only)'}
        </button>
        <button
          type="button"
          onClick={handleCopySummary}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#31353C] bg-[#262A31] px-4 py-2.5 text-xs font-semibold text-[#DFE2EB] transition-colors hover:bg-[#31353C]"
        >
          {copied ? <ClipboardCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? 'Brief copied' : 'Copy proposal summary'}</span>
        </button>
      </form>

      <div className="print-total space-y-2 rounded-lg border border-[#262A31] bg-[#10141A] p-3.5">
        <div className="flex items-center justify-between text-xs text-[#8B9199]">
          <span className="inline-flex items-center gap-1.5 text-[#B9C9D5]">
            <Clock className="h-3.5 w-3.5" />
            Total development time
          </span>
          <span className="font-mono text-sm font-bold text-[#DFE2EB]">~{totalEstimatedHours} hrs</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#262A31] pt-2">
          <span className="text-xs uppercase tracking-wider text-[#8B9199]">Estimated total</span>
          <span className="text-xl font-bold tabular-nums text-[#DFE2EB]">{formatINR(totalEstimatedBaseINR)}</span>
        </div>
        <p className="text-[10px] text-[#8B9199]">
          Totals include entered estimates only. Offers without a price or time estimate are marked individually.
        </p>
      </div>

      <div className="print-hide space-y-3 border-t border-[#31353C] pt-4">
        <button
          onClick={handlePrintCurrentSelection}
          type="button"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#31353C] bg-[#1C2026] px-4 py-2.5 text-xs font-semibold text-[#DFE2EB] transition-colors hover:border-[#B9C9D5]"
        >
          <Printer className="h-4 w-4" />
          <span>Print current selection</span>
        </button>
        <Link
          href="/catalogue"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#31353C] bg-[#1C2026] px-4 py-2.5 text-xs font-semibold text-[#DFE2EB] transition-colors hover:border-[#DFE2EB]"
        >
          <span>Continue Browsing Catalogue</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        {showClearConfirm ? (
          <div className="space-y-2 rounded-lg border border-red-500/40 bg-[#10141A] p-3 text-center">
            <p className="text-xs text-[#DFE2EB]">Empty all selected image offers?</p>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => { clearCart(); setShowClearConfirm(false); }} className="min-h-10 rounded bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">
                Yes, Empty
              </button>
              <button onClick={() => setShowClearConfirm(false)} className="min-h-10 rounded bg-[#262A31] px-4 py-2 text-xs text-[#C2C7D0]">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            type="button"
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded px-3 py-2 text-xs text-[#8B9199] transition-colors hover:bg-[#1C2026] hover:text-[#B9C9D5]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Empty Selection Cart ({totalCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
