/* @layer renderer-shell @kind types */
interface RollProgressState {
  fraction: number | null;
  report(fraction: number | null): void;
}

export type { RollProgressState };
