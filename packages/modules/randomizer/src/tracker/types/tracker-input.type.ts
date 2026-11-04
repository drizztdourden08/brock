/* @layer core @kind types */
interface TrackerInput<P = unknown> {
  placement: P;
  checked: ReadonlySet<string>;
  completed: ReadonlySet<string>;
  held: readonly string[];
  assumed: ReadonlySet<string>;
}

export type { TrackerInput };
