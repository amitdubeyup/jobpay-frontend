import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobPay - Find Your Dream Job',
  description:
    'Discover amazing job opportunities and advance your career with JobPay.',
  keywords: ['jobs', 'careers', 'employment', 'hiring', 'recruitment'],
  authors: [{ name: 'JobPay Team' }],
  creator: 'JobPay',
  publisher: 'JobPay',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  openGraph: {
    title: 'JobPay - Find Your Dream Job',
    description:
      'Discover amazing job opportunities and advance your career with JobPay.',
    url: '/',
    siteName: 'JobPay',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobPay - Find Your Dream Job',
    description:
      'Discover amazing job opportunities and advance your career with JobPay.',
    creator: '@jobpay',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
