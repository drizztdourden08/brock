/* @layer renderer-shell @kind component */
import { useMemo, useState } from 'react';
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { useRandomizerLog } from '../../hooks/use-randomizer-log';
import { logRowsOf } from './behavior/log-rows';
import { rowsToText } from './behavior/rows-to-text';
import { LOG_COUNT_LABEL, LOG_EMPTY_LABEL, LOG_KINDS } from './LogsView.constants';

const LogsView = () => {
  const entries = useRandomizerLog();
  const [search, setSearch] = useState('');
  const rows = useMemo(() => logRowsOf(entries), [entries]);

  return (
    <LogPanel
      rows={rows}
      kinds={LOG_KINDS}
      search={search}
      onSearchChange={setSearch}
      copyText={rowsToText}
      countLabel={LOG_COUNT_LABEL}
      emptyLabel={LOG_EMPTY_LABEL}
    />
  );
};

export { LogsView };
