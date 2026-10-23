/* @layer renderer-shell @kind types */
interface GateState {
  gates: Readonly<Record<string, Readonly<Record<string, boolean>>>>;
}

export type { GateState };
