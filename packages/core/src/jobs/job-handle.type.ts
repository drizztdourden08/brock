/* @layer core @kind types */
import type { JobLogLevel, JobLogLine, JobOptions, JobSnapshot, JobState, JobStepDef } from '../types/job.type';

interface JobHandle {
  id: string;
  signal: AbortSignal;
  started: Promise<void>;
  ended: Promise<JobState>;
  step: (stepId: string, line?: string) => void;
  progress: (fraction: number, line?: string) => void;
  line: (text: string) => void;
  log: (message: string, level?: JobLogLevel) => void;
  skip: (stepId: string) => void;
  setCancellable: (on: boolean) => void;
  done: (line?: string) => void;
  fail: (error: unknown) => void;
  run: <T>(work: (job: JobHandle) => Promise<T>) => Promise<T>;
}

type StartJob = (id: string, steps: readonly JobStepDef[], options?: JobOptions) => JobHandle;

interface JobRegistry {
  start: StartJob;
  list: () => JobSnapshot[];
  cancel: (id: string) => void;
  dismiss: (id: string) => void;
}

interface JobRecord {
  snapshot: JobSnapshot;
  controller: AbortController;
  notify: (urgent: boolean) => void;
  forward: ((line: JobLogLine) => void) | null;
  ended: Promise<JobState>;
  outcome: Promise<unknown> | null;
}

type EmitJob = (snapshot: JobSnapshot) => void;

type JobLogSink = (jobId: string, line: JobLogLine) => void;

interface JobRecordInput {
  id: string;
  steps: readonly JobStepDef[];
  options: JobOptions;
  at: number;
  controller: AbortController;
  emit: EmitJob;
  sink: JobLogSink | undefined;
  onEnd: () => void;
}

interface JobEntry {
  record: JobRecord;
  handle: JobHandle;
}

interface QueuedJobHandle {
  handle: JobHandle;
  attach: (job: JobHandle) => void;
}

export type { EmitJob, JobEntry, JobHandle, JobLogSink, JobRecord, JobRecordInput, JobRegistry, QueuedJobHandle, StartJob };
