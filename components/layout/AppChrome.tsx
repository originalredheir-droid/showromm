'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { PanelLeftOpen } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  if (pathname.startsWith('/admin')) return <>{children}</>;

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onCollapse={() => setSidebarOpen(false)} />
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Show sidebar"
          title="Show sidebar"
          className="fixed left-0 top-1/2 z-50 hidden -translate-y-1/2 rounded-r-lg border border-l-0 border-[#31353C] bg-[#181C22] p-2 text-[#DFE2EB] shadow-lg transition-colors hover:bg-[#262A31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B9C9D5] lg:flex"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      )}
      <div className={`flex-1 flex flex-col min-h-screen pb-16 lg:pb-0 overflow-x-hidden transition-[margin] duration-300 ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'}`}>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
      <MobileNav />
    </>
  );
}
