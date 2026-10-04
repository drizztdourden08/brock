/* @layer core @kind types */
type JobStepState = 'upcoming' | 'current' | 'done' | 'failed' | 'skipped';

type JobState = 'running' | 'done' | 'failed' | 'cancelled';

type JobLogLevel = 'info' | 'warn' | 'error';

interface JobStepDef {
  id: string;
  label: string;
  weight?: number;
}

interface JobStepWire {
  id: string;
  label: string;
  weight: number;
  state: JobStepState;
}

interface JobLogLine {
  at: number;
  level: JobLogLevel;
  message: string;
}

interface JobOptions {
  title?: string;
  cancellable?: boolean;
}

interface JobSnapshot {
  id: string;
  title: string;
  state: JobState;
  steps: JobStepWire[];
  currentStep: string | null;
  progress: number;
  stepProgress: number;
  line: string | null;
  error: string | null;
  log: JobLogLine[];
  startedAt: number;
  endedAt: number | null;
  cancellable: boolean;
}

export type { JobLogLevel, JobLogLine, JobOptions, JobSnapshot, JobState, JobStepDef, JobStepState, JobStepWire };
