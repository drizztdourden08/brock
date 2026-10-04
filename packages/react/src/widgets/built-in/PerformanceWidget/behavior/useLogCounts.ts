/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { LogEntry } from '@drizztdourden08/brock-core';
import { appLogState } from '../../../../log/app-log-state';
import type { LogLevelCounts } from '../../../../log/app-log.type';
import { RELAY_SLICES } from '../../../widget.constants';
import { useWidgetRelayStore } from '../../../useWidgetRelayStore';
import { widgetWindowId } from '../../../widget-window-id';

const countLevels = (entries: readonly LogEntry[]): LogLevelCounts => ({
  warn: entries.filter((entry) => entry.level === 'warn').length,
  error: entries.filter((entry) => entry.level === 'error').length,
});

const useLogCounts = (): LogLevelCounts => {
  const relayed = useMemo(() => widgetWindowId() !== null, []);
  const fromApp = useWidgetRelayStore((s) => s.slices[RELAY_SLICES.log]) as LogEntry[] | undefined;
  const relayedCounts = useMemo(() => countLevels(fromApp ?? []), [fromApp]);
  return relayed ? relayedCounts : { ...appLogState.counts };
};

export { useLogCounts };
