'use client';

import * as React from 'react';

import { Typography } from '@/components/typography';

import { CpmResult, Task } from '@/types/task';

const NODE_W = 180;
const NODE_H = 96;
const COL_GAP = 110;
const ROW_GAP = 44;
const PAD = 48;

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
): { positions: Map<string, NodePos>; svgW: number; svgH: number } {
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
    const startY = PAD + (totalH - colH) / 2;
    const cx = PAD + lv * (NODE_W + COL_GAP) + NODE_W / 2;

    ids.forEach((id, i) => {
      const cy = startY + i * (NODE_H + ROW_GAP) + NODE_H / 2;
      positions.set(id, { cx, cy });
    });
  }

  const svgW = PAD * 2 + (maxLevel + 1) * NODE_W + maxLevel * COL_GAP;
  const svgH = PAD * 2 + totalH;

  return { positions, svgW, svgH };
}

function edgePath(src: NodePos, tgt: NodePos): string {
  const x1 = src.cx + NODE_W / 2;
  const y1 = src.cy;
  const x2 = tgt.cx - NODE_W / 2 - 6;
  const y2 = tgt.cy;
  const dx = Math.max(50, (x2 - x1) * 0.5);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
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
  const { positions, svgW, svgH } = computePositions(tasks, levels);

  const scheduledMap = new Map(
    (result?.scheduledTasks ?? []).map((s) => [s.id, s]),
  );

  const edges: { from: string; to: string }[] = [];
  for (const task of tasks) {
    for (const dep of task.dependencies) {
      if (positions.has(dep)) edges.push({ from: dep, to: task.id });
    }
  }

  const maxLevel = Math.max(...Array.from(levels.values()));

  // Soft pastel palette
  const C = {
    critEdge: '#fda4af', // rose-300
    normEdge: '#cbd5e1', // slate-300
    critBorder: '#fda4af',
    normBorder: '#e2e8f0', // slate-200
    critFill: '#fff1f2', // rose-50
    normFill: '#ffffff',
    critIdBg: '#fb7185', // rose-400
    normIdBg: '#94a3b8', // slate-400
    critText: '#9f1239', // rose-800
    critSub: '#be123c', // rose-700
    critMuted: '#e11d48', // rose-600
    normText: '#334155', // slate-700
    normSub: '#64748b', // slate-500
    normMuted: '#94a3b8',
    divCrit: '#fecdd3', // rose-200
    divNorm: '#f1f5f9', // slate-100
    gridLine: '#eef2f7',
    levelLabel: '#cbd5e1',
  };

  return (
    <div
      className={[
        'overflow-auto rounded-2xl border border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/40',
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
          <pattern
            id='dotgrid'
            width='20'
            height='20'
            patternUnits='userSpaceOnUse'
          >
            <circle cx='1' cy='1' r='1' fill={C.gridLine} />
          </pattern>
          <marker
            id='arrow-normal'
            markerWidth='12'
            markerHeight='10'
            refX='10'
            refY='5'
            orient='auto'
          >
            <polygon points='0 0, 12 5, 0 10' fill={C.normEdge} />
          </marker>
          <marker
            id='arrow-critical'
            markerWidth='12'
            markerHeight='10'
            refX='10'
            refY='5'
            orient='auto'
          >
            <polygon points='0 0, 12 5, 0 10' fill={C.critEdge} />
          </marker>
        </defs>

        <rect width={svgW} height={svgH} fill='url(#dotgrid)' />

        {/* Level labels */}
        {Array.from({ length: maxLevel + 1 }, (_, lv) => {
          const cx = PAD + lv * (NODE_W + COL_GAP) + NODE_W / 2;
          return (
            <text
              key={`lv-${lv}`}
              x={cx}
              y={22}
              textAnchor='middle'
              fontSize={9.5}
              fontWeight={600}
              fill={C.levelLabel}
              fontFamily='ui-monospace, monospace'
              letterSpacing='1'
            >
              LEVEL {lv}
            </text>
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

          return (
            <g key={task.id}>
              {/* Card */}
              <rect
                x={x}
                y={y}
                width={NODE_W}
                height={NODE_H}
                rx={14}
                ry={14}
                fill={fillColor}
                stroke={borderColor}
                strokeWidth={isCritical ? 1.75 : 1}
              />

              {/* ID circle */}
              <circle cx={x + 26} cy={y + 26} r={16} fill={idBg} />
              <text
                x={x + 26}
                y={y + 27}
                textAnchor='middle'
                dominantBaseline='central'
                fontSize={14}
                fontWeight={700}
                fill='#ffffff'
                fontFamily='ui-monospace, monospace'
              >
                {task.id}
              </text>

              {/* Name */}
              <text
                x={x + 50}
                y={y + 22}
                fontSize={12.5}
                fontWeight={600}
                fill={titleColor}
              >
                {task.name.length > 16
                  ? task.name.slice(0, 15) + '…'
                  : task.name}
              </text>

              {/* Duration */}
              <text
                x={x + 50}
                y={y + 38}
                fontSize={10.5}
                fontWeight={500}
                fill={subColor}
                fontFamily='ui-monospace, monospace'
              >
                {task.duration} day{task.duration === 1 ? '' : 's'}
              </text>

              {/* Critical badge */}
              {isCritical && (
                <>
                  <rect
                    x={x + NODE_W - 56}
                    y={y + 10}
                    width={46}
                    height={18}
                    rx={9}
                    ry={9}
                    fill='#ffe4e6'
                    stroke='#fecdd3'
                    strokeWidth={1}
                  />
                  <text
                    x={x + NODE_W - 33}
                    y={y + 19}
                    textAnchor='middle'
                    dominantBaseline='central'
                    fontSize={8.5}
                    fontWeight={700}
                    fill={C.critSub}
                    letterSpacing='0.6'
                  >
                    CRITICAL
                  </text>
                </>
              )}

              {/* Divider */}
              <line
                x1={x + 12}
                y1={y + 54}
                x2={x + NODE_W - 12}
                y2={y + 54}
                stroke={dividerColor}
                strokeWidth={1}
              />

              {/* Schedule grid */}
              {st ? (
                <>
                  {[
                    { label: 'ES', value: st.earliestStart, dx: 14 },
                    { label: 'EF', value: st.earliestFinish, dx: 58 },
                    { label: 'LF', value: st.latestFinish, dx: 102 },
                    { label: 'SLK', value: st.float, dx: 146 },
                  ].map(({ label, value, dx }) => (
                    <React.Fragment key={label}>
                      <text
                        x={x + dx}
                        y={y + 70}
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
                        y={y + 84}
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
                  y={y + 78}
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
    <div className='flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-2.5'>
      <Typography
        as='span'
        variant='c1'
        color='secondary'
        className='flex items-center gap-1.5'
      >
        <span className='inline-block h-3 w-6 rounded border border-rose-300 bg-rose-50' />
        Critical task (float = 0)
      </Typography>
      <Typography
        as='span'
        variant='c1'
        color='secondary'
        className='flex items-center gap-1.5'
      >
        <span className='inline-block h-3 w-6 rounded border border-slate-200 bg-white' />
        Non-critical
      </Typography>
      <Typography
        as='span'
        variant='c1'
        color='secondary'
        className='flex items-center gap-1.5'
      >
        <svg width='28' height='10'>
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
        Critical edge
      </Typography>
      <Typography
        as='span'
        variant='c1'
        color='secondary'
        className='flex items-center gap-1.5'
      >
        <svg width='28' height='10'>
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
        Normal edge
      </Typography>
    </div>
  );
}
