import { Typography, TypographyVariant } from '@/components/typography';

import SandboxLayout from '@/app/sandbox/containers/SandboxLayout';

const typographyMap = [
  { variant: 'j1', size: 'text-4xl', px: '36px', weight: '700' },
  { variant: 'j2', size: 'text-3xl', px: '30px', weight: '700' },
  { variant: 'h1', size: 'text-2xl', px: '24px', weight: '600' },
  { variant: 'h2', size: 'text-xl', px: '20px', weight: '600' },
  { variant: 'h3', size: 'text-lg', px: '18px', weight: '600' },
  { variant: 'h4', size: 'text-base', px: '16px', weight: '700' },
  { variant: 'h5', size: 'text-base', px: '16px', weight: '600' },
  { variant: 'h6', size: 'text-sm', px: '14px', weight: '600' },
  { variant: 's1', size: 'text-lg', px: '18px', weight: '500' },
  { variant: 's2', size: 'text-base', px: '16px', weight: '500' },
  { variant: 's3', size: 'text-sm', px: '14px', weight: '500' },
  { variant: 's4', size: '-', px: '-', weight: '-' },
  { variant: 'b1', size: 'text-lg', px: '18px', weight: '400' },
  { variant: 'b2', size: 'text-base', px: '16px', weight: '400' },
  { variant: 'b3', size: 'text-sm', px: '14px', weight: '400' },
  { variant: 'c1', size: 'text-xs', px: '12px', weight: '400' },
  { variant: 'c2', size: '-', px: '11px', weight: '400' },
];

export default function TypographySandbox() {
  return (
    <SandboxLayout title='Typography Sandbox'>
      <div className='grid grid-cols-5 font-medium text-gray-500 border-b pb-2 mt-12 text-sm'>
        <div>Variant</div>
        <div>Size Class</div>
        <div>Font Size</div>
        <div>Font Weight</div>
        <div>Example</div>
      </div>

      {typographyMap.map(({ variant, size, px, weight }) => (
        <div
          key={variant}
          className='grid grid-cols-5 items-start gap-4 py-4 border-b text-sm'
        >
          <div className='text-gray-600'>{variant}</div>
          <div className='text-gray-600'>{size}</div>
          <div className='text-gray-600'>{px}</div>
          <div className='text-gray-600'>{weight}</div>
          <Typography variant={variant as (typeof TypographyVariant)[number]}>
            Sandbox
          </Typography>
        </div>
      ))}
    </SandboxLayout>
  );
}
