/* @layer electron-main @kind logic */
import type { JobLogLevel, JobSnapshot, JobStepState } from '@drizztdourden08/brock-core/types';
import { jobProgress } from './job-progress';
import type { JobHandle, JobRecord } from './job.type';
import { JOB_LOG_LIMIT } from './jobs.constants';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const setStep = (snapshot: JobSnapshot, id: string, state: JobStepState): void => {
  const step = snapshot.steps.find((entry) => entry.id === id);
  if (step) step.state = state;
};

const settleCurrent = (snapshot: JobSnapshot, state: JobStepState): void => {
  for (const step of snapshot.steps) if (step.state === 'current') step.state = state;
};

const appendLog = (snapshot: JobSnapshot, message: string, level: JobLogLevel, at: number): void => {
  snapshot.log.push({ at, level, message });
  if (snapshot.log.length > JOB_LOG_LIMIT) snapshot.log.splice(0, snapshot.log.length - JOB_LOG_LIMIT);
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
    log: (message, level = 'info') => change(level === 'error', () => appendLog(snapshot, message, level, now())),
    skip: (stepId) => change(true, () => setStep(snapshot, stepId, 'skipped')),
    done: (line) => change(true, () => {
      if (line !== undefined) snapshot.line = line;
      finish(snapshot, 'done', now());
    }),
    fail: (error) => change(true, () => {
      snapshot.error = messageOf(error);
      appendLog(snapshot, snapshot.error, 'error', now());
      finish(snapshot, 'failed', now());
    }),
    run: async (work) => {
      try {
        const result = await work(handle);
        handle.done();
        return result;
      } catch (err) {
        if (!controller.signal.aborted) handle.fail(err);
        throw err;
      }
    },
  };
  return handle;
};

export { createJobHandle };
