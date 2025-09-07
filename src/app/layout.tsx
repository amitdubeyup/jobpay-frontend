import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { generateMetadata, viewport } from '@/lib/metadata';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export { viewport };
export const metadata: Metadata = generateMetadata();

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
