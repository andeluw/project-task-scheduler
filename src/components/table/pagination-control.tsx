import type { RowData, Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/button';

import { LOCALE } from '@/constant/common';

type PaginationControlProps<T extends RowData> = {
  data: T[];
  table: Table<T>;
} & React.ComponentPropsWithoutRef<'div'>;

/**
 *
 * @see https://javascript.plainenglish.io/create-a-pagination-in-a-react-way-df5c6fe1e0c7
 */
const PaginationControl = <T extends RowData>({
  className,
  data,
  table,
  ...rest
}: PaginationControlProps<T>) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const paginationControl = buildPaginationControl(currentPage, pageCount);

  const handlePageControlClick = (page: string | number) => {
    if (page !== '...') {
      table.setPageIndex((page as number) - 1);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-x-2  md:justify-end',
        className,
      )}
      {...rest}
    >
      <div className='flex gap-1'>
        <Button
          disabled={!table.getCanPreviousPage()}
          leftIcon={ChevronLeft}
          onClick={() => table.previousPage()}
          size='sm'
          variant='ghost'
        >
          Prev
        </Button>
        {paginationControl.map((page, index) => (
          <Button
            className={cn(
              currentPage === page && 'bg-primary-200 dark:bg-primary-900/50',
              'min-w-[2rem]',
            )}
            key={index}
            onClick={() => handlePageControlClick(page)}
            size='sm'
            variant='ghost'
          >
            {page.toLocaleString(LOCALE)}
          </Button>
        ))}
        <Button
          disabled={
            !table.getCanNextPage() ||
            data.length < table.getState().pagination.pageSize
          }
          onClick={() => table.nextPage()}
          rightIcon={ChevronRight}
          size='sm'
          variant='ghost'
        >
          Next
        </Button>
      </div>
    </div>
  );
};
PaginationControl.displayName = 'PaginationControl';

function buildPaginationControl(
  currentPage: number,
  pageCount: number,
  delta = 1,
) {
  const rangeWithDots: (number | string)[] = [];

  const range = [...Array(pageCount)]
    .map((_, i) => i + 1)
    .map((page) => {
      if (
        Math.abs(page - 1) <= delta ||
        Math.abs(pageCount - page) <= delta ||
        Math.abs(currentPage - page) <= delta
      )
        return page;

      return -1;
    })
    .filter((page) => page !== -1);

  range.forEach((page, i) => {
    const previousPage = range[i - 1];
    if (page - previousPage > 1) rangeWithDots.push('...');
    rangeWithDots.push(page);
  });

  return rangeWithDots;
}

export { PaginationControl };
