import type { StringifyOptions } from 'query-string';
import queryString from 'query-string';

import type { ServerTableState } from '@/components/table/server-table';

export type BuildPaginationTableParam = {
  /** API Base URL, with / on the front */
  baseUrl: string;
  tableState: ServerTableState;
  /** Parameter addition
   * @example include: ['user', 'officer']
   */
  additionalParam?: Record<string, unknown>;
  options?: StringifyOptions;
};
type BuildPaginationTableURL = (props: BuildPaginationTableParam) => string;

const buildPaginatedTableURL: BuildPaginationTableURL = ({
  baseUrl,
  tableState,
  additionalParam,
  options,
}) => {
  return queryString.stringifyUrl(
    {
      url: baseUrl,
      query: {
        page: tableState.pagination.pageIndex + 1,
        page_size: tableState.pagination.pageSize,
        search: tableState.globalFilter,
        sort_by: tableState.sorting[0]?.id,
        sort_dir:
          tableState.sorting.length > 0
            ? tableState.sorting[0].desc
              ? 'desc'
              : 'asc'
            : undefined,
        ...additionalParam,
      },
    },
    {
      arrayFormat: 'comma',
      skipEmptyString: true,
      ...options,
    },
  );
};
export { buildPaginatedTableURL, queryString };
