/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { DataTable, FilterBar } from '@drizztdourden08/tessera/composites';
import { RescanButton } from '../../compounds/RescanButton';
import { useControllerDirectory } from './behavior/useControllerDirectory';
import {
  COUNT_LABEL, DIRECTORY_COLUMNS, DIRECTORY_EXPANDED, DIRECTORY_GROUP_BY, DIRECTORY_VIRTUALIZE_FROM, EMPTY_MESSAGE, SEARCH_LABEL, SEARCH_PLACEHOLDER,
} from './ControllerDirectory.constants';
import type { ControllerDirectoryProps, DirectoryRow } from './ControllerDirectory.type';
import './ControllerDirectory.css';

const getRowId = (row: DirectoryRow): string => row.id;

const ControllerDirectory = (props: ControllerDirectoryProps) => {
  const { onOpenController } = props;
  const { schema, text, rows, shown, loaded, clauses, setClauses, search, setSearch, isRescanPending, handleRescan } = useControllerDirectory();
  const count = useMemo<[string, string]>(() => [text(COUNT_LABEL[0]), text(COUNT_LABEL[1])], [text]);

  const handleSelect = useCallback((id: string) => {
    const key = rows.find((row) => row.id === id)?.connectedKey;
    if (key) onOpenController?.(key);
  }, [rows, onOpenController]);

  return (
    <Box className="controller-directory">
      <FilterBar
        schema={schema}
        clauses={clauses}
        onChange={setClauses}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={text(SEARCH_PLACEHOLDER)}
        searchLabel={text(SEARCH_LABEL)}
        fields={['family', 'source', 'group']}
        extra={<RescanButton isPending={isRescanPending} onRescan={handleRescan} />}
      />
      <DataTable
        key={loaded ? 'loaded' : 'loading'}
        rows={shown}
        schema={schema}
        getRowId={getRowId}
        fallbackColumns={DIRECTORY_COLUMNS}
        fallbackGroupBy={DIRECTORY_GROUP_BY}
        defaultExpanded={DIRECTORY_EXPANDED}
        virtualizeFrom={DIRECTORY_VIRTUALIZE_FROM}
        onSelect={handleSelect}
        countLabel={count}
        emptyMessage={text(EMPTY_MESSAGE)}
      />
    </Box>
  );
};

export { ControllerDirectory };
