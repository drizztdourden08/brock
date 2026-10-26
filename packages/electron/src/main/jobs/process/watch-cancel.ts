/* @layer electron-main @kind logic */
import { PROCESS_GIVE_UP_MS } from './process-job.constants';
import { killProcessTree } from './kill-process-tree';
import type { CancelWatch } from './process-job.type';

const watchCancel = ({ pid, signal, graceMs, giveUp }: CancelWatch): (() => void) => {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const onAbort = (): void => {
    killProcessTree(pid, false);
    timers.push(setTimeout(() => killProcessTree(pid, true), graceMs));
    timers.push(setTimeout(giveUp, graceMs + PROCESS_GIVE_UP_MS));
  };
  if (signal.aborted) onAbort();
  else signal.addEventListener('abort', onAbort, { once: true });
  return () => {
    for (const timer of timers) clearTimeout(timer);
    signal.removeEventListener('abort', onAbort);
  };
};

export { watchCancel };
