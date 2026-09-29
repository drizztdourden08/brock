/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useState } from 'react';
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { formatLogLine } from '../../diagnostics/format-log-line';
import { useWidgetPref } from '../../hooks/useWidgetPref';
import { toLogRows } from './behavior/to-log-rows';
import { useLogEntries } from './behavior/useLogEntries';
import { HIDDEN_LEVELS_PREF, LOG_LEVEL_KINDS, LOGS_WIDGET_ID, NO_HIDDEN_LEVELS } from './LogsWidget.constants';
import './LogsWidget.css';

const LogsWidget = () => {
  const entries = useLogEntries();
  const [search, setSearch] = useState('');
  const [hiddenLevels, setHiddenLevels] = useWidgetPref<string[]>(LOGS_WIDGET_ID, HIDDEN_LEVELS_PREF, NO_HIDDEN_LEVELS);
  const hidden = useMemo(() => new Set(hiddenLevels), [hiddenLevels]);
  const shown = useMemo(() => entries.filter((entry) => !hidden.has(entry.level)), [entries, hidden]);
  const rows = useMemo(() => toLogRows(shown), [shown]);

  const toggleLevel = useCallback((level: string) => {
    setHiddenLevels(hidden.has(level) ? hiddenLevels.filter((l) => l !== level) : [...hiddenLevels, level]);
  }, [hidden, hiddenLevels, setHiddenLevels]);

  const copyText = useCallback(() => shown.map((entry) => formatLogLine(entry)).join('\n'), [shown]);

  return (
    <LogPanel
      className="logs-widget"
      rows={rows}
      kinds={LOG_LEVEL_KINDS}
      hidden={hidden}
      onToggleKind={toggleLevel}
      search={search}
      onSearchChange={setSearch}
      copyText={copyText}
      countLabel={rows.length === 1 ? 'entry' : 'entries'}
      emptyLabel="No log entries yet."
    />
  );
};

export { LogsWidget };
