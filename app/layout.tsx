import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { PresenterProvider } from '@/context/PresenterContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'REDHEIR SHOWROOM — Executive Digital Studio Showcase',
  description: 'Internal digital showroom used by REDHEIR to present website design concepts, explore individual screens, and curate client project scopes.',
  openGraph: {
    title: 'REDHEIR SHOWROOM — Executive Digital Studio Showcase',
    description: 'Internal digital showroom for website design concepts and modular web applications.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REDHEIR SHOWROOM',
    description: 'Internal digital showroom for website design concepts and modular web applications.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} bg-[#10141A] text-[#DFE2EB] antialiased min-h-screen flex font-sans`}
        suppressHydrationWarning
      >
        <PresenterProvider>
          <CartProvider>
            {/* Desktop Persistent Sidebar */}
            <Sidebar />

            {/* Main Application Viewport */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-[280px] pb-16 lg:pb-0 overflow-x-hidden">
              <Header />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
                {children}
              </main>
            </div>

            {/* Mobile & Tablet Bottom Navigation */}
            <MobileNav />
          </CartProvider>
        </PresenterProvider>
      </body>
    </html>
  );
}
