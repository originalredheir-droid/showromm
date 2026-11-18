import { StorageUsagePanel } from '@/components/admin/StorageUsagePanel';
import { StorageSetupNotice } from '@/components/admin/StorageSetupNotice';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type StorageUsage = Database['public']['Functions']['get_catalog_storage_usage']['Returns'][number];

async function loadStorageUsage(): Promise<{ usage: StorageUsage | null; error?: unknown }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_catalog_storage_usage');
    return error
      ? { usage: null, error }
      : { usage: data?.[0] ?? null };
  } catch (error) {
    return { usage: null, error };
  }
}

function getErrorCode(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
    ? error.code
    : undefined;
}

function isMissingStorageReport(error: unknown) {
  const code = getErrorCode(error);
  const message = typeof error === 'object' && error !== null && 'message' in error
    ? String(error.message)
    : '';

  return code === 'PGRST202'
    || code === '42883'
    || /could not find the function .* in the schema cache/i.test(message);
}

export default async function AdminStoragePage() {
  const reference = crypto.randomUUID();
  const { usage, error } = await loadStorageUsage();

  if (error) {
    const code = getErrorCode(error);
    console.error('Storage metrics request failed', { reference, code });
    if (isMissingStorageReport(error) || code === '42P01' || code === 'PGRST205') {
      return <StorageSetupNotice reason="migration" reference={reference} />;
    }
    if (code === '42501') {
      return <StorageSetupNotice reason="permissions" reference={reference} />;
    }
    return <StorageSetupNotice reason="unavailable" reference={reference} />;
  }

  if (!usage) {
    console.error('Storage metrics RPC returned no rows', { reference });
    return <StorageSetupNotice reason="unavailable" reference={reference} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Storage usage</h1>
        <p className="mt-1 text-sm text-[#C2C7D0]">
          Review Supabase file storage usage and estimate catalog capacity from the images currently in use.
        </p>
        <p className="mt-2 text-xs text-[#8B9199]">
          This is uploaded file storage, not the separate PostgreSQL database disk usage shown under Supabase Infrastructure.
        </p>
      </div>
      <StorageUsagePanel initialUsage={usage} />
    </div>
  );
}
