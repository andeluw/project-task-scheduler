'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Network } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { computeCpm, isCpmError } from '@/lib/cpm';

import { sampleTasks } from '@/data/sampleTasks';

import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { GanttChart } from '@/components/GanttChart';
import { Table } from '@/components/table/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { TaskTable } from '@/components/TaskTable';
import { Typography } from '@/components/typography';

import { CpmResult, ScheduledTask, Task } from '@/types/task';

function ResultSummary({ result }: { result: CpmResult }) {
  const edgeCount = result.scheduledTasks.reduce(
    (sum, t) => sum + t.dependencies.length,
    0,
  );

  const stats = [
    { label: 'Project Duration', value: `${result.projectDuration} days` },
    { label: 'Tasks (V)', value: result.scheduledTasks.length },
    { label: 'Dependencies (E)', value: edgeCount },
    {
      label: 'Critical Tasks',
      value: result.criticalPath.length,
      highlight: true,
    },
  ];

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {stats.map((s) => (
        <div
          key={s.label}
          className={[
            'rounded-lg border p-3 text-center',
            s.highlight
              ? 'border-rose-200 bg-rose-50/60'
              : 'border-border bg-muted/30',
          ].join(' ')}
        >
          <Typography
            variant='h1'
            className={s.highlight ? 'text-rose-600' : 'text-foreground'}
          >
            {s.value}
          </Typography>
          <Typography variant='c1' color='secondary' className='mt-0.5'>
            {s.label}
          </Typography>
        </div>
      ))}

      <div className='col-span-2 rounded-lg border border-border bg-muted/30 p-3 sm:col-span-4'>
        <Typography variant='s4' color='secondary' className='mb-1'>
          Topological Order
        </Typography>
        <Typography variant='b3' className='font-mono'>
          {result.topologicalOrder.join(' → ')}
        </Typography>
      </div>

      <div className='col-span-2 rounded-lg border border-rose-200 bg-rose-50/60 p-3 sm:col-span-4'>
        <Typography variant='s4' className='mb-1 text-rose-500'>
          Critical Path (float = 0)
        </Typography>
        <Typography variant='h6' className='font-mono text-rose-700'>
          {result.criticalPath.join(' → ')}
        </Typography>
      </div>
    </div>
  );
}

const scheduledColumns: ColumnDef<ScheduledTask>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ row }) => (
      <span className='font-mono font-bold'>{row.original.id}</span>
    ),
  },
  {
    header: 'Task Name',
    accessorKey: 'name',
  },
  {
    header: 'Dur.',
    accessorKey: 'duration',
    cell: ({ row }) => (
      <span className='font-mono'>{row.original.duration}</span>
    ),
  },
  {
    header: 'ES',
    accessorKey: 'earliestStart',
    cell: ({ row }) => (
      <span className='font-mono'>{row.original.earliestStart}</span>
    ),
  },
  {
    header: 'EF',
    accessorKey: 'earliestFinish',
    cell: ({ row }) => (
      <span className='font-mono'>{row.original.earliestFinish}</span>
    ),
  },
  {
    header: 'LS',
    accessorKey: 'latestStart',
    cell: ({ row }) => (
      <span className='font-mono'>{row.original.latestStart}</span>
    ),
  },
  {
    header: 'LF',
    accessorKey: 'latestFinish',
    cell: ({ row }) => (
      <span className='font-mono'>{row.original.latestFinish}</span>
    ),
  },
  {
    header: 'Float',
    accessorKey: 'float',
    cell: ({ row }) => (
      <span
        className={[
          'rounded px-1.5 py-0.5 font-mono text-xs font-semibold',
          row.original.float === 0
            ? 'bg-rose-100 text-rose-700'
            : 'bg-slate-100 text-slate-600',
        ].join(' ')}
      >
        {row.original.float}
      </span>
    ),
  },
  {
    header: 'Critical',
    accessorKey: 'isCritical',
    cell: ({ row }) =>
      row.original.isCritical ? (
        <span className='inline-block rounded-full border border-rose-200 bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700'>
          YES
        </span>
      ) : (
        <span className='text-xs text-muted-foreground'>—</span>
      ),
  },
];

function AlgorithmTrace({ result }: { result: CpmResult }) {
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

export default function HomePage() {
  const [tasks, setTasks] = React.useState<Task[]>(() =>
    sampleTasks.map((t) => ({ ...t })),
  );
  const [result, setResult] = React.useState<CpmResult | null>(() => {
    const res = computeCpm(sampleTasks);
    return isCpmError(res) ? null : res;
  });
  const [error, setError] = React.useState<string | null>(null);

  function handleCalculate(nextTasks = tasks) {
    setError(null);
    setTasks(nextTasks);
    const res = computeCpm(nextTasks);
    if (isCpmError(res)) {
      setError(res.message);
      setResult(null);
    } else {
      setResult(res);
    }
  }

  function handleReset() {
    setTasks(sampleTasks.map((t) => ({ ...t })));
    const res = computeCpm(sampleTasks);
    setResult(isCpmError(res) ? null : res);
    setError(null);
  }

  return (
    <main className='min-h-screen bg-background'>
      <div className='dashboard-layout py-8'>
        <div className='mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4'>
          <div>
            <Typography as='h1' variant='j2' className='text-foreground'>
              Project Task Scheduler
            </Typography>
            <Typography as='h2' variant='h4' className='mt-1 text-primary-700'>
              Critical Path Method on a DAG · Kahn&apos;s Topological Sort
            </Typography>
          </div>
          <Link href='/graph'>
            <Button leftIcon={Network} size='sm'>
              Open Graph View
            </Button>
          </Link>
        </div>

        <Tabs defaultValue='scheduler'>
          <TabsList className='mb-4 flex h-auto flex-wrap gap-1 bg-transparent p-0'>
            {[
              { value: 'scheduler', label: 'Scheduler' },
              { value: 'gantt', label: 'Gantt Chart' },
              { value: 'algorithm', label: 'Algorithm Trace' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='rounded-md border border-border px-4 py-1.5 text-sm data-[state=active]:border-primary-500 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700'
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='scheduler' className='space-y-6'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle>Task List</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskTable
                  tasks={tasks}
                  onChange={setTasks}
                  onCalculate={handleCalculate}
                  onReset={handleReset}
                  error={error}
                />
              </CardContent>
            </Card>

            {result && (
              <>
                <Card>
                  <CardHeader className='pb-3'>
                    <CardTitle>Result Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultSummary result={result} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='pb-3'>
                    <CardTitle>Scheduled Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table
                      data={result.scheduledTasks}
                      columns={scheduledColumns}
                      omitSort
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value='gantt' className='space-y-6'>
            {result ? (
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle>Gantt Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <GanttChart result={result} />
                </CardContent>
              </Card>
            ) : (
              <Typography variant='b3' color='secondary'>
                Calculate the schedule to view the Gantt chart.
              </Typography>
            )}
          </TabsContent>

          <TabsContent value='algorithm'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle>Algorithm Trace</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <AlgorithmTrace result={result} />
                ) : (
                  <Typography variant='b3' color='secondary'>
                    Calculate the schedule to view the algorithm trace.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
