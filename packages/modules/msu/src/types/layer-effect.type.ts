/* @layer core @kind types */
type LayerEffect =
  | { kind: 'lowpass'; frequencyHz: number }
  | { kind: 'highpass'; frequencyHz: number }
  | { kind: 'eq'; lowDb: number; midDb: number; highDb: number };

export type { LayerEffect };
