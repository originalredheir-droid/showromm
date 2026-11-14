'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CategoryRow } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { AssetPicker } from './AssetPicker';

interface CategoryFormProps {
  category?: CategoryRow;
}

function toSlug(value: string) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [iconName, setIconName] = useState(category?.icon_name ?? 'Layers');
  const [featuredImage, setFeaturedImage] = useState(category?.featured_image ?? '');
  const [accentBadge, setAccentBadge] = useState(category?.accent_badge ?? '');
  const [tags, setTags] = useState(category?.tags.join(', ') ?? '');
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(category?.is_active ?? true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSaving(true);
    const supabase = createClient();
    const resolvedSlug = toSlug(slug || name);

    const { error } = await supabase.from('categories').upsert({
      ...(category ? { id: category.id } : {}),
      name: name.trim(),
      slug: resolvedSlug,
      description: description.trim(),
      icon_name: iconName.trim() || 'Layers',
      featured_image: featuredImage,
      accent_badge: accentBadge.trim() || null,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      sort_order: Number(sortOrder),
      is_active: isActive,
    });

    setIsSaving(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (category?.featured_image && category.featured_image !== featuredImage && !category.featured_image.startsWith('http')) {
      const { error: cleanupError } = await supabase.storage
        .from('catalog-assets')
        .remove([category.featured_image]);
      if (cleanupError) {
        setErrorMessage(`Saved, but the previous category image could not be removed: ${cleanupError.message}`);
        return;
      }
    }

    router.push('/admin/categories');
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-[#C2C7D0]">Category name *</span>
          <input required value={name} onChange={(event) => setName(event.target.value)} className="admin-input" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-[#C2C7D0]">URL slug *</span>
          <input required value={slug || toSlug(name)} onChange={(event) => setSlug(event.target.value)} placeholder={toSlug(name)} className="admin-input" />
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-[#C2C7D0]">Description</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="admin-input" />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-[#C2C7D0]">Icon name</span>
          <input value={iconName} onChange={(event) => setIconName(event.target.value)} className="admin-input" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-[#C2C7D0]">Accent badge</span>
          <input value={accentBadge} onChange={(event) => setAccentBadge(event.target.value)} className="admin-input" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-[#C2C7D0]">Display order</span>
          <input type="number" min="0" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} className="admin-input" />
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-[#C2C7D0]">Tags (comma-separated)</span>
        <input value={tags} onChange={(event) => setTags(event.target.value)} className="admin-input" />
      </label>
      <AssetPicker
        label="Category image"
        folder="categories"
        value={featuredImage ? [featuredImage] : []}
        onChange={(paths) => setFeaturedImage(paths[0] ?? '')}
      />
      <label className="flex items-center gap-2 text-sm text-[#C2C7D0]">
        <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
        Show this category on the public showroom
      </label>
      {errorMessage && <p role="alert" className="text-sm text-red-400">{errorMessage}</p>}
      <button disabled={isSaving} className="rounded-lg bg-[#B9C9D5] px-4 py-2.5 text-sm font-semibold text-[#10141A] disabled:opacity-60">
        {isSaving ? 'Saving…' : category ? 'Save category' : 'Create category'}
      </button>
    </form>
  );
}
