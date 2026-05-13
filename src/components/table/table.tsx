import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Filter } from '@/components/table/filter';
import { TableBody } from '@/components/table/table-body';
import { TableHead } from '@/components/table/table-head';

export type TableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
  emptyPlaceholder?: React.ReactNode;
  filterPlaceholder?: string;
  isLoading?: boolean;
  omitSort?: boolean;
  withFilter?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

const Table = <T extends object>({
  className,
  columns,
  data,
  emptyPlaceholder,
  filterPlaceholder,
  isLoading = false,
  omitSort = false,
  withFilter = false,
  ...rest
}: TableProps<T>) => {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    /** @see https://github.com/TanStack/table/issues/4280 */
    globalFilterFn: (row, columnId, filterValue) => {
      const safeValue = (() => {
        const value = row.getValue(columnId) as string | number;
        return typeof value === 'number' ? String(value) : value;
      })();

      return safeValue?.toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className={cn('flex flex-col', className)} {...rest}>
      {withFilter ? (
        <Filter placeholder={filterPlaceholder} table={table} />
      ) : null}
      <div
        className={cn([
          'mt-2 overflow-x-auto',
          // set enough space so the the drop-shadow is not cropped
          'md:-mx-[2px] md:px-[2px]',
        ])}
      >
        <div className='inline-block min-w-full py-2 align-middle'>
          <div className='overflow-hidden shadow ring-1 ring-border ring-opacity-5 md:rounded-lg'>
            <table className='min-w-full divide-y divide-border'>
              <TableHead omitSort={omitSort} table={table} />
              <TableBody
                emptyPlaceholder={emptyPlaceholder}
                isLoading={isLoading}
                omitSort={omitSort}
                table={table}
              />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
Table.displayName = 'Table';

export { Table };
