'use client';

import { Card, CardContent } from '@/components/card';
import { Typography } from '@/components/typography';

import { CpmResult, ScheduledTask, Task } from '@/types/task';

const NODE_W = 250;
const NODE_H = 130;
const COL_GAP = 100;
const ROW_GAP = 44;
const PAD_X = 32;
const PAD_TOP = 58;
const PAD_BOTTOM = 32;
const LEVEL_LABEL_Y = 22;

function buildAdjList(tasks: Task[]): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const t of tasks) adj.set(t.id, []);
  for (const t of tasks) {
    for (const dep of t.dependencies) {
      adj.get(dep)?.push(t.id);
    }
  }
  return adj;
}

function topoSort(tasks: Task[], adj: Map<string, string[]>): string[] {
  const inDeg = new Map<string, number>(tasks.map((t) => [t.id, 0]));
  for (const t of tasks) {
    for (const _dep of t.dependencies) {
      inDeg.set(t.id, (inDeg.get(t.id) ?? 0) + 1);
    }
  }
  const queue = tasks.map((t) => t.id).filter((id) => inDeg.get(id) === 0);
  const order: string[] = [];
  while (queue.length) {
    const cur = queue.shift()!;
    order.push(cur);
    for (const nb of adj.get(cur) ?? []) {
      const d = (inDeg.get(nb) ?? 0) - 1;
      inDeg.set(nb, d);
      if (d === 0) queue.push(nb);
    }
  }
  for (const t of tasks) {
    if (!order.includes(t.id)) order.push(t.id);
  }
  return order;
}

function computeLevels(tasks: Task[], topo: string[]): Map<string, number> {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const levels = new Map<string, number>();

  for (const id of topo) {
    const task = taskMap.get(id)!;
    if (!task || task.dependencies.length === 0) {
      levels.set(id, 0);
    } else {
      const maxPred = Math.max(
        ...task.dependencies.map((d) => levels.get(d) ?? 0),
      );
      levels.set(id, maxPred + 1);
    }
  }
  return levels;
}

interface NodePos {
  cx: number;
  cy: number;
}

function computePositions(
  tasks: Task[],
  levels: Map<string, number>,
): {
  maxLevel: number;
  positions: Map<string, NodePos>;
  svgW: number;
  svgH: number;
} {
  const byLevel = new Map<number, string[]>();
  for (const t of tasks) {
    const lv = levels.get(t.id) ?? 0;
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv)!.push(t.id);
  }

  const maxLevel = Math.max(...Array.from(byLevel.keys()));
  const maxRows = Math.max(
    ...Array.from(byLevel.values()).map((v) => v.length),
  );
  const totalH = maxRows * NODE_H + (maxRows - 1) * ROW_GAP;

  const positions = new Map<string, NodePos>();

  for (const [lv, ids] of byLevel) {
    const colH = ids.length * NODE_H + (ids.length - 1) * ROW_GAP;
    const startY = PAD_TOP + (totalH - colH) / 2;
    const cx = PAD_X + lv * (NODE_W + COL_GAP) + NODE_W / 2;

    ids.forEach((id, i) => {
      const cy = startY + i * (NODE_H + ROW_GAP) + NODE_H / 2;
      positions.set(id, { cx, cy });
    });
  }

  const svgW = PAD_X * 2 + (maxLevel + 1) * NODE_W + maxLevel * COL_GAP;
  const svgH = PAD_TOP + totalH + PAD_BOTTOM;

  return { maxLevel, positions, svgW, svgH };
}

function edgePath(src: NodePos, tgt: NodePos): string {
  const x1 = src.cx + NODE_W / 2;
  const y1 = src.cy;
  const x2 = tgt.cx - NODE_W / 2 - 6;
  const y2 = tgt.cy;
  const dx = Math.max(50, (x2 - x1) * 0.5);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function ClockIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 16 16'
      fill='none'
      aria-hidden='true'
    >
      <circle cx='8' cy='8' r='6' stroke='currentColor' strokeWidth='1.8' />
      <path
        d='M8 4.8V8l2.4 1.6'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.8'
      />
    </svg>
  );
}

