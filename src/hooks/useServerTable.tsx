import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';

export type UseServerTableProps<T extends object> = {
  pageSize?: number;
  sortBy?: Extract<keyof (T & { id: string | number }), string>;
  sortDir?: 'asc' | 'desc';
};

function useServerTable<T extends object>({
  pageSize = 10,
  sortBy = 'id',
  sortDir = 'asc',
}: UseServerTableProps<T> = {}) {
  const query = useSearchParams();

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const [globalFilter, setGlobalFilter] = React.useState(
    query.get('search') ?? '',
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: query.get('page') ? Number(query.get('page')) - 1 : 0,
    pageSize: query.get('per_page') ? Number(query.get('per_page')) : pageSize,
  });

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: query.get('sort_by') ?? sortBy,
      desc: query.get('sort_dir')
        ? query.get('sort_dir') === 'desc'
        : sortDir === 'desc',
    },
  ]);

  return {
    tableState: {
      globalFilter,
      pagination,
      sorting,
      rowSelection,
    },
    setTableState: {
      setGlobalFilter,
      setPagination,
      setSorting,
      setRowSelection,
    },
  };
}
export { useServerTable };
