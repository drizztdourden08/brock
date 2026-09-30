/* @layer core @kind logic */
import type { BootOutcome, BootTask, BootTaskRun } from './boot-task.type';
import { DEFAULT_BOOT_TIMEOUT_MS } from './boot.constants';
import { bootTimeoutError } from './boot-timeout-error';

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

const whenAborted = (signal: AbortSignal): Promise<never> =>
  new Promise((_resolve, reject) => {
    if (signal.aborted) reject(signal.reason);
    else signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  });

const runBootTask = async <X extends object>(task: BootTask<X>, { extras, stop, report }: BootTaskRun<X>): Promise<BootOutcome> => {
  const timeoutMs = task.timeoutMs ?? DEFAULT_BOOT_TIMEOUT_MS;
  const own = new AbortController();
  const abort = (): void => own.abort(stop.reason);
  stop.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => own.abort(bootTimeoutError(task.label, timeoutMs)), timeoutMs);
  const reportOwn = (fraction: number, detail?: string): void => {
    if (!own.signal.aborted) report(fraction, detail ?? null);
  };
  try {
    const work = Promise.resolve().then(() => task.run({ ...extras(), report: reportOwn, signal: own.signal }));
    await Promise.race([work, whenAborted(own.signal)]);
    return { ok: true };
  } catch (err) {
    const reason: unknown = own.signal.aborted ? own.signal.reason : err;
    const timedOut = reason instanceof Error && reason.name === 'BootTimeoutError';
    return { ok: false, failure: { task: task.id, label: task.label, message: messageOf(reason), timedOut } };
  } finally {
    clearTimeout(timer);
    stop.removeEventListener('abort', abort);
  }
};

export { runBootTask };
