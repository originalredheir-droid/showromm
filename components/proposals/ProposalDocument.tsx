import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { getBusinessLogoUrl, type ProposalDocument as ProposalData } from '@/lib/proposals';
import { ProposalPrintButton } from './ProposalPrintButton';

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ProposalDocument({ proposal }: { proposal: ProposalData }) {
  const profile = proposal.businessProfile;
  const logoUrl = getBusinessLogoUrl(profile.logoPath);
  const businessName = profile.brandName || profile.companyName;

  return (
    <div className="proposal-document mx-auto max-w-5xl space-y-6">
      <div className="print-hide flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/proposals" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#31353C] px-4 py-2.5 text-sm text-[#C2C7D0] hover:border-[#B9C9D5]">
          <ArrowLeft className="h-4 w-4" />
          Saved proposals
        </Link>
        <ProposalPrintButton />
      </div>

      <article className="space-y-7 rounded-2xl border border-[#31353C] bg-white p-5 text-[#17202A] shadow-xl sm:p-9 print:border-0 print:p-0 print:shadow-none">
        <header className="flex flex-col justify-between gap-5 border-b border-[#D5DCE3] pb-5 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt={businessName || 'Business logo'}
                width={140}
                height={100}
                unoptimized
                className="h-auto max-h-20 w-auto max-w-36 object-contain"
              />
            )}
            <div className="space-y-1">
              {businessName && <h1 className="text-xl font-bold">{businessName}</h1>}
              {profile.companyName && profile.brandName && profile.companyName !== profile.brandName && (
                <p className="text-sm text-[#475569]">{profile.companyName}</p>
              )}
              {profile.address && <p className="max-w-md whitespace-pre-line text-xs text-[#475569]">{profile.address}</p>}
              <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#475569]">
                {profile.email && <span>{profile.email}</span>}
                {profile.phone && <span>{profile.phone}</span>}
                {profile.website && <span>{profile.website}</span>}
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">Project Proposal</p>
            <p className="mt-1 break-all font-mono text-sm font-semibold">{proposal.proposalNumber}</p>
            <p className="mt-1 text-xs text-[#475569]">Date: {formatDate(proposal.proposalDate)}</p>
            {proposal.validUntil && <p className="text-xs text-[#475569]">Valid until: {formatDate(proposal.validUntil)}</p>}
          </div>
        </header>

        <section className="grid gap-5 border-b border-[#D5DCE3] pb-5 sm:grid-cols-2">
          <div className="space-y-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Prepared for</h2>
            <p className="font-semibold">{proposal.clientName}</p>
            {proposal.clientCompany && <p className="text-sm text-[#475569]">{proposal.clientCompany}</p>}
            {proposal.clientEmail && <p className="text-sm text-[#475569]">{proposal.clientEmail}</p>}
            {proposal.clientPhone && <p className="text-sm text-[#475569]">{proposal.clientPhone}</p>}
          </div>
          <div className="space-y-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Project</h2>
            <p className="font-semibold">{proposal.projectName}</p>
            {proposal.projectBrief && <p className="whitespace-pre-line text-sm leading-relaxed text-[#475569]">{proposal.projectBrief}</p>}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Selected image offers</h2>
              <p className="text-xs text-[#64748B]">{proposal.items.length} selected {proposal.items.length === 1 ? 'offer' : 'offers'}</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#64748B]" />
                ~{proposal.totalEstimatedHours} hours
              </span>
              <span className="font-bold">{formatINR(proposal.totalEstimatedINR)}</span>
            </div>
          </div>

          <div className="space-y-5">
            {proposal.items.map((item, index) => (
              <article key={`${item.image}-${index}`} className="proposal-offer overflow-hidden rounded-xl border border-[#D5DCE3]">
                <div className="proposal-image relative aspect-[16/10] w-full bg-[#F1F5F9]">
                  <Image
                    src={item.image}
                    alt={item.title || item.catalogTitle}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 900px"
                    className="object-contain"
                  />
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">{item.catalogTitle}</p>
                    {item.title && <h3 className="text-base font-semibold">{item.title}</h3>}
                    {item.description && <p className="whitespace-pre-line text-sm leading-relaxed text-[#475569]">{item.description}</p>}
                  </div>
                  <div className="flex gap-4 text-sm sm:flex-col sm:items-end sm:gap-1">
                    <span className="font-semibold">{item.estimatedPriceINR === null ? 'Price on request' : formatINR(item.estimatedPriceINR)}</span>
                    <span className="text-[#475569]">{item.devHours === null ? 'Time not estimated' : `~${item.devHours} hours`}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ml-auto max-w-md space-y-2 border-t border-[#D5DCE3] pt-4">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-[#475569]">Estimated development time</span>
            <span className="font-semibold">~{proposal.totalEstimatedHours} hours</span>
          </div>
          <div className="flex justify-between gap-4 text-lg">
            <span className="font-semibold">Estimated total</span>
            <span className="font-bold">{formatINR(proposal.totalEstimatedINR)}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#64748B]">
            Totals include entered estimates only. Offers without a price or time estimate are marked individually.
          </p>
        </section>

        {proposal.notes && (
          <section className="space-y-1 border-t border-[#D5DCE3] pt-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Notes and assumptions</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#475569]">{proposal.notes}</p>
          </section>
        )}

        <footer className="border-t border-[#D5DCE3] pt-4 text-[11px] text-[#64748B]">
          Prepared as a project proposal based on the selected image offers. This document is not an invoice.
        </footer>
      </article>
    </div>
  );
}
