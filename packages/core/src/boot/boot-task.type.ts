/* @layer core @kind types */
type BootReport = (fraction: number, detail?: string) => void;

interface BootTaskBaseContext {
  report: BootReport;
  signal: AbortSignal;
}

type BootTaskContext<X extends object = object> = BootTaskBaseContext & X;

interface BootTaskDef<X extends object = object> {
  label: string;
  weight?: number;
  after?: string[];
  timeoutMs?: number;
  run: (ctx: BootTaskContext<X>) => Promise<void> | void;
}

interface BootTask<X extends object = object> extends BootTaskDef<X> {
  id: string;
}

interface BootProgress {
  done: number;
  total: number;
  label: string;
  detail: string | null;
}

interface BootFailure {
  task: string;
  label: string;
  message: string;
  timedOut: boolean;
}

type BootOutcome = { ok: true } | { ok: false; failure: BootFailure };

interface BootRunOptions<X extends object> {
  extras: () => X;
  onProgress?: (progress: BootProgress) => void;
  onTaskDone?: (id: string) => void;
  signal?: AbortSignal;
}

interface BootTaskRun<X extends object> {
  extras: () => X;
  stop: AbortSignal;
  report: (fraction: number, detail: string | null) => void;
}

interface BootTimeline {
  bootDoneAt: number | null;
  appShownAt: number | null;
  splashClosedAt: number | null;
  splashOpenAtCapture: boolean | null;
}

export type {
  BootFailure, BootOutcome, BootProgress, BootReport, BootRunOptions, BootTask, BootTaskBaseContext, BootTaskContext, BootTaskDef,
  BootTaskRun, BootTimeline,
};
