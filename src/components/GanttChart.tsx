'use client';

import * as React from 'react';

import { Typography } from '@/components/typography';

import { CpmResult } from '@/types/task';

const LABEL_W = 148;
const BAR_H = 28;
const ROW_H = 44;
const HEADER_H = 32;
const PAD_RIGHT = 20;

interface GanttChartProps {
  result: CpmResult;
}

export function GanttChart({ result }: GanttChartProps) {
  const { scheduledTasks, projectDuration, criticalPath } = result;
  const criticalSet = new Set(criticalPath);

  if (projectDuration === 0) {
    return (
      <Typography variant='b3' color='secondary'>
        All tasks have zero duration; no chart to display.
      </Typography>
    );
  }

  const SCALE = Math.max(28, Math.min(60, Math.floor(900 / projectDuration)));

  const chartW = projectDuration * SCALE;
  const svgW = LABEL_W + chartW + PAD_RIGHT;
  const svgH = HEADER_H + scheduledTasks.length * ROW_H + 8;

  const ticks: number[] = [];
  const step = projectDuration <= 20 ? 1 : projectDuration <= 50 ? 5 : 10;
  for (let d = 0; d <= projectDuration; d += step) ticks.push(d);
  if (!ticks.includes(projectDuration)) ticks.push(projectDuration);

  return (
    <div className='overflow-x-auto rounded-lg border border-border bg-white p-2 dark:bg-card'>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className='block'
        aria-label='Gantt chart'
      >
        <rect x={0} y={0} width={svgW} height={HEADER_H} fill='#f8fafc' />
        <rect
          x={LABEL_W}
          y={0}
          width={chartW + PAD_RIGHT}
          height={HEADER_H}
          fill='#f1f5f9'
        />

        <text
          x={LABEL_W / 2}
          y={HEADER_H / 2 + 1}
          textAnchor='middle'
          dominantBaseline='middle'
          fontSize={11}
          fontWeight={600}
          fill='#64748b'
        >
          Task
        </text>

        {ticks.map((d) => (
          <g key={d}>
            <line
              x1={LABEL_W + d * SCALE}
              y1={HEADER_H - 6}
              x2={LABEL_W + d * SCALE}
              y2={HEADER_H}
              stroke='#94a3b8'
              strokeWidth={1}
            />
            <text
              x={LABEL_W + d * SCALE}
              y={HEADER_H / 2}
              textAnchor='middle'
              dominantBaseline='middle'
              fontSize={10}
              fill='#64748b'
            >
              {d}
            </text>
          </g>
        ))}

        {scheduledTasks.map((task, idx) => {
          const rowY = HEADER_H + idx * ROW_H;
          const barX = LABEL_W + task.earliestStart * SCALE;
          const barW = Math.max(2, task.duration * SCALE);
          const barY = rowY + (ROW_H - BAR_H) / 2;
          const isCritical = criticalSet.has(task.id);

          const floatW = task.float * SCALE;
          const floatX = barX + barW;

          return (
            <g key={task.id}>
              <rect
                x={0}
                y={rowY}
                width={svgW}
                height={ROW_H}
                fill={idx % 2 === 0 ? '#ffffff' : '#f8fafc'}
              />

              {ticks.map((d) => (
                <line
                  key={d}
                  x1={LABEL_W + d * SCALE}
                  y1={rowY}
                  x2={LABEL_W + d * SCALE}
                  y2={rowY + ROW_H}
                  stroke='#e2e8f0'
                  strokeWidth={1}
                />
              ))}

              <text
                x={LABEL_W - 6}
                y={rowY + ROW_H / 2}
                textAnchor='end'
                dominantBaseline='middle'
                fontSize={11}
                fill={isCritical ? '#be123c' : '#334155'}
                fontWeight={isCritical ? 600 : 400}
              >
                {task.id}:{' '}
                {task.name.length > 14
                  ? task.name.slice(0, 13) + '…'
                  : task.name}
              </text>

              {floatW > 0 && (
                <rect
                  x={floatX}
                  y={barY + 4}
                  width={floatW}
                  height={BAR_H - 8}
                  rx={3}
                  fill='#e2e8f0'
                  opacity={0.7}
                />
              )}

              <rect
                x={barX}
                y={barY}
                width={barW}
                height={BAR_H}
                rx={4}
                fill={isCritical ? '#fb7185' : '#93c5fd'}
                opacity={0.95}
              />

              {barW > 32 && (
                <text
                  x={barX + barW / 2}
                  y={barY + BAR_H / 2 + 1}
                  textAnchor='middle'
                  dominantBaseline='middle'
                  fontSize={10}
                  fill='#ffffff'
                  fontWeight={600}
                >
                  {task.duration}d
                </text>
              )}
            </g>
          );
        })}

        <line
          x1={0}
          y1={svgH - 2}
          x2={svgW}
          y2={svgH - 2}
          stroke='#e2e8f0'
          strokeWidth={1}
        />
      </svg>

      <div className='mt-3 flex flex-wrap gap-5 px-1 text-xs text-muted-foreground'>
        <Typography
          as='span'
          variant='c1'
          color='secondary'
          className='flex items-center gap-1.5'
        >
          <span className='inline-block h-3 w-8 rounded bg-rose-300' />
          Critical task
        </Typography>
        <Typography
          as='span'
          variant='c1'
          color='secondary'
          className='flex items-center gap-1.5'
        >
          <span className='inline-block h-3 w-8 rounded bg-blue-300' />
          Non-critical task
        </Typography>
        <Typography
          as='span'
          variant='c1'
          color='secondary'
          className='flex items-center gap-1.5'
        >
          <span className='inline-block h-3 w-8 rounded bg-slate-200' />
          Float / slack
        </Typography>
        <Typography as='span' variant='s4' className='ml-auto text-foreground'>
          Project duration: {projectDuration} days
        </Typography>
      </div>
    </div>
  );
}
