import type { Metadata } from 'next';
import * as React from 'react';

import '@/styles/globals.css';
// !SETUP This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import Providers from '@/app/providers';
import { seoConfig } from '@/config/seo';

export const metadata: Metadata = seoConfig({
  title: 'Next.js Starter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='bg-white dark:bg-[#020817]' suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
