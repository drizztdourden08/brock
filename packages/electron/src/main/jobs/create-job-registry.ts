/* @layer electron-main @kind logic */
import type { JobOptions, JobSnapshot, JobStepDef } from '@drizztdourden08/brock-core/types';
import { createJobHandle } from './create-job-handle';
import type { EmitJob, JobRecord, JobRegistry } from './job.type';
import { JOB_EMIT_MS } from './jobs.constants';

const initialSnapshot = (id: string, steps: readonly JobStepDef[], options: JobOptions, at: number): JobSnapshot => ({
  id,
  title: options.title ?? id,
  state: 'running',
  steps: steps.map((step) => ({ id: step.id, label: step.label, weight: step.weight ?? 1, state: 'upcoming' })),
  currentStep: null,
  progress: 0,
  stepProgress: 0,
  line: null,
  error: null,
  log: [],
  startedAt: at,
  endedAt: null,
  cancellable: options.cancellable ?? true,
});

const createNotifier = (snapshot: JobSnapshot, emit: EmitJob): ((urgent: boolean) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const flush = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
    emit({ ...snapshot, steps: snapshot.steps.map((step) => ({ ...step })), log: [...snapshot.log] });
  };
  return (urgent) => {
    if (urgent) flush();
    else timer ??= setTimeout(flush, JOB_EMIT_MS);
  };
};

const createJobRegistry = (emit: EmitJob, now: () => number = Date.now): JobRegistry => {
  const records = new Map<string, JobRecord>();
  const start: JobRegistry['start'] = (id, steps, options = {}) => {
    if (records.get(id)?.snapshot.state === 'running') throw new Error(`job "${id}" is already running`);
    const snapshot = initialSnapshot(id, steps, options, now());
    const record: JobRecord = { snapshot, controller: new AbortController(), notify: createNotifier(snapshot, emit) };
    records.set(id, record);
    record.notify(true);
    return createJobHandle(record, now);
  };
  const cancel = (id: string): void => {
    const record = records.get(id);
    if (record?.snapshot.state !== 'running' || !record.snapshot.cancellable) return;
    record.snapshot.state = 'cancelled';
    record.snapshot.endedAt = now();
    for (const step of record.snapshot.steps) if (step.state === 'current') step.state = 'failed';
    record.controller.abort(new Error('cancelled'));
    record.notify(true);
  };
  const dismiss = (id: string): void => {
    if (records.get(id)?.snapshot.state !== 'running') records.delete(id);
  };
  return { start, list: () => [...records.values()].map((record) => record.snapshot), cancel, dismiss };
};

export { createJobRegistry };
