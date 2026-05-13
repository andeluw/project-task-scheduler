'use client';

import type {
  ColumnDef,
  PaginationState,
  Row,
  SortingState,
} from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import * as React from 'react';
import { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/button';
import { ScrollArea, ScrollBar } from '@/components/scroll-area';
import { Filter } from '@/components/table/filter';
import { Option } from '@/components/table/option';
import { TableBody } from '@/components/table/table-body';
import { TableHead } from '@/components/table/table-head';
import { Typography } from '@/components/typography';

import { LOCALE } from '@/constant/common';

import { PaginatedApiResponse } from '@/types/api';

export interface ServerTableState {
  globalFilter: string;
  pagination: PaginationState;
  sorting: SortingState;
}

interface CustomTableMeta<T> {
  getRowStyles?: (row: Row<T>) => CSSProperties;
}

type ConditionalStyles<T> = (row: Row<T>) => CSSProperties;

interface SetServerTableState {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}

export type ServerTableProps<T extends object> = {
  columns: ColumnDef<T>[];
  data: PaginatedApiResponse<T[]> | undefined;
  emptyPlaceholder?: React.ReactNode;
  filterPlaceholder?: string;
  header?: React.ReactNode;
  isLoading: boolean;
  tableState: ServerTableState;
  setTableState: SetServerTableState;
  meta?: CustomTableMeta<T>;
  conditionalStyles?: ConditionalStyles<T>;
  omitSort?: boolean;
  withFilter?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

const ServerTable = <T extends object>({
  className,
  columns,
  data: response,
  header: Header,
  isLoading,
  tableState,
  setTableState,
  emptyPlaceholder,
  filterPlaceholder,
  omitSort = false,
  withFilter = false,
  conditionalStyles,
  ...rest
}: ServerTableProps<T>) => {
  const data = response?.data || [];
  const meta = response?.meta;

  const from = meta ? (meta.page - 1) * meta.per_page + 1 : 0;
  const to = meta ? Math.min(meta.page * meta.per_page, Number(meta.count)) : 0;

  const table = useReactTable({
    data,
    columns,
    state: {
      ...tableState,
    },
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    onGlobalFilterChange: setTableState.setGlobalFilter,
    onPaginationChange: setTableState.setPagination,
    onSortingChange: setTableState.setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: meta?.max_page || 0,
    meta: {
      getRowStyles: (row: Row<T>): CSSProperties =>
        conditionalStyles ? conditionalStyles(row) : {},
    },
  });

  return (
    <div className={cn('flex flex-col', className)} {...rest}>
      <div
        className={cn(
          'flex flex-col items-stretch gap-3 sm:flex-row',
          withFilter ? 'sm:justify-between' : 'sm:justify-end',
        )}
      >
        {withFilter ? (
          <Filter
            isLoading={isLoading}
            placeholder={filterPlaceholder}
            table={table}
          />
        ) : null}
        <div className='flex items-center gap-3'>
          {Header}
          <Option
            icon={<List size={16} />}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            value={table.getState().pagination.pageSize}
          >
            {[5, 10, 25].map((page) => (
              <option key={page} value={page}>
                {page} Entries
              </option>
            ))}
          </Option>
        </div>
      </div>

      <ScrollArea className='mt-2 w-[--scroll-area-width] h-[--scroll-area-height] max-w-full'>
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
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {meta && meta.count && meta.count > 0 ? (
        <Typography
          className='mt-2 md:text-right'
          color='tertiary'
          variant='b3'
        >
          Showing data{' '}
          <span className='font-medium text-typo'>
            {from.toLocaleString(LOCALE)}
          </span>{' '}
          to{' '}
          <span className='font-medium text-typo'>
            {to.toLocaleString(LOCALE)}
          </span>{' '}
          of{' '}
          <span className='font-medium text-typo'>
            {meta?.count?.toLocaleString(LOCALE) ?? '0'}
          </span>{' '}
          entries.
        </Typography>
      ) : null}

      {meta && meta.count && meta.count > 0 ? (
        <div className='flex items-center justify-between gap-x-2 mt-6 md:justify-end'>
          <div className='flex gap-1'>
            <Button
              disabled={meta.page === 1}
              leftIcon={ChevronLeft}
              onClick={() => table.previousPage()}
              size='sm'
              variant='ghost'
            >
              Prev
            </Button>
            <Button
              disabled={meta.page === meta.max_page}
              onClick={() => table.nextPage()}
              rightIcon={ChevronRight}
              size='sm'
              variant='ghost'
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

ServerTable.displayName = 'ServerTable';

export { ServerTable };
