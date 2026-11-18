'use client';

import { FormEvent, useState } from 'react';
import type { Database } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

type StorageUsage = Database['public']['Functions']['get_catalog_storage_usage']['Returns'][number];

const BYTES_PER_GB = 1_000_000_000;

function formatBytes(bytes: number) {
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  if (bytes < BYTES_PER_GB) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / BYTES_PER_GB).toFixed(2)} GB`;
}

export function StorageUsagePanel({ initialUsage }: { initialUsage: StorageUsage }) {
  const [usage, setUsage] = useState(initialUsage);
  const [quotaGB, setQuotaGB] = useState(
    initialUsage.quota_bytes === null ? '' : (initialUsage.quota_bytes / BYTES_PER_GB).toString()
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const publishedCatalogs = Number(usage.published_catalog_count);
  const averageCatalogBytes = publishedCatalogs
    ? Number(usage.referenced_catalog_bytes) / publishedCatalogs
    : 0;
  const averageImagesPerCatalog = publishedCatalogs
    ? Number(usage.referenced_catalog_objects) / publishedCatalogs
    : 0;
  const remainingBytes = usage.quota_bytes === null
    ? null
    : Math.max(0, Number(usage.quota_bytes) - Number(usage.total_storage_bytes));
  const remainingCatalogs = remainingBytes !== null && averageCatalogBytes > 0
    ? Math.floor(remainingBytes / averageCatalogBytes)
    : null;
  const usagePercent = usage.quota_bytes
    ? Math.min(100, (Number(usage.total_storage_bytes) / Number(usage.quota_bytes)) * 100)
    : null;

  const saveQuota = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSaved(false);
    setIsSaving(true);

    const parsedGB = Number(quotaGB);
    if (!Number.isFinite(parsedGB) || parsedGB <= 0) {
      setErrorMessage('Enter the storage quota for your Supabase plan in GB.');
      setIsSaving(false);
      return;
    }

    const quotaBytes = Math.round(parsedGB * BYTES_PER_GB);
    const { error } = await createClient().rpc('set_catalog_storage_quota', {
      p_quota_bytes: quotaBytes,
    });
    if (error) {
      setErrorMessage(error.message);
    } else {
      setUsage((current) => ({ ...current, quota_bytes: quotaBytes }));
      setSaved(true);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2">
        <Metric label="All uploaded file storage" value={formatBytes(Number(usage.total_storage_bytes))} detail={`${usage.total_storage_objects} objects across buckets`} />
        <Metric label="Catalog assets bucket" value={formatBytes(Number(usage.catalog_asset_bytes))} detail={`${usage.catalog_asset_objects} objects`} />
        <Metric label="Images used by published catalogs" value={formatBytes(Number(usage.referenced_catalog_bytes))} detail={`${usage.referenced_catalog_objects} unique images`} />
        <Metric label="Published catalogs" value={String(publishedCatalogs)} detail={averageImagesPerCatalog ? `About ${averageImagesPerCatalog.toFixed(1)} images per catalog` : 'No published catalog images yet'} />
      </section>

      <section className="space-y-4 rounded-xl border border-[#31353C] bg-[#181C22] p-4 sm:p-5">
        <div>
          <h2 className="font-semibold">Catalog capacity estimate</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#8B9199]">
            Set the storage quota shown for your Supabase plan. The estimate uses current total storage and the average bytes per published catalog; it is approximate.
          </p>
        </div>
        <form onSubmit={saveQuota} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 space-y-1.5">
            <span className="text-xs font-medium text-[#C2C7D0]">Supabase storage quota (GB)</span>
            <input
              type="number"
              min="0.001"
              step="any"
              required
              value={quotaGB}
              onChange={(event) => setQuotaGB(event.target.value)}
              className="admin-input min-h-11"
              placeholder="Enter plan quota"
            />
          </label>
          <button disabled={isSaving} className="min-h-11 rounded-lg bg-[#B9C9D5] px-5 py-2.5 text-sm font-semibold text-[#10141A] disabled:opacity-60">
            {isSaving ? 'Saving…' : 'Save quota'}
          </button>
        </form>

        {errorMessage && <p role="alert" className="text-sm text-red-400">{errorMessage}</p>}
        {saved && <p role="status" className="text-sm text-emerald-400">Storage quota saved.</p>}

        {usage.quota_bytes === null ? (
          <p className="rounded-lg border border-dashed border-[#4B515B] p-4 text-sm text-[#C2C7D0]">
            Enter your plan quota to see remaining storage and estimated catalog capacity.
          </p>
        ) : (
          <div className="space-y-2 rounded-lg border border-[#31353C] bg-[#10141A] p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm text-[#C2C7D0]">Estimated storage remaining</span>
              <span className="text-lg font-bold text-[#DFE2EB]">{formatBytes(remainingBytes ?? 0)} of {formatBytes(Number(usage.quota_bytes))}</span>
            </div>
            <div
              role="progressbar"
              aria-label="Supabase storage used"
              aria-valuenow={Math.round(usagePercent ?? 0)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 overflow-hidden rounded-full bg-[#31353C]"
            >
              <div className="h-full rounded-full bg-[#B9C9D5]" style={{ width: `${usagePercent ?? 0}%` }} />
            </div>
            <p className="text-xs text-[#8B9199]">
              {remainingCatalogs === null
                ? 'Add published catalogs with images to establish an average size.'
                : `At the current average (${formatBytes(averageCatalogBytes)} per catalog), approximately ${remainingCatalogs} more catalog${remainingCatalogs === 1 ? '' : 's'} may fit.`}
            </p>
            {publishedCatalogs < 3 && (
              <p className="text-xs text-amber-300">
                Preliminary estimate: it is based on only {publishedCatalogs} published catalog{publishedCatalogs === 1 ? '' : 's'}.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-[#31353C] bg-[#181C22] p-4">
      <p className="text-xs text-[#8B9199]">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-[#DFE2EB]">{value}</p>
      <p className="mt-1 text-xs text-[#C2C7D0]">{detail}</p>
    </div>
  );
}
