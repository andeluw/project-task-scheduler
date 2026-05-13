'use client';

import * as React from 'react';

import { ButtonLink } from '@/components/button-link';

// !SETUP -> Select !SETUP and CMD + SHIFT + F
// Before you begin editing, follow all comments with `SETUP`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <main>
      <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
        <h1 className='mt-4'>Next.js + Tailwind CSS + TypeScript Starter</h1>
        <p className='mt-4 text-sm text-foreground'>
          A Next.js starter that comes with Tailwind CSS, TypeScript, and a set
          of ready-to-use components, plus common project essentials like SEO
          setup, Tanstack Query, and Zustand.
        </p>

        <ButtonLink className='mt-6' href='/sandbox'>
          View Sandbox
        </ButtonLink>
      </div>
    </main>
  );
}
