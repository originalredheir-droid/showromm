'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'catalog-assets';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

interface AssetPickerProps {
  label: string;
  folder: string;
  value: string[];
  multiple?: boolean;
  onChange: (paths: string[]) => void;
}

export function AssetPicker({
  label,
  folder,
  value,
  multiple = false,
  onChange,
}: AssetPickerProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setErrorMessage('');
    setIsUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (!ACCEPTED_TYPES.has(file.type)) {
          throw new Error(`${file.name}: use JPG, PNG, WebP, or AVIF.`);
        }
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`${file.name}: image must be 10 MB or smaller.`);
        }

        const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
        const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
        });
        if (error) throw error;
        uploaded.push(path);
      }

      onChange(multiple ? [...value, ...uploaded] : uploaded.slice(-1));
    } catch (error) {
      const cleanup = uploaded.length
        ? await supabase.storage.from(BUCKET).remove(uploaded)
        : { error: null };
      const message = error instanceof Error ? error.message : 'Image upload failed.';
      setErrorMessage(
        cleanup.error
          ? `${message} Some uploaded files could not be cleaned up: ${cleanup.error.message}`
          : message
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeAsset = (path: string) => {
    onChange(value.filter((current) => current !== path));
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium text-[#C2C7D0]">{label}</legend>
      <div className="flex flex-wrap gap-3">
        {value.map((path) => {
          const imageUrl = createClient().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
          return (
            <div key={path} className="relative h-28 w-40 overflow-hidden rounded border border-[#31353C] bg-[#10141A]">
              <Image src={imageUrl} alt="" fill sizes="160px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeAsset(path)}
                className="absolute right-1 top-1 rounded bg-black/80 px-2 py-1 text-[10px] text-white"
                aria-label={`Remove ${label}`}
              >
                Remove
              </button>
            </div>
          );
        })}
        <label className="flex h-28 w-40 cursor-pointer items-center justify-center rounded border border-dashed border-[#4B515B] bg-[#10141A] px-3 text-center text-xs text-[#C2C7D0] hover:border-[#FF535B]">
          {isUploading ? 'Uploading…' : multiple ? 'Add image(s)' : 'Choose image'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple={multiple}
            disabled={isUploading}
            onChange={(event) => {
              void uploadFiles(event.currentTarget.files);
              event.currentTarget.value = '';
            }}
            className="sr-only"
          />
        </label>
      </div>
      {errorMessage && (
        <p role="alert" className="text-xs text-red-400">
          {errorMessage}
        </p>
      )}
      <p className="text-[11px] text-[#8B9199]">JPG, PNG, WebP, or AVIF; maximum 10 MB per image.</p>
    </fieldset>
  );
}
