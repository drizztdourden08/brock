/* @layer core @kind logic */
import type { JobHandle, QueuedJobHandle } from './job-handle.type';

const createQueuedHandle = (id: string, signal: AbortSignal): QueuedJobHandle => {
  let inner: JobHandle | null = null;
  let attachInner: (job: JobHandle) => void = () => undefined;
  const ready = new Promise<JobHandle>((resolve) => { attachInner = resolve; });
  const handle: JobHandle = {
    id,
    signal,
    started: ready.then(() => undefined),
    ended: ready.then((job) => job.ended),
    step: (stepId, line) => inner?.step(stepId, line),
    progress: (fraction, line) => inner?.progress(fraction, line),
    line: (text) => inner?.line(text),
    log: (message, level) => inner?.log(message, level),
    skip: (stepId) => inner?.skip(stepId),
    setCancellable: (on) => inner?.setCancellable(on),
    done: (line) => inner?.done(line),
    fail: (error) => inner?.fail(error),
    run: async (work) => (await ready).run(work),
  };
  const attach = (job: JobHandle): void => {
    inner = job;
    attachInner(job);
  };
  return { handle, attach };
};

export { createQueuedHandle };
