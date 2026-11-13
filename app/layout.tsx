import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { PresenterProvider } from '@/context/PresenterContext';
import { AppChrome } from '@/components/layout/AppChrome';

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
            <AppChrome>{children}</AppChrome>
          </CartProvider>
        </PresenterProvider>
      </body>
    </html>
  );
}
