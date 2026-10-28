/* @layer renderer-shell @kind types */
interface GateState {
  gates: Readonly<Record<string, Readonly<Record<string, boolean>>>>;
  views: Readonly<Record<string, Readonly<Record<string, string>>>>;
}

export type { GateState };
