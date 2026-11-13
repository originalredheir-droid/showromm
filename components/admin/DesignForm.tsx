'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CategoryRow, DesignRow } from '@/types/database';
import type { ScreenPreview } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { AssetPicker } from './AssetPicker';

interface DesignFormProps {
  categories: CategoryRow[];
  design?: DesignRow;
}

const TYPE_LABELS = {
  concept: 'Complete Concept',
  module: 'Functional Module',
  page: 'Individual Page',
  section: 'UI Section & Screen',
} as const;

function toSlug(value: string) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getRemovedPaths(previous: string[], next: string[]) {
  const retained = new Set(next);
  return [...new Set(previous.filter((path) => path && !path.startsWith('http') && !retained.has(path)))];
}

export function DesignForm({ categories, design }: DesignFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(design?.title ?? '');
  const [slug, setSlug] = useState(design?.slug ?? '');
  const [categoryId, setCategoryId] = useState(design?.category_id ?? categories[0]?.id ?? '');
  const [conceptType, setConceptType] = useState<DesignRow['concept_type']>(design?.concept_type ?? 'concept');
  const [shortDescription, setShortDescription] = useState(design?.short_description ?? '');
  const [fullDescription, setFullDescription] = useState(design?.full_description ?? '');
  const [coverImage, setCoverImage] = useState(design?.visual_preview_image ?? '');
  const [screens, setScreens] = useState<ScreenPreview[]>(design?.screen_previews ?? []);
  const [tags, setTags] = useState(design?.tags.join(', ') ?? '');
  const [price, setPrice] = useState(design?.commercial.estimatedBaseINR ?? 0);
  const [featured, setFeatured] = useState(design?.featured ?? false);
  const [status, setStatus] = useState<DesignRow['status']>(design?.status ?? 'draft');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setNotice('');

    if (!categoryId) {
      setErrorMessage('Create a category before adding a catalog item.');
      return;
    }
    if (status === 'published' && (!shortDescription.trim() || !coverImage)) {
      setErrorMessage('Published items need a short description and a cover image.');
      return;
    }
    if (status === 'published' && !categories.find((category) => category.id === categoryId)?.is_active) {
      setErrorMessage('Activate this item’s category before publishing it.');
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    const oldPaths = design
      ? [design.visual_preview_image, ...design.screen_previews.map((screen) => screen.image)]
      : [];
    const newPaths = [coverImage, ...screens.map((screen) => screen.image)];
    const { error } = await supabase.from('designs').upsert({
      ...(design ? { id: design.id } : {}),
      slug: toSlug(slug || title),
      title: title.trim(),
      category_id: categoryId,
      concept_type: conceptType,
      concept_type_label: TYPE_LABELS[conceptType],
      short_description: shortDescription.trim(),
      full_description: fullDescription.trim(),
      visual_preview_image: coverImage,
      screen_previews: screens,
      features: design?.features ?? [],
      technical_specs: design?.technical_specs ?? {
        devHours: 0,
        techStack: [],
        responsiveBreakpoints: [],
        deliverables: [],
      },
      commercial: {
        ...(design?.commercial ?? { estimatedBaseINR: 0, licenseType: 'Custom', warrantyDays: 0 }),
        estimatedBaseINR: Number(price),
      },
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      featured,
      popular: design?.popular ?? false,
      new_addition: design?.new_addition ?? false,
      functional_notice: design?.functional_notice ?? '',
      related_ids: design?.related_ids ?? [],
      status,
      sort_order: design?.sort_order ?? 0,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSaving(false);
      return;
    }

    const removedPaths = getRemovedPaths(oldPaths, newPaths);
    let cleanupMessage = '';
    if (removedPaths.length) {
      const { error: cleanupError } = await supabase.storage.from('catalog-assets').remove(removedPaths);
      if (cleanupError) {
        cleanupMessage = `Saved. Some replaced images could not be removed from storage: ${cleanupError.message}`;
      }
    }

    setIsSaving(false);
    if (cleanupMessage) {
      setNotice(cleanupMessage);
    } else {
      router.push('/admin/designs');
      router.refresh();
    }
  };

  const updateScreenPaths = (paths: string[]) => {
    const existing = new Map(screens.map((screen) => [screen.image, screen]));
    setScreens(paths.map((path) => existing.get(path) ?? {
      id: crypto.randomUUID(),
      title: path.split('/').pop()?.replace(/^[^-]+-/, '').replace(/\.[^.]+$/, '') ?? 'Screenshot',
      viewport: 'desktop',
      image: path,
      description: '',
    }));
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <section className="space-y-4 rounded-xl border border-[#31353C] bg-[#181C22] p-5">
        <h2 className="font-semibold">Catalog details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-[#C2C7D0]">Title *</span>
            <input required value={title} onChange={(event) => setTitle(event.target.value)} className="admin-input" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-[#C2C7D0]">URL slug *</span>
            <input required value={slug || toSlug(title)} onChange={(event) => setSlug(event.target.value)} placeholder={toSlug(title)} className="admin-input" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-[#C2C7D0]">Category *</span>
            <select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="admin-input">
              <option value="" disabled>Select a category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-[#C2C7D0]">Catalog type</span>
            <select value={conceptType} onChange={(event) => setConceptType(event.target.value as DesignRow['concept_type'])} className="admin-input">
              {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-[#C2C7D0]">Short description *</span>
          <textarea required value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} rows={2} className="admin-input" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-[#C2C7D0]">Full description</span>
          <textarea value={fullDescription} onChange={(event) => setFullDescription(event.target.value)} rows={5} className="admin-input" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-[#C2C7D0]">Tags (comma-separated)</span>
          <input value={tags} onChange={(event) => setTags(event.target.value)} className="admin-input" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-[#C2C7D0]">Estimated base price (INR)</span>
            <input type="number" min="0" step="1" value={price} onChange={(event) => setPrice(Number(event.target.value))} className="admin-input" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-[#C2C7D0]">Visibility</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as DesignRow['status'])} className="admin-input">
              <option value="draft">Draft (not public)</option>
              <option value="published">Published</option>
              <option value="archived">Archived (not public)</option>
            </select>
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-[#C2C7D0]">
          <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
          Feature this item on the showroom home page
        </label>
      </section>

      <section className="space-y-5 rounded-xl border border-[#31353C] bg-[#181C22] p-5">
        <h2 className="font-semibold">Images</h2>
        <AssetPicker
          label="Cover image"
          folder={`designs/${design?.id ?? 'new'}`}
          value={coverImage ? [coverImage] : []}
          onChange={(paths) => setCoverImage(paths[0] ?? '')}
        />
        <AssetPicker
          label="Screenshots"
          folder={`designs/${design?.id ?? 'new'}/screens`}
          value={screens.map((screen) => screen.image)}
          multiple
          onChange={updateScreenPaths}
        />
        {screens.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {screens.map((screen) => (
              <div key={screen.id} className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs text-[#C2C7D0]">Screenshot label</span>
                  <input
                    value={screen.title}
                    onChange={(event) => setScreens((current) => current.map((item) =>
                      item.id === screen.id ? { ...item, title: event.target.value } : item
                    ))}
                    className="admin-input"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs text-[#C2C7D0]">Viewport</span>
                  <select
                    value={screen.viewport}
                    onChange={(event) => setScreens((current) => current.map((item) =>
                      item.id === screen.id
                        ? { ...item, viewport: event.target.value as ScreenPreview['viewport'] }
                        : item
                    ))}
                    className="admin-input"
                  >
                    <option value="desktop">Desktop</option>
                    <option value="tablet">Tablet</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
        )}
      </section>

      {errorMessage && <p role="alert" className="text-sm text-red-400">{errorMessage}</p>}
      {notice && <p role="status" className="text-sm text-amber-300">{notice}</p>}
      <button disabled={isSaving} className="rounded-lg bg-[#FF535B] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {isSaving ? 'Saving…' : design ? 'Save catalog item' : 'Create catalog item'}
      </button>
    </form>
  );
}
