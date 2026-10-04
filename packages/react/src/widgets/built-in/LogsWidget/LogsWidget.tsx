/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useState } from 'react';
import { LogPanel } from '@drizztdourden08/tessera/composites';
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { FilterClause } from '@drizztdourden08/tessera/data';
import { formatLogLine } from '../../../diagnostics/format-log-line';
import { useWidgetPref } from '../../../hooks/useWidgetPref';
import { toLogRows } from './behavior/to-log-rows';
import { useLogEntries } from './behavior/useLogEntries';
import { FILTERS_PREF, LOG_LEVEL_KINDS, LOGS_WIDGET_ID, NO_FILTERS } from './LogsWidget.constants';
import './LogsWidget.css';

const LogsWidget = () => {
  const entries = useLogEntries();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useWidgetPref<readonly FilterClause[]>(LOGS_WIDGET_ID, FILTERS_PREF, NO_FILTERS);
  const rows = useMemo(() => toLogRows(entries), [entries]);

  const copyText = useCallback((shown: readonly LogRow[]) => {
    const byId = new Map(entries.map((entry) => [String(entry.id), entry]));
    return shown.flatMap((row) => {
      const entry = byId.get(row.id);
      return entry ? [formatLogLine(entry)] : [];
    }).join('\n');
  }, [entries]);

  return (
    <LogPanel
      className="logs-widget"
      rows={rows}
      kinds={LOG_LEVEL_KINDS}
      filters={filters}
      onFiltersChange={setFilters}
      search={search}
      onSearchChange={setSearch}
      copyText={copyText}
      emptyLabel="No log entries yet."
    />
  );
};

export { LogsWidget };
