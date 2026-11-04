/* @layer core @kind types */
interface TrackerAssumption {
  id: string;
  label: string;
  initial: boolean;
  hint?: string;
}

export type { TrackerAssumption };
