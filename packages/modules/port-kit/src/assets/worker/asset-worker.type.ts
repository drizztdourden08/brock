/* @layer core @kind types */
import type { JobLogLevel, JobStepDef } from '@drizztdourden08/brock-core/types';

interface AssetStepReport {
  progress: (fraction: number, line?: string) => void;
  line: (text: string) => void;
  log: (message: string, level?: JobLogLevel) => void;
}

type AssetWorkerStep = (input: unknown, report: AssetStepReport, data: unknown) => unknown;

type AssetWorkerSteps = Record<string, AssetWorkerStep>;

interface AssetWorkerStepDef extends JobStepDef {
  input?: unknown;
}

type AssetWorkerRequest = { type: 'run'; step: string; input: unknown } | { type: 'data'; data: unknown };

type AssetWorkerMessage =
  | { type: 'progress'; step: string; fraction: number; line?: string }
  | { type: 'line'; step: string; text: string }
  | { type: 'log'; step: string; message: string; level?: JobLogLevel }
  | { type: 'done'; step: string; result: unknown }
  | { type: 'error'; step: string; message: string };

interface AssetWorkerPort {
  run: (request: AssetWorkerRequest) => void;
  listen: (onMessage: (message: AssetWorkerMessage) => void, onFailure: (error: Error) => void) => () => void;
  terminate: () => Promise<void>;
}

interface AssetStepChannel {
  post: (message: AssetWorkerMessage, transfer: ArrayBuffer[]) => void;
  listen: (onRequest: (request: AssetWorkerRequest) => void) => void;
}

interface AssetJobOptions {
  id: string;
  title?: string;
  steps: AssetWorkerStepDef[];
  cancellable?: boolean;
  onResult?: (step: string, result: unknown) => void | Promise<void>;
}

export type {
  AssetStepReport, AssetWorkerStep, AssetWorkerSteps, AssetWorkerStepDef, AssetWorkerRequest, AssetWorkerMessage, AssetWorkerPort, AssetStepChannel,
  AssetJobOptions,
};
