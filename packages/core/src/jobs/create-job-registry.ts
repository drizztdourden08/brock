/* @layer core @kind logic */
import type { JobOptions, JobStepDef } from '../types/job.type';
import { createJobHandle } from './create-job-handle';
import { createJobRecord } from './create-job-record';
import { createQueuedHandle } from './create-queued-handle';
import type { EmitJob, JobEntry, JobHandle, JobLogSink, JobRegistry } from './job-handle.type';
import { joinJobHandle } from './join-job-handle';

const createJobRegistry = (emit: EmitJob, now: () => number = Date.now, sink?: JobLogSink): JobRegistry => {
  const entries = new Map<string, JobEntry>();
  const waiting = new Map<string, (() => void)[]>();
  const running = (id: string): boolean => entries.get(id)?.record.snapshot.state === 'running';
  const busy = (id: string): boolean => running(id) || waiting.has(id);
  const next = (id: string): void => {
    const queue = waiting.get(id);
    const begin = queue?.shift();
    if (queue?.length === 0) waiting.delete(id);
    begin?.();
  };
  const open = (id: string, steps: readonly JobStepDef[], options: JobOptions, controller = new AbortController()): JobHandle => {
    const record = createJobRecord({ id, steps, options, at: now(), controller, emit, sink, onEnd: () => next(id) });
    const handle = createJobHandle(record, now);
    entries.set(id, { record, handle });
    record.notify(true);
    return handle;
  };
  const enqueue = (id: string, steps: readonly JobStepDef[], options: JobOptions): JobHandle => {
    const controller = new AbortController();
    const queued = createQueuedHandle(id, controller.signal);
    waiting.set(id, [...(waiting.get(id) ?? []), () => queued.attach(open(id, steps, options, controller))]);
    return queued.handle;
  };
  const freeId = (id: string): string => {
    let n = 2;
    while (busy(`${id}-${n}`)) n += 1;
    return `${id}-${n}`;
  };
  const duplicate = (id: string, steps: readonly JobStepDef[], options: JobOptions): JobHandle => {
    const policy = options.onDuplicate ?? 'throw';
    const entry = entries.get(id);
    if (policy === 'queue') return enqueue(id, steps, options);
    if (policy === 'parallel') return open(freeId(id), steps, { ...options, title: options.title ?? id });
    if (policy === 'join' && entry) return joinJobHandle(entry.handle, entry.record);
    throw new Error(`job "${id}" is already running`);
  };
  const start: JobRegistry['start'] = (id, steps, options = {}) =>
    busy(id) ? duplicate(id, steps, options) : open(id, steps, options);
  const cancel = (id: string): void => {
    const record = entries.get(id)?.record;
    if (record?.snapshot.state !== 'running' || !record.snapshot.cancellable) return;
    record.snapshot.state = 'cancelled';
    record.snapshot.endedAt = now();
    for (const step of record.snapshot.steps) if (step.state === 'current') step.state = 'failed';
    record.controller.abort(new Error('cancelled'));
    record.notify(true);
  };
  const dismiss = (id: string): void => {
    if (!running(id)) entries.delete(id);
  };
  return { start, list: () => [...entries.values()].map((entry) => entry.record.snapshot), cancel, dismiss };
};

export { createJobRegistry };
