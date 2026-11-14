'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface DeleteCatalogItemButtonProps {
  table: 'categories' | 'designs';
  id: string;
  name: string;
  assetPaths: string[];
}

export function DeleteCatalogItemButton({
  table,
  id,
  name,
  assetPaths,
}: DeleteCatalogItemButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const deleteItem = async () => {
    setErrorMessage('');
    setIsDeleting(true);
    const supabase = createClient();

    if (table === 'categories') {
      const { count, error } = await supabase
        .from('designs')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', id);

      if (error) {
        setErrorMessage(`Could not check category usage: ${error.message}`);
        setIsDeleting(false);
        return;
      }

      if (count) {
        setErrorMessage(
          `This category still has ${count} catalog item${count === 1 ? '' : 's'}. Move or delete those items first, or hide the category instead.`
        );
        setIsDeleting(false);
        return;
      }
    }

    const result = table === 'categories'
      ? await supabase.from('categories').delete().eq('id', id).select('id').maybeSingle()
      : await supabase.from('designs').delete().eq('id', id).select('id').maybeSingle();

    if (result.error) {
      setErrorMessage(`Could not delete ${name}: ${result.error.message}`);
      setIsDeleting(false);
      return;
    }

    if (!result.data) {
      setErrorMessage(`${name} was not deleted. It may already have been removed or you may not have permission.`);
      setIsDeleting(false);
      return;
    }

    const paths = assetPaths.filter((path) => path && !/^https?:\/\//i.test(path));
    if (paths.length) {
      const { error } = await supabase.storage.from('catalog-assets').remove(paths);
      if (error) {
        setErrorMessage(
          `${name} was deleted, but its uploaded images could not be removed: ${error.message}. Refresh the list; the unused images may be removed from Storage later.`
        );
        setIsDeleting(false);
        return;
      }
    }

    router.refresh();
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {!isConfirming ? (
        <button
          type="button"
          onClick={() => {
            setErrorMessage('');
            setIsConfirming(true);
          }}
          className="text-sm text-[#C2C7D0] underline-offset-2 hover:text-white hover:underline"
        >
          Delete
        </button>
      ) : (
        <div className="space-y-2 rounded-lg border border-[#4B515B] bg-[#10141A] p-3 text-right">
          <p className="max-w-xs text-xs text-[#C2C7D0]">
            Permanently delete <span className="font-semibold text-white">{name}</span> and its uploaded images?
            {table === 'categories' && ' Categories with catalog items cannot be deleted.'}
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              disabled={isDeleting}
              className="text-xs text-[#C2C7D0] hover:text-white disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void deleteItem()}
              disabled={isDeleting}
              className="text-xs font-semibold text-[#DFE2EB] underline underline-offset-2 hover:text-white disabled:opacity-60"
            >
              {isDeleting ? 'Deleting…' : 'Confirm delete'}
            </button>
          </div>
        </div>
      )}
      {errorMessage && (
        <p role="alert" className="max-w-sm text-right text-xs text-amber-300">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
