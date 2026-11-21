/* @layer renderer-shell @kind hook */
import { useMemo, useState } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import { compile } from '@drizztdourden08/tessera/data';
import type { FilterClause } from '@drizztdourden08/tessera/data';
import { useControllerDevices } from '../../../renderer/useControllerDevices';
import { directorySchema } from './directory-schema';
import { compareDirectoryRows } from './compare-directory-rows';
import { connectedRows } from './connected-rows';
import { knownRows } from './known-rows';
import { matchDirectoryRow } from './match-directory-row';
import { useMappingEntries } from './useMappingEntries';

const useControllerDirectory = () => {
  const text = useText();
  const schema = useMemo(() => directorySchema(text), [text]);
  const { entries: devices, isRescanPending, handleRescan } = useControllerDevices();
  const { entries, loaded } = useMappingEntries(devices);
  const [clauses, setClauses] = useState<readonly FilterClause[]>([]);
  const [search, setSearch] = useState('');

  const rows = useMemo(
    () => [...connectedRows(devices, entries), ...knownRows(entries, devices)].sort(compareDirectoryRows),
    [devices, entries],
  );
  const shown = useMemo(() => {
    const byClauses = compile(clauses, schema);
    return rows.filter((row) => byClauses(row) && matchDirectoryRow(row, search));
  }, [rows, clauses, search, schema]);

  return { schema, text, rows, shown, loaded, clauses, setClauses, search, setSearch, isRescanPending, handleRescan };
};

export { useControllerDirectory };
