import { Typography } from '@/components/typography';

import { CpmResult } from '@/types/task';

interface AlgorithmTraceProps {
  result: CpmResult;
}

export function AlgorithmTrace({ result }: AlgorithmTraceProps) {
  return (
    <div className='rounded-lg border border-primary-200 bg-primary-50/40 p-4'>
      <Typography as='h3' variant='h6' className='mb-3 text-primary-800'>
        Algorithm Trace
      </Typography>
      <ol className='space-y-1'>
        {result.steps.map((step, i) => (
          <li key={i} className='flex gap-2 text-xs'>
            <span className='mt-px shrink-0 font-mono text-primary-400'>
              {String(i + 1).padStart(2, '0')}
            </span>
            <Typography as='span' variant='c1' className='text-slate-700'>
              {step}
            </Typography>
          </li>
        ))}
      </ol>
    </div>
  );
}
