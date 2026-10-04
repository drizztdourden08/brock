/* @layer electron-main @kind types */
import type { JobLogLevel, JobOptions, JobSnapshot, JobStepDef } from '@drizztdourden08/brock-core/types';

interface JobHandle {
  id: string;
  signal: AbortSignal;
  step: (stepId: string, line?: string) => void;
  progress: (fraction: number, line?: string) => void;
  line: (text: string) => void;
  log: (message: string, level?: JobLogLevel) => void;
  skip: (stepId: string) => void;
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
}

type EmitJob = (snapshot: JobSnapshot) => void;

export type { EmitJob, JobHandle, JobRecord, JobRegistry, StartJob };
