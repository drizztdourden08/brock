/* @layer renderer-shell @kind types */
type Found<T> = T | null | undefined | false;

type WakeSource = (wake: () => void) => () => void;

interface AwaitOptions {
  what: string;
  ceilingMs?: number;
  wakeOn?: readonly WakeSource[];
  report?: boolean;
}

export type { AwaitOptions, Found, WakeSource };
