'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { computeCpm, isCpmError } from '@/lib/cpm';

import { sampleTasks } from '@/data/sampleTasks';

import { Button } from '@/components/button';
import {
  DependencyGraph,
  DependencyGraphLegend,
} from '@/components/DependencyGraph';
import { Typography } from '@/components/typography';

import { CpmResult } from '@/types/task';

export default function GraphPage() {
  const result = React.useMemo<CpmResult | null>(() => {
    const res = computeCpm(sampleTasks);
    return isCpmError(res) ? null : res;
  }, []);

  return (
    <main className='min-h-screen bg-background'>
      <div className='mx-auto max-w-[1800px] px-6 py-6'>
        <div className='mb-4 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <Link href='/'>
              <Button variant='ghost' size='sm' leftIcon={ArrowLeft}>
                Back to Scheduler
              </Button>
            </Link>
            <Typography as='h1' variant='j2' className='mt-2 text-foreground'>
              Dependency Graph
            </Typography>
            <Typography variant='b3' color='secondary'>
              Critical path highlighted in red · Nodes laid out by topological
              level
            </Typography>
          </div>

          {result && (
            <div className='flex gap-3'>
              <Stat label='Duration' value={`${result.projectDuration}d`} />
              <Stat
                label='Critical'
                value={result.criticalPath.length}
                tone='rose'
              />
              <Stat label='Tasks' value={result.scheduledTasks.length} />
            </div>
          )}
        </div>

        <div className='mb-3'>
          <DependencyGraphLegend />
        </div>

        <DependencyGraph tasks={sampleTasks} result={result} variant='full' />

        {result && (
          <div className='mt-4 rounded-lg border border-rose-200 bg-rose-50/60 px-4 py-3'>
            <Typography variant='s4' className='text-rose-600'>
              Critical Path
            </Typography>
            <Typography variant='h6' className='mt-1 font-mono text-rose-700'>
              {result.criticalPath.join(' → ')}
            </Typography>
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'rose';
}) {
  return (
    <div
      className={[
        'rounded-lg border px-4 py-2 text-center',
        tone === 'rose'
          ? 'border-rose-200 bg-rose-50/60'
          : 'border-border bg-muted/30',
      ].join(' ')}
    >
      <Typography
        variant='h3'
        className={tone === 'rose' ? 'text-rose-600' : 'text-foreground'}
      >
        {value}
      </Typography>
      <Typography variant='c1' color='secondary'>
        {label}
      </Typography>
    </div>
  );
}
