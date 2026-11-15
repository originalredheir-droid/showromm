import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as Indian Rupee currency (e.g. ₹1,20,000)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format numbers with tabular commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function isFilenameDerivedScreenTitle(title: string, image: string): boolean {
  const filename = image.split(/[?#]/, 1)[0].split('/').pop() ?? '';
  const generatedTitle = filename.replace(/^[^-]+-/, '').replace(/\.[^.]+$/, '') || 'Screenshot';
  return title === generatedTitle;
}
