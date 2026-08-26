import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { FoodStoreProvider } from '@/lib/store/use-food-store';

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#F7F3EC',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: '%s | DISHCISION — Personal Food Decision Engine',
    default: 'DISHCISION — You Have Food. We Make The Decision.',
  },
  description:
    'A premium personal food decision engine. DISHCISION uses strictly your own pantry library to decide what you cook today—eliminating kitchen decision fatigue without recipe bloat.',
  keywords: [
    'food decision engine',
    'what to cook',
    'dinner decision',
    'meal decider',
    'Kenyan food planner',
    'zero waste food',
    'leftover optimizer',
    'dishcision',
  ],
  authors: [{ name: 'DISHCISION Editorial' }],
  metadataBase: new URL('https://dishcision.app'),
  openGraph: {
    title: 'DISHCISION — Personal Food Decision Engine',
    description: 'You already know the food. We make the decision.',
    type: 'website',
    locale: 'en_US',
    siteName: 'DISHCISION',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DISHCISION — Personal Food Decision Engine',
    description: 'You already know the food. We make the decision.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-warm-ivory text-editorial-black selection:bg-accent-sage selection:text-white">
        <FoodStoreProvider>
          {children}
        </FoodStoreProvider>
      </body>
    </html>
  );
}
