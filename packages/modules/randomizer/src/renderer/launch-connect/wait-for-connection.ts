/* @layer renderer-shell @kind logic */
import { CONNECTION_WAIT_MS } from './launch-connect.constants';
import type { ConnectionVerdict, ConnectionWatch } from './launch-connect.type';

const verdictOf = (watch: ConnectionWatch): ConnectionVerdict | null => {
  const signal = watch.current();
  if (signal === 'active') return 'connected';
  return signal === 'error' ? 'failed' : null;
};

const waitForConnection = (watch: ConnectionWatch, isCancelled: () => boolean): Promise<ConnectionVerdict> =>
  new Promise((resolve) => {
    const pending: { stop: () => void; timer: ReturnType<typeof setTimeout> | undefined } = { stop: () => undefined, timer: undefined };
    const finish = (verdict: ConnectionVerdict): void => {
      clearTimeout(pending.timer);
      pending.stop();
      resolve(verdict);
    };
    const check = (): void => {
      const verdict = isCancelled() ? 'cancelled' : verdictOf(watch);
      if (verdict !== null) finish(verdict);
    };
    pending.timer = setTimeout(() => finish('timed-out'), CONNECTION_WAIT_MS);
    pending.stop = watch.subscribe(check);
    check();
  });

export { waitForConnection };
