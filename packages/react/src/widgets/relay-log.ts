/* @layer renderer-shell @kind logic */
import type { LogEntry } from '@drizztdourden08/brock-core';
import { getAppLog } from '../log/get-app-log';
import { RELAY_DELAY_MS, RELAY_SLICES } from './widget.constants';

const relayLog = (publish: (kind: string, data: unknown) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: LogEntry[] = [];
  const sendPending = (): void => {
    timer = null;
    if (pending.length > 0) publish(RELAY_SLICES.logAppend, pending);
    pending = [];
  };
  const stopListening = getAppLog().subscribe((entry) => {
    pending.push(entry);
    timer ??= setTimeout(sendPending, RELAY_DELAY_MS);
  });
  const sendAll = (): void => {
    pending = [];
    publish(RELAY_SLICES.log, getAppLog().getEntries());
  };
  const stop = (): void => {
    if (timer) clearTimeout(timer);
    stopListening();
  };
  return { sendAll, stop };
};

export { relayLog };
