/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { getAppLog } from '@drizztdourden08/brock-react';
import type { LogEntry } from '@drizztdourden08/brock-core';
import { RANDOMIZER_CHANNEL } from '../../../session/log/log.constants';
import { MAX_LOG_ENTRIES } from '../hooks.constants';

const isRandomizerEntry = (entry: LogEntry): boolean => entry.channel === RANDOMIZER_CHANNEL || entry.channel === 'error';

const useRandomizerLog = (): readonly LogEntry[] => {
  const [entries, setEntries] = useState<readonly LogEntry[]>(() => getAppLog().getEntries().filter(isRandomizerEntry).slice(-MAX_LOG_ENTRIES));
  useEffect(() => getAppLog().subscribe((entry) => {
    if (isRandomizerEntry(entry)) setEntries((prev) => [...prev, entry].slice(-MAX_LOG_ENTRIES));
  }), []);
  return entries;
};

export { useRandomizerLog };
