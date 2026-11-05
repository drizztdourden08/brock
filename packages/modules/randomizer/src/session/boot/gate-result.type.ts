/* @layer core @kind types */
type GateResult = { ok: true } | { ok: false; reason: string; detail: string };

export type { GateResult };
