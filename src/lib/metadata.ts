import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
};

export function generateMetadata(): Metadata {
  return {
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
    manifest: '/manifest.json',
    icons: {
      icon: '/icons/icon.svg',
      apple: '/icons/icon-192x192.png',
    },
  };
}
