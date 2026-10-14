/* @layer core @kind types */
import type { JobLogLevel, JobStepDef } from '@drizztdourden08/brock-core/types';

interface AssetStepReport {
  progress: (fraction: number, line?: string) => void;
  line: (text: string) => void;
  log: (message: string, level?: JobLogLevel) => void;
}

type AssetWorkerStep = (input: unknown, report: AssetStepReport) => unknown;

type AssetWorkerSteps = Record<string, AssetWorkerStep>;

interface AssetWorkerStepDef extends JobStepDef {
  input?: unknown;
}

type AssetWorkerRequest = { type: 'run'; step: string; input: unknown };

type AssetWorkerMessage =
  | { type: 'progress'; step: string; fraction: number; line?: string }
  | { type: 'line'; step: string; text: string }
  | { type: 'log'; step: string; message: string; level?: JobLogLevel }
  | { type: 'done'; step: string; result: unknown }
  | { type: 'error'; step: string; message: string };

export type { AssetStepReport, AssetWorkerStep, AssetWorkerSteps, AssetWorkerStepDef, AssetWorkerRequest, AssetWorkerMessage };
