import type { RowData, Table } from '@tanstack/react-table';
import { Search, XCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { IconButton } from '@/components/icon-button';

type FilterProps<T extends RowData> = {
  isLoading?: boolean;
  placeholder?: string;
  table: Table<T>;
} & React.ComponentPropsWithoutRef<'div'>;

const Filter = <T extends RowData>({
  className,
  isLoading = false,
  placeholder = 'Search...',
  table,
  ...rest
}: FilterProps<T>) => {
  const [filter, setFilter] = React.useState(
    () => table.getState().globalFilter,
  );

  const handleClearFilter = () => {
    table.setGlobalFilter('');
    setFilter('');
  };

  const handleClickSearch = () => {
    table.setGlobalFilter(filter);
  };

  return (
    <div className={cn('flex gap-1', className)} {...rest}>
      <div className='relative'>
        <input
          className={cn(
            'flex w-full rounded-lg shadow-sm bg-transparent',
            'min-h-[2.25rem] py-0 pr-9 md:min-h-[2.5rem]',
            'border-input focus:border-primary-500 focus:ring-primary-500',
          )}
          onChange={(e) => {
            setFilter(String(e.target.value));
          }}
          placeholder={placeholder}
          type='text'
          value={filter ?? ''}
        />
        {table.getState().globalFilter !== '' && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
            <button className='p-1' onClick={handleClearFilter} type='button'>
              <XCircle className='text-xl text-muted-foreground hover:text-foreground' />
            </button>
          </div>
        )}
      </div>
      <IconButton
        className=''
        icon={Search}
        isLoading={isLoading}
        onClick={handleClickSearch}
        variant='outlineblack'
      />
    </div>
  );
};
Filter.displayName = 'Filter';

export { Filter };
