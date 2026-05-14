'use client';

import { ArrowLeft, CalendarDays, CheckSquare, Crosshair } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { sampleTasks } from '@/data/sampleTasks';

import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Typography } from '@/components/typography';

import { computeCpm, isCpmError } from '@/algorithms/cpm';
import {
  DependencyGraph,
  DependencyGraphLegend,
} from '@/app/graph/components/DependencyGraph';

import { CpmResult } from '@/types/task';

export default function GraphPage() {
  const result = React.useMemo<CpmResult | null>(() => {
    const res = computeCpm(sampleTasks);
    return isCpmError(res) ? null : res;
  }, []);

  return (
    <main className='min-h-screen bg-background'>
      <div className='dashboard-layout py-8'>
        <div className='mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4'>
          <div>
            <Link href='/'>
              <Button variant='ghost' size='sm' leftIcon={ArrowLeft}>
                Back to Scheduler
              </Button>
            </Link>
            <Typography as='h1' variant='j2' className='mt-2 text-foreground'>
              Dependency Graph
            </Typography>
            <Typography as='h2' variant='h4' className='mt-1 text-primary-700'>
              Critical path highlighted in red · Nodes laid out by topological
              level
            </Typography>
          </div>

          {result && (
            <div className='grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-3'>
              <Stat
                icon={CalendarDays}
                label='Duration'
                value={`${result.projectDuration}d`}
              />
              <Stat
                icon={Crosshair}
                label='Critical'
                value={result.criticalPath.length}
              />
              <Stat
                icon={CheckSquare}
                label='Tasks'
                value={result.scheduledTasks.length}
              />
            </div>
          )}
        </div>

        <div className='mb-4'>
          <DependencyGraphLegend />
        </div>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle>Task Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <DependencyGraph
              tasks={sampleTasks}
              result={result}
              variant='full'
            />
          </CardContent>
        </Card>

        <Card className='mt-5'>
          <CardHeader className='pb-2'>
            <CardTitle>How to read this graph</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant='b3' color='secondary'>
              Tasks flow from left to right by topological level. The red path
              represents the critical path (zero slack).
            </Typography>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className='min-w-0 shadow-none'>
      <CardContent className='flex items-center gap-3 p-3'>
        <Icon className='h-5 w-5 shrink-0 text-primary-700' />
        <div className='min-w-0'>
          <Typography variant='h3' className='break-words text-foreground'>
            {value}
          </Typography>
          <Typography variant='c1' color='secondary' className='break-words'>
            {label}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
