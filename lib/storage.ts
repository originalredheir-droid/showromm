import { CartItem, PresenterSettings } from '@/types';

const CART_STORAGE_KEY = 'redheir_showroom_cart_v2';
const PRESENTER_STORAGE_KEY = 'redheir_showroom_presenter_v1';

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = window.localStorage.getItem(CART_STORAGE_KEY);
    return item ? JSON.parse(item) : [];
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
