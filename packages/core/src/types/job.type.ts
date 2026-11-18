/* @layer core @kind types */
import type { Text } from '../i18n/text.type';
type JobStepState = 'upcoming' | 'current' | 'done' | 'failed' | 'skipped';

type JobState = 'running' | 'done' | 'failed' | 'cancelled';

type JobLogLevel = 'info' | 'warn' | 'error';

interface JobStepDef {
  id: string;
  label: Text;
  weight?: number;
}

interface JobStepWire {
  id: string;
  label: Text;
  weight: number;
  state: JobStepState;
}

interface JobLogLine {
  at: number;
  level: JobLogLevel;
  message: string;
}

type JobDuplicatePolicy = 'throw' | 'queue' | 'parallel' | 'join';

interface JobOptions {
  title?: Text;
  cancellable?: boolean;
  visible?: boolean;
  forwardLog?: boolean;
  onDuplicate?: JobDuplicatePolicy;
}

interface JobSnapshot {
  id: string;
  title: Text;
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
  visible: boolean;
}

export type { JobDuplicatePolicy, JobLogLevel, JobLogLine, JobOptions, JobSnapshot, JobState, JobStepDef, JobStepState, JobStepWire };
