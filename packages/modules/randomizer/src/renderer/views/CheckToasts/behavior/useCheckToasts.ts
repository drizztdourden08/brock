/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRandomizerGame } from '../../../game-registry/behavior/useRandomizerGame';
import { useTrackerFeed } from '../../../tracker/hooks/behavior/useTrackerFeed';
import { useTrackerReading } from '../../../tracker/hooks/behavior/useTrackerReading';
import type { CheckToastEntry } from '../CheckToasts.type';
import { admitToasts } from './admit-toasts';
import { newCompletedKeys } from './new-completed-keys';
import { toastRowsOf } from './toast-rows-of';

const useCheckToasts = (enabled: boolean, quietMs: number) => {
  const provider = useRandomizerGame()?.tracker;
  const feed = useTrackerFeed();
  const reading = useTrackerReading();
  const [entries, setEntries] = useState<readonly CheckToastEntry[]>([]);
  const known = useRef<ReadonlySet<string> | null>(null);
  const mountedAt = useRef(Date.now());
  const serial = useRef(0);

  useEffect(() => {
    if (feed === null) return;
    const previous = known.current;
    known.current = feed.completed;
    if (!enabled || previous === null || Date.now() - mountedAt.current < quietMs) return;
    const rows = toastRowsOf(provider, reading, feed, newCompletedKeys(previous, feed.completed));
    if (rows.length > 0) setEntries((prev) => admitToasts(prev, rows, () => `check-toast-${serial.current++}`));
  }, [feed, reading, provider, enabled, quietMs]);

  const dismiss = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  return { entries, dismiss };
};

export { useCheckToasts };
