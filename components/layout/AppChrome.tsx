'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return <>{children}</>;

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[280px] pb-16 lg:pb-0 overflow-x-hidden">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
      <MobileNav />
    </>
  );
}
