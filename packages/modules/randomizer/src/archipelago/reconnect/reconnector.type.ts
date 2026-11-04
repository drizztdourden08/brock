/* @layer core @kind types */
interface Reconnector {
  readonly pending: boolean;
  schedule(): void;
  cancel(): void;
  stop(): void;
  reset(): void;
}

type ScheduledListener = (delayMs: number, attempt: number) => void;

export type { Reconnector, ScheduledListener };
