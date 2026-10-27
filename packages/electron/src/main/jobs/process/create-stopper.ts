/* @layer electron-main @kind logic */
import { killProcessTree } from './kill-process-tree';
import { PROCESS_GIVE_UP_MS } from './process-job.constants';
import type { Stopper, StopperInput } from './process-job.type';

const stillRunning = (child: StopperInput['child']): boolean => child.exitCode === null && child.signalCode === null;

const createStopper = ({ child, signal, graceMs, timeoutMs, giveUpMs = PROCESS_GIVE_UP_MS, giveUp }: StopperInput): Stopper => {
  const state = { killed: false, timedOut: false };
  const timers: ReturnType<typeof setTimeout>[] = [];
  const later = (ms: number, action: () => void): void => {
    timers.push(setTimeout(action, ms));
  };
  const hit = (force: boolean): void => {
    if (!stillRunning(child)) return;
    state.killed = true;
    void killProcessTree(child, force).then((result) => {
      if (force && result === 'refused' && stillRunning(child)) giveUp();
    });
  };
  const onAbort = (): void => {
    hit(false);
    later(graceMs, () => hit(true));
    later(graceMs + giveUpMs, giveUp);
  };
  const onTimeout = (): void => {
    state.timedOut = true;
    hit(true);
    later(giveUpMs, giveUp);
  };
  if (timeoutMs !== undefined) later(timeoutMs, onTimeout);
  if (signal.aborted) onAbort();
  else signal.addEventListener('abort', onAbort, { once: true });
  return {
    killed: () => state.killed,
    timedOut: () => state.timedOut,
    dispose: () => {
      for (const timer of timers) clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
    },
  };
};

export { createStopper };
