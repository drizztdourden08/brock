/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { LogEntry } from '@drizztdourden08/brock-core';
import { getAppLog } from '../../../log/get-app-log';
import { LOG_ENTRY_LIMIT } from '../LogsWidget.constants';

const useLogEntries = (limit = LOG_ENTRY_LIMIT): LogEntry[] => {
  const [entries, setEntries] = useState<LogEntry[]>(() => getAppLog().getEntries().slice(-limit));

  useEffect(() => {
    const bus = getAppLog();
    setEntries(bus.getEntries().slice(-limit));
    return bus.subscribe((entry) => {
      setEntries((prev) => [...prev, entry].slice(-limit));
    });
  }, [limit]);

  return entries;
};

export { useLogEntries };
