/* @layer core @kind logic */
import type { JobLogLevel, JobSnapshot, JobStepState } from '../types/job.type';
import { jobProgress } from './job-progress';
import type { JobHandle, JobRecord } from './job-handle.type';
import { JOB_LOG_LIMIT } from './jobs.constants';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const setStep = (snapshot: JobSnapshot, id: string, state: JobStepState): void => {
  const step = snapshot.steps.find((entry) => entry.id === id);
  if (step) step.state = state;
};

const settleCurrent = (snapshot: JobSnapshot, state: JobStepState): void => {
  for (const step of snapshot.steps) if (step.state === 'current') step.state = state;
};

const appendLog = (record: JobRecord, message: string, level: JobLogLevel, at: number): void => {
  const { snapshot } = record;
  const entry = { at, level, message };
  snapshot.log.push(entry);
  if (snapshot.log.length > JOB_LOG_LIMIT) snapshot.log.splice(0, snapshot.log.length - JOB_LOG_LIMIT);
  record.forward?.(entry);
};

const finish = (snapshot: JobSnapshot, state: 'done' | 'failed', at: number): void => {
  snapshot.state = state;
  snapshot.endedAt = at;
  if (state === 'done') {
    for (const step of snapshot.steps) if (step.state === 'current' || step.state === 'upcoming') step.state = 'done';
    snapshot.progress = 1;
  } else {
    settleCurrent(snapshot, 'failed');
  }
};

const runWork = async <T>(handle: JobHandle, signal: AbortSignal, work: (job: JobHandle) => Promise<T>): Promise<T> => {
  try {
    const result = await work(handle);
    handle.done();
    return result;
  } catch (err) {
    if (!signal.aborted) handle.fail(err);
    throw err;
  }
};

const createJobHandle = (record: JobRecord, now: () => number = Date.now): JobHandle => {
  const { snapshot, controller, notify } = record;
  const live = (): boolean => snapshot.state === 'running';
  const change = (urgent: boolean, apply: () => void): void => {
    if (!live()) return;
    apply();
    snapshot.progress = snapshot.state === 'running' ? jobProgress(snapshot.steps, snapshot.stepProgress) : snapshot.progress;
    notify(urgent);
  };
  const handle: JobHandle = {
    id: snapshot.id,
    signal: controller.signal,
    started: Promise.resolve(),
    ended: record.ended,
    step: (stepId, line) => change(true, () => {
      settleCurrent(snapshot, 'done');
      setStep(snapshot, stepId, 'current');
      snapshot.currentStep = stepId;
      snapshot.stepProgress = 0;
      if (line !== undefined) snapshot.line = line;
    }),
    progress: (fraction, line) => change(false, () => {
      snapshot.stepProgress = Math.min(1, Math.max(0, fraction));
      if (line !== undefined) snapshot.line = line;
    }),
    line: (text) => change(false, () => { snapshot.line = text; }),
    log: (message, level = 'info') => change(level === 'error', () => appendLog(record, message, level, now())),
    skip: (stepId) => change(true, () => setStep(snapshot, stepId, 'skipped')),
    setCancellable: (on) => change(true, () => { snapshot.cancellable = on; }),
    done: (line) => change(true, () => {
      if (line !== undefined) snapshot.line = line;
      finish(snapshot, 'done', now());
    }),
    fail: (error) => change(true, () => {
      snapshot.error = messageOf(error);
      appendLog(record, snapshot.error, 'error', now());
      finish(snapshot, 'failed', now());
    }),
    run: (work) => {
      const outcome = runWork(handle, controller.signal, work);
      record.outcome = outcome;
      return outcome;
    },
  };
  return handle;
};

export { createJobHandle };
