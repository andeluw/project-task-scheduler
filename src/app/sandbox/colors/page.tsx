'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Typography } from '@/components/typography';

import SandboxLayout from '@/app/sandbox/containers/SandboxLayout';

const systemColors = [
  { label: 'background', className: 'bg-background', isDark: false },
  { label: 'foreground', className: 'bg-foreground', isDark: true },
  { label: 'card', className: 'bg-card', isDark: false },
  { label: 'card-foreground', className: 'bg-card-foreground', isDark: true },
  { label: 'popover', className: 'bg-popover', isDark: false },
  {
    label: 'popover-foreground',
    className: 'bg-popover-foreground',
    isDark: true,
  },
  { label: 'primary', className: 'bg-primary', isDark: true },
  {
    label: 'primary-foreground',
    className: 'bg-primary-foreground',
    isDark: false,
  },
  { label: 'secondary', className: 'bg-secondary', isDark: false },
  {
    label: 'secondary-foreground',
    className: 'bg-secondary-foreground',
    isDark: true,
  },
  { label: 'muted', className: 'bg-muted', isDark: false },
  { label: 'muted-foreground', className: 'bg-muted-foreground', isDark: true },
  { label: 'accent', className: 'bg-accent', isDark: false },
  {
    label: 'accent-foreground',
    className: 'bg-accent-foreground',
    isDark: true,
  },
  { label: 'destructive', className: 'bg-destructive', isDark: true },
  {
    label: 'destructive-foreground',
    className: 'bg-destructive-foreground',
    isDark: false,
  },
  { label: 'border', className: 'bg-border', isDark: false },
  { label: 'input', className: 'bg-input', isDark: false },
  { label: 'ring', className: 'bg-ring', isDark: false },
  { label: 'chart-1', className: 'bg-chart-1', isDark: false },
  { label: 'chart-2', className: 'bg-chart-2', isDark: true },
  { label: 'chart-3', className: 'bg-chart-3', isDark: true },
  { label: 'chart-4', className: 'bg-chart-4', isDark: false },
  { label: 'chart-5', className: 'bg-chart-5', isDark: true },
];

export default function ColorsPage() {
  return (
    <SandboxLayout title='Colors Sandbox'>
      <section>
        <Typography as='h2' variant='h2' weight='medium'>
          Primary
        </Typography>
        <div className='mt-2 flex flex-wrap gap-2'>
          <ColorBox className='bg-primary-50 text-typo-black' text='50' />
          <ColorBox className='bg-primary-100 text-typo-black' text='100' />
          <ColorBox className='bg-primary-200 text-typo-black' text='200' />
          <ColorBox className='bg-primary-300 text-typo-black' text='300' />
          <ColorBox className='bg-primary-400 text-typo-black' text='400' />
          <ColorBox className='bg-primary-500 text-typo-black' text='500' />
          <ColorBox className='bg-primary-600 text-typo-black' text='600' />
          <ColorBox className='bg-primary-700 text-typo-black' text='700' />
          <ColorBox className='bg-primary-800 text-typo-black' text='800' />
          <ColorBox className='bg-primary-900 text-typo-black' text='900' />
        </div>
      </section>

      <section className='mt-8'>
        <Typography as='h2' variant='h2' weight='medium'>
          System Colors
        </Typography>
        <div className='mt-2 flex flex-wrap gap-2'>
          {systemColors.map((color) => (
            <ColorBox
              key={color.label}
              className={cn(
                color.className,
                color.isDark ? 'text-white' : 'text-typo-black',
              )}
              text={color.label}
            />
          ))}
        </div>
      </section>
    </SandboxLayout>
  );
}

function ColorBox({ text, className }: { text?: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-24 w-24 flex-col items-center justify-center break-all rounded px-1 text-center text-xs font-medium',
        className,
      )}
    >
      {text}
    </div>
  );
}
