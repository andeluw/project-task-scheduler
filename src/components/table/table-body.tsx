import type { RowData, Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Typography } from '@/components/typography';

type TableBodyProps<T extends RowData> = {
  emptyPlaceholder?: React.ReactNode;
  isLoading?: boolean;
  omitSort: boolean;
  table: Table<T>;
} & React.ComponentPropsWithoutRef<'div'>;

const getCellTitle = (value: unknown) => {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return value.toString();
  }

  return undefined;
};

const TableBody = <T extends RowData>({
  className,
  emptyPlaceholder,
  isLoading = false,
  omitSort,
  table,
  ...rest
}: TableBodyProps<T>) => {
  const rows = table.getRowModel().rows;

  return (
    <tbody
      className={cn('divide-y divide-border bg-background', className)}
      {...rest}
    >
      {isLoading ? (
        <tr className='animate-pulse bg-gray-50 dark:bg-muted/50'>
          <td
            className='whitespace-nowrap px-6 py-4 text-center text-sm text-muted-foreground'
            colSpan={table.getAllColumns().length}
          >
            <span>Fetching data...</span>
          </td>
        </tr>
      ) : null}
      {rows.length === 0 && !isLoading ? (
        <tr className='bg-gray-50 dark:bg-muted/50'>
          <td
            className='whitespace-nowrap px-6 py-4 text-center text-sm text-muted-foreground'
            colSpan={table.getAllColumns().length}
          >
            {typeof emptyPlaceholder === 'string' ? (
              <span>{emptyPlaceholder}</span>
            ) : (
              emptyPlaceholder || <span>No data found</span>
            )}
          </td>
        </tr>
      ) : (
        rows.map((row, index) => (
          <tr
            className={cn(
              index % 2 === 0 ? 'bg-background' : 'bg-gray-50 dark:bg-muted/50',
            )}
            key={row.id}
          >
            {row.getVisibleCells().map((cell) => (
              <Typography
                as='td'
                className={cn([
                  'whitespace-nowrap',
                  'truncate',
                  'py-4 pr-3',
                  !omitSort && cell.column.getCanSort()
                    ? 'pl-[34px]'
                    : 'pl-[30px]',
                ])}
                color='secondary'
                key={cell.id}
                style={{
                  width:
                    cell.column.getSize() !== 0
                      ? cell.column.getSize()
                      : undefined,
                  maxWidth:
                    cell.column.getSize() !== 0
                      ? cell.column.getSize()
                      : undefined,
                }}
                title={getCellTitle(cell.getValue())}
                variant='b2'
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Typography>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
};
TableBody.displayName = 'TableBody';

export { TableBody };
