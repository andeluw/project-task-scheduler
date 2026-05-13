import type { RowData, Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type TableHeadProps<T extends RowData> = {
  omitSort: boolean;
  table: Table<T>;
} & React.ComponentPropsWithoutRef<'div'>;

const TableHead = <T extends RowData>({
  className,
  omitSort,
  table,
  ...rest
}: TableHeadProps<T>) => {
  return (
    <thead
      className={cn(
        'border-b border-border bg-gray-50 dark:bg-muted/50',
        className,
      )}
      {...rest}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              className={cn(
                'group py-3 pr-3 text-left text-base font-semibold capitalize',
                !omitSort && header.column.getCanSort() ? 'pl-4' : 'pl-[30px]',
              )}
              key={header.id}
              scope='col'
            >
              {header.isPlaceholder ? null : (
                <div
                  className={cn(
                    'flex items-center gap-2 py-1',
                    !omitSort && header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : '',
                  )}
                  onClick={
                    omitSort
                      ? () => null
                      : header.column.getToggleSortingHandler()
                  }
                >
                  {!omitSort &&
                  header.column.getCanSort() &&
                  !header.column.getIsSorted() ? (
                    <ChevronDown className='w-3 rotate-180 fill-primary-600 group-hover:fill-typo-icons' />
                  ) : (
                    ({
                      asc: (
                        <ChevronDown className='w-3 rotate-180 fill-primary-600' />
                      ),
                      desc: <ChevronDown className='w-3 fill-primary-600' />,
                    }[header.column.getIsSorted() as string] ?? null)
                  )}
                  <p>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </p>
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};
TableHead.displayName = 'TableHead';

export { TableHead };
