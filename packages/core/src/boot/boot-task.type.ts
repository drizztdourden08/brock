/* @layer core @kind types */
import type { Text } from '../i18n/text.type';

type BootReport = (fraction: number, detail?: string) => void;

interface BootTaskBaseContext {
  report: BootReport;
  signal: AbortSignal;
}

type BootTaskContext<X extends object = object> = BootTaskBaseContext & X;

interface BootTaskDef<X extends object = object> {
  label: Text;
  weight?: number;
  after?: string[];
  timeoutMs?: number;
  run: (ctx: BootTaskContext<X>) => Promise<void> | void;
}

interface BootTask<X extends object = object> extends BootTaskDef<X> {
  id: string;
}

type BootTaskNamed<X extends object = object> = Omit<BootTask<X>, 'label'> & { label: string };

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

interface BootTaskEvent {
  id: string;
  label: string;
  state: 'start' | 'done' | 'fail';
  ms: number;
  message?: string;
}

interface BootRunOptions<X extends object> {
  extras: () => X;
  onProgress?: (progress: BootProgress) => void;
  onTaskEvent?: (event: BootTaskEvent) => void;
  onTaskDone?: (id: string) => void;
  signal?: AbortSignal;
  defaultTimeoutMs?: number;
  text?: (value: Text) => string;
}

interface BootTaskRun<X extends object> {
  extras: () => X;
  stop: AbortSignal;
  defaultTimeoutMs?: number;
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
  BootTaskEvent, BootTaskNamed, BootTaskRun, BootTimeline,
};
