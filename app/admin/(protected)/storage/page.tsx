import { StorageUsagePanel } from '@/components/admin/StorageUsagePanel';
import { StorageSetupNotice } from '@/components/admin/StorageSetupNotice';
import { createClient } from '@/lib/supabase/server';

export default async function AdminStoragePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_catalog_storage_usage');
  if (error) {
    if (
      error.code === 'PGRST202'
      || error.code === '42883'
      || /could not find the function .* in the schema cache/i.test(error.message)
    ) {
      return <StorageSetupNotice />;
    }
    throw error;
  }

  const usage = data[0];
  if (!usage) throw new Error('Storage usage report returned no data.');

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
