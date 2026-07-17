import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://todo-app-iota-steel-32.vercel.app'),
  title: {
    default: 'Fresh Sort',
    template: '%s | Fresh Sort',
  },
  description: 'A tiny produce sorting game built with Next.js, Zustand and Motion.',
  applicationName: 'Fresh Sort',
  keywords: ['Next.js', 'React', 'Zustand', 'Motion', 'produce', 'sorting game'],
  openGraph: {
    title: 'Fresh Sort',
    description: 'A tiny produce sorting game built with Next.js, Zustand and Motion.',
    url: '/',
    siteName: 'Fresh Sort',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-ink">{children}</body>
    </html>
  );
}
