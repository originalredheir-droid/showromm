'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/designs', label: 'Catalogue' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const signOut = async () => {
    setErrorMessage('');
    const { error } = await createClient().auth.signOut();
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex-1 bg-[#10141A] text-[#DFE2EB]">
      <header className="border-b border-[#31353C] bg-[#181C22]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/admin" className="font-bold tracking-tight">
            REDHEIR <span className="text-[#B9C9D5]">ADMIN</span>
          </Link>
          <nav aria-label="Admin navigation" className="flex items-center gap-2 sm:gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs sm:text-sm ${
                  pathname === link.href ? 'text-[#B9C9D5] font-semibold' : 'text-[#C2C7D0] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={signOut}
              className="text-xs sm:text-sm text-[#C2C7D0] hover:text-white"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      {errorMessage && (
        <p role="alert" className="mx-auto max-w-6xl px-4 pt-4 text-sm text-red-400">
          Could not sign out: {errorMessage}
        </p>
      )}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