function TaskNodeCard({
  isCritical,
  scheduledTask,
  task,
}: {
  isCritical: boolean;
  scheduledTask?: ScheduledTask;
  task: Task;
}) {
  const tone = isCritical
    ? {
        accent: 'bg-rose-300',
        avatar: 'bg-rose-400',
        badge: 'border-rose-200 bg-rose-100 text-rose-600',
        border: 'border-rose-300',
        card: 'bg-rose-50/70',
        divider: 'border-rose-200',
        metric: 'text-rose-700',
        muted: 'text-rose-600',
      }
    : {
        accent: 'bg-slate-300',
        avatar: 'bg-slate-400',
        badge: '',
        border: 'border-slate-200',
        card: 'bg-white',
        divider: 'border-slate-100',
        metric: 'text-slate-700',
        muted: 'text-slate-500',
      };

  return (
    <div
      className={[
        'relative h-full rounded-[10px] border px-4 py-3 shadow-[0_12px_22px_rgba(15,23,42,0.09)]',
        tone.border,
        tone.card,
      ].join(' ')}
    >
      <div
        className={[
          'absolute top-0 left-0 h-full w-1.5 rounded-l-[10px]',
          tone.accent,
        ].join(' ')}
      />

      <div className='flex h-full min-w-0 flex-col'>
        <div className='flex min-w-0 items-start gap-3'>
          <div
            className={[
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
              tone.avatar,
            ].join(' ')}
          >
            {task.id}
          </div>

          <div className='min-w-0 flex-1 pt-0.5'>
            <div className='flex min-w-0 items-start gap-2'>
              <div className='min-w-0 flex-1 whitespace-normal break-words text-[13px] leading-5 font-bold text-slate-800'>
                {task.name}
              </div>
              {isCritical ? (
                <div
                  className={[
                    'shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] leading-3 font-bold',
                    tone.badge,
                  ].join(' ')}
                >
                  CRITICAL
                </div>
              ) : null}
            </div>

            <div
              className={[
                'mt-1 flex w-fit items-center gap-1.5 text-[11px] leading-4 font-semibold',
                tone.muted,
              ].join(' ')}
            >
              <ClockIcon className='h-3.5 w-3.5 shrink-0' />
              <span>
                {task.duration} day{task.duration === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        <div className={['mt-3 border-t pt-2', tone.divider].join(' ')}>
          {scheduledTask ? (
            <div className='grid grid-cols-4 gap-2'>
              {[
                { label: 'ES', value: scheduledTask.earliestStart },
                { label: 'EF', value: scheduledTask.earliestFinish },
                { label: 'LF', value: scheduledTask.latestFinish },
                { label: 'SLK', value: scheduledTask.float },
              ].map(({ label, value }) => (
                <div key={label} className='min-w-0'>
                  <div
                    className={[
                      'text-[9px] leading-3 font-bold tracking-wide',
                      tone.muted,
                    ].join(' ')}
                  >
                    {label}
                  </div>
                  <div
                    className={[
                      'mt-0.5 text-[12px] leading-4 font-bold',
                      label === 'SLK' && value === 0
                        ? 'text-rose-600'
                        : tone.metric,
                    ].join(' ')}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center text-[11px] font-medium text-slate-400'>
              Calculate to see schedule
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DependencyGraphProps {
  tasks: Task[];
  result: CpmResult | null;
  variant?: 'card' | 'full';
}

export function DependencyGraph({
  tasks,
  result,
  variant = 'card',
}: DependencyGraphProps) {
  if (tasks.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center rounded-lg border border-dashed border-border'>
        <Typography variant='b3' color='secondary'>
          Add tasks to see the dependency graph.
        </Typography>
      </div>
    );
  }

  const criticalSet = new Set(result?.criticalPath ?? []);
  const adj = buildAdjList(tasks);
  const topo = result?.topologicalOrder ?? topoSort(tasks, adj);
  const levels = computeLevels(tasks, topo);
  const { maxLevel, positions, svgW, svgH } = computePositions(tasks, levels);

  const scheduledMap = new Map(
    (result?.scheduledTasks ?? []).map((s) => [s.id, s]),
  );

  const edges: { from: string; to: string }[] = [];
  for (const task of tasks) {
    for (const dep of task.dependencies) {
      if (positions.has(dep)) edges.push({ from: dep, to: task.id });
    }
  }

  const C = {
    critEdge: '#fda4af',
    normEdge: '#cbd5e1',
    critBorder: '#fda4af',
    normBorder: '#e2e8f0',
    critFill: '#fff1f2',
    normFill: '#ffffff',
    critIdBg: '#fb7185',
    normIdBg: '#94a3b8',
    critText: '#9f1239',
    critSub: '#be123c',
    critMuted: '#e11d48',
    normText: '#334155',
    normSub: '#64748b',
    normMuted: '#94a3b8',
    divCrit: '#fecdd3',
    divNorm: '#f1f5f9',
    levelLine: '#e2e8f0',
    levelText: '#94a3b8',
  };

  return (
    <div
      className={[
        'overflow-auto rounded-lg border border-border bg-white dark:bg-card',
        variant === 'full' ? 'p-2' : 'p-4',
      ].join(' ')}
    >
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className='block'
        aria-label='Task dependency graph'
      >
        <defs>
          <filter id='node-shadow' x='-20%' y='-20%' width='140%' height='150%'>
            <feDropShadow
              dx='0'
              dy='7'
              stdDeviation='7'
              floodColor='#0f172a'
              floodOpacity='0.1'
            />
          </filter>
          <marker
            id='arrow-normal'
            markerWidth='14'
            markerHeight='12'
            refX='11'
            refY='5'
            orient='auto'
          >
            <polygon points='0 0, 12 5, 0 10' fill={C.normEdge} />
          </marker>
          <marker
            id='arrow-critical'
            markerWidth='14'
            markerHeight='12'
            refX='11'
            refY='5'
            orient='auto'
          >
            <polygon points='0 0, 12 5, 0 10' fill={C.critEdge} />
          </marker>
        </defs>

        <rect width={svgW} height={svgH} fill='#ffffff' />

        {Array.from({ length: maxLevel }, (_, lv) => {
          const x = PAD_X + (lv + 1) * NODE_W + lv * COL_GAP + COL_GAP / 2;
          return (
            <line
              key={`divider-${lv}`}
              x1={x}
              y1={16}
              x2={x}
              y2={svgH - 16}
              stroke={C.levelLine}
              strokeDasharray='7 9'
              strokeOpacity={0.78}
            />
          );
        })}

        {Array.from({ length: maxLevel + 1 }, (_, lv) => {
          const cx = PAD_X + lv * (NODE_W + COL_GAP) + NODE_W / 2;
          return (
            <g key={`lv-${lv}`}>
              <text
                x={cx}
                y={LEVEL_LABEL_Y}
                textAnchor='middle'
                fontSize={9.5}
                fontWeight={600}
                fill={C.levelText}
                fontFamily='ui-monospace, monospace'
                letterSpacing='1'
              >
                LEVEL {lv}
              </text>
              <line
                x1={cx - 40}
                y1={LEVEL_LABEL_Y + 12}
                x2={cx + 40}
                y2={LEVEL_LABEL_Y + 12}
                stroke={C.levelLine}
                strokeWidth={1}
              />
            </g>
          );
        })}

        {edges.map(({ from, to }) => {
          const src = positions.get(from);
          const tgt = positions.get(to);
          if (!src || !tgt) return null;
          const isCriticalEdge = criticalSet.has(from) && criticalSet.has(to);
          return (
            <path
              key={`${from}-${to}`}
              d={edgePath(src, tgt)}
              fill='none'
              stroke={isCriticalEdge ? C.critEdge : C.normEdge}
              strokeWidth={isCriticalEdge ? 2.5 : 1.5}
              strokeDasharray={isCriticalEdge ? undefined : '5 5'}
              strokeLinecap='round'
              strokeLinejoin='round'
              markerEnd={
                isCriticalEdge ? 'url(#arrow-critical)' : 'url(#arrow-normal)'
              }
            />
          );
        })}

        {tasks.map((task) => {
          const pos = positions.get(task.id);
          if (!pos) return null;
          const isCritical = criticalSet.has(task.id);
          const x = pos.cx - NODE_W / 2;
          const y = pos.cy - NODE_H / 2;
          const st = scheduledMap.get(task.id);

          return (
            <foreignObject
              key={task.id}
              x={x - 14}
              y={y - 14}
              width={NODE_W + 28}
              height={NODE_H + 28}
            >
              <div className='h-full p-3.5'>
                <TaskNodeCard
                  isCritical={isCritical}
                  scheduledTask={st}
                  task={task}
                />
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}

export function DependencyGraphLegend() {
  return (
    <Card className='shadow-none'>
      <CardContent className='flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5'>
        <Typography
          as='span'
          variant='c1'
          color='secondary'
          className='flex min-w-0 items-center gap-1.5'
        >
          <span className='inline-block h-3 w-6 shrink-0 rounded border border-rose-300 bg-rose-50 shadow-[inset_4px_0_0_#fda4af]' />
          <span className='break-words'>Critical task (float = 0)</span>
        </Typography>
        <Typography
          as='span'
          variant='c1'
          color='secondary'
          className='flex min-w-0 items-center gap-1.5'
        >
          <span className='inline-block h-3 w-6 shrink-0 rounded border border-slate-200 bg-white shadow-[inset_4px_0_0_#cbd5e1]' />
          <span className='break-words'>Non-critical task</span>
        </Typography>
        <Typography
          as='span'
          variant='c1'
          color='secondary'
          className='flex min-w-0 items-center gap-1.5'
        >
          <svg width='28' height='10' className='shrink-0'>
            <line
              x1='0'
              y1='5'
              x2='28'
              y2='5'
              stroke='#fda4af'
              strokeWidth='2.5'
              strokeLinecap='round'
            />
          </svg>
          <span className='break-words'>Critical edge</span>
        </Typography>
        <Typography
          as='span'
          variant='c1'
          color='secondary'
          className='flex min-w-0 items-center gap-1.5'
        >
          <svg width='28' height='10' className='shrink-0'>
            <line
              x1='0'
              y1='5'
              x2='28'
              y2='5'
              stroke='#cbd5e1'
              strokeWidth='1.5'
              strokeDasharray='5 5'
              strokeLinecap='round'
            />
          </svg>
          <span className='break-words'>Normal edge</span>
        </Typography>
      </CardContent>
    </Card>
  );
}
