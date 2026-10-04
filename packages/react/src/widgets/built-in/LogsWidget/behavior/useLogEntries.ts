/* @layer renderer-shell @kind hook */
import { useEffect, useMemo, useState } from 'react';
import type { LogEntry } from '@drizztdourden08/brock-core';
import { getAppLog } from '../../../../log/get-app-log';
import { RELAY_SLICES } from '../../../widget.constants';
import { useWidgetRelayStore } from '../../../useWidgetRelayStore';
import { widgetWindowId } from '../../../widget-window-id';
import { LOG_ENTRY_LIMIT } from '../LogsWidget.constants';

const useLogEntries = (limit = LOG_ENTRY_LIMIT): LogEntry[] => {
  const relayed = useMemo(() => widgetWindowId() !== null, []);
  const fromApp = useWidgetRelayStore((s) => s.slices[RELAY_SLICES.log]) as LogEntry[] | undefined;
  const relayedEntries = useMemo(() => (fromApp ?? []).slice(-limit), [fromApp, limit]);
  const [entries, setEntries] = useState<LogEntry[]>(() => getAppLog().getEntries().slice(-limit));

  useEffect(() => {
    if (relayed) return undefined;
    const bus = getAppLog();
    setEntries(bus.getEntries().slice(-limit));
    return bus.subscribe((entry) => {
      setEntries((prev) => [...prev, entry].slice(-limit));
    });
  }, [limit, relayed]);

  return relayed ? relayedEntries : entries;
};

export { useLogEntries };
