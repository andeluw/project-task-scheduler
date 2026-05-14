'use client';

import * as React from 'react';

import { Card, CardContent } from '@/components/card';
import { Typography } from '@/components/typography';

import { CpmResult, Task } from '@/types/task';

const NODE_W = 210;
const NODE_H = 112;
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

function wrapText(text: string, maxChars: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];

  for (const word of words) {
    const current = lines.at(-1);
    if (!current) {
      lines.push(word);
      continue;
    }

    if (`${current} ${word}`.length <= maxChars) {
      lines[lines.length - 1] = `${current} ${word}`;
    } else {
      lines.push(word);
    }
  }

  const limited = lines.slice(0, maxLines);
  const overflow =
    lines.length > maxLines || limited.some((line) => line.length > maxChars);

  return limited.map((line, index) => {
    const clipped =
      line.length > maxChars ? `${line.slice(0, maxChars - 3)}...` : line;

    if (overflow && index === maxLines - 1 && !clipped.endsWith('...')) {
      return `${clipped.slice(0, maxChars - 3)}...`;
    }

    return clipped;
  });
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

function ClockIcon({ color, x, y }: { color: string; x: number; y: number }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={6.5}
        fill='none'
        stroke={color}
        strokeWidth={1.7}
      />
      <path
        d={`M ${x} ${y - 3.5} L ${x} ${y + 0.5} L ${x + 3.2} ${y + 2.2}`}
        fill='none'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.7}
      />
    </g>
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

          const borderColor = isCritical ? C.critBorder : C.normBorder;
          const fillColor = isCritical ? C.critFill : C.normFill;
          const idBg = isCritical ? C.critIdBg : C.normIdBg;
          const titleColor = isCritical ? C.critText : C.normText;
          const subColor = isCritical ? C.critSub : C.normSub;
          const labelColor = isCritical ? C.critMuted : C.normMuted;
          const dividerColor = isCritical ? C.divCrit : C.divNorm;
          const titleLines = wrapText(task.name, 19, 2);

          return (
            <g key={task.id}>
              <rect
                x={x}
                y={y}
                width={NODE_W}
                height={NODE_H}
                rx={10}
                ry={10}
                fill={fillColor}
                stroke={borderColor}
                strokeWidth={isCritical ? 1.75 : 1}
                filter='url(#node-shadow)'
              />
              <rect
                x={x}
                y={y}
                width={6}
                height={NODE_H}
                rx={3}
                ry={3}
                fill={isCritical ? C.critEdge : C.normEdge}
              />

              <circle cx={x + 32} cy={y + 32} r={17} fill={idBg} />
              <text
                x={x + 32}
                y={y + 33}
                textAnchor='middle'
                dominantBaseline='central'
                fontSize={14}
                fontWeight={700}
                fill='#ffffff'
                fontFamily='ui-monospace, monospace'
              >
                {task.id}
              </text>

              {titleLines.map((line, index) => (
                <text
                  key={`${task.id}-title-${index}`}
                  x={x + 58}
                  y={y + 25 + index * 14}
                  fontSize={12}
                  fontWeight={700}
                  fill={titleColor}
                  fontFamily='Inter, ui-sans-serif, system-ui'
                >
                  {line}
                </text>
              ))}

              <ClockIcon color={subColor} x={x + 63} y={y + 55} />
              <text
                x={x + 74}
                y={y + 59}
                fontSize={10.5}
                fontWeight={600}
                fill={subColor}
                fontFamily='ui-monospace, monospace'
              >
                {task.duration} day{task.duration === 1 ? '' : 's'}
              </text>

              <line
                x1={x + 16}
                y1={y + 68}
                x2={x + NODE_W - 16}
                y2={y + 68}
                stroke={dividerColor}
                strokeWidth={1}
              />

              {st ? (
                <>
                  {[
                    { label: 'ES', value: st.earliestStart, dx: 24 },
                    { label: 'EF', value: st.earliestFinish, dx: 72 },
                    { label: 'LF', value: st.latestFinish, dx: 120 },
                    { label: 'SLK', value: st.float, dx: 168 },
                  ].map(({ label, value, dx }) => (
                    <React.Fragment key={label}>
                      <text
                        x={x + dx}
                        y={y + 86}
                        fontSize={8.5}
                        fontWeight={600}
                        fill={labelColor}
                        fontFamily='ui-monospace, monospace'
                        letterSpacing='0.4'
                      >
                        {label}
                      </text>
                      <text
                        x={x + dx}
                        y={y + 101}
                        fontSize={11}
                        fontWeight={600}
                        fill={
                          label === 'SLK' && value === 0
                            ? C.critMuted
                            : titleColor
                        }
                        fontFamily='ui-monospace, monospace'
                      >
                        {value}
                      </text>
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <text
                  x={x + NODE_W / 2}
                  y={y + 92}
                  textAnchor='middle'
                  fontSize={9.5}
                  fill={C.normMuted}
                >
                  Calculate to see schedule
                </text>
              )}
            </g>
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
