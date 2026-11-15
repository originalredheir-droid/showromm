import { CartItem, Design, PresenterSettings } from '@/types';

const CART_STORAGE_KEY = 'redheir_showroom_cart_v2';
const PRESENTER_STORAGE_KEY = 'redheir_showroom_presenter_v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStoredDesign(value: unknown): value is Design {
  if (!isRecord(value) || !isRecord(value.commercial) || !isRecord(value.technicalSpecs)) return false;
  return typeof value.id === 'string'
    && typeof value.title === 'string'
    && typeof value.visualPreviewImage === 'string'
    && typeof value.shortDescription === 'string'
    && Array.isArray(value.screenPreviews)
    && typeof value.commercial.estimatedBaseINR === 'number'
    && typeof value.technicalSpecs.devHours === 'number';
}

function isScreenPreview(value: unknown): value is CartItem['screen'] {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.title === 'string'
    && typeof value.image === 'string'
    && typeof value.description === 'string'
    && (value.viewport === 'desktop' || value.viewport === 'tablet' || value.viewport === 'mobile')
    && (value.sortOrder === undefined || (typeof value.sortOrder === 'number' && Number.isFinite(value.sortOrder)))
    && (value.estimatedPriceINR === undefined
      || (typeof value.estimatedPriceINR === 'number' && Number.isFinite(value.estimatedPriceINR)))
    && (value.devHours === undefined || (typeof value.devHours === 'number' && Number.isFinite(value.devHours)));
}

function isCartItem(value: unknown): value is CartItem {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.addedAt === 'number'
    && isStoredDesign(value.design)
    && isScreenPreview(value.screen);
}

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!item) return [];
    const parsed: unknown = JSON.parse(item);
    if (!Array.isArray(parsed)) {
      throw new Error('Stored selection cart is not a list.');
    }

    return parsed.flatMap((entry): CartItem[] => {
      if (isCartItem(entry)) return [entry];
      if (!isRecord(entry) || !isStoredDesign(entry.design)) return [];
      const design = entry.design;

      const oldQuantity = 'quantity' in entry
        && typeof entry.quantity === 'number'
        && Number.isFinite(entry.quantity)
        && entry.quantity >= 1
        ? Math.max(1, entry.quantity)
        : 1;
      const screen = design.screenPreviews.find(isScreenPreview) ?? {
        id: 'legacy-selection',
        title: design.title,
        viewport: 'desktop' as const,
        image: design.visualPreviewImage,
        description: '',
      };
      return [{
        id: `legacy:${design.id}`,
        design,
        screen: {
          ...screen,
          id: 'legacy-selection',
          title: `Previous selection: ${design.title}`,
          description: design.shortDescription,
          estimatedPriceINR: (design.commercial?.estimatedBaseINR ?? 0) * oldQuantity,
          devHours: (design.technicalSpecs?.devHours ?? 0) * oldQuantity,
        },
        addedAt: 'addedAt' in entry && typeof entry.addedAt === 'number' ? entry.addedAt : Date.now(),
        legacySelection: true,
      }];
    });
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error);
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
}

export function getStoredPresenterSettings(): PresenterSettings {
  if (typeof window === 'undefined') {
    return { showPricing: true, showInternalDetails: true, pitchMode: false };
  }
  try {
    const item = window.localStorage.getItem(PRESENTER_STORAGE_KEY);
    if (!item) {
      return { showPricing: true, showInternalDetails: true, pitchMode: false };
    }
    return JSON.parse(item);
  } catch (error) {
    console.warn('Failed to load presenter settings:', error);
    return { showPricing: true, showInternalDetails: true, pitchMode: false };
  }
}

export function saveStoredPresenterSettings(settings: PresenterSettings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PRESENTER_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save presenter settings:', error);
  }
}
