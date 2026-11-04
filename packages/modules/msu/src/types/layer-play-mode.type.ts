/* @layer core @kind types */
type LayerPlayMode =
  | { kind: 'once' }
  | {
    kind: 'loop';
    order: 'sequential' | 'random' | 'single';
    crossfadeSeconds?: number;
  }
  | {
    kind: 'random';
    minDelaySeconds: number;
    maxDelaySeconds: number;
    waitForCompletion?: boolean;
  }
  | { kind: 'interval'; atSeconds: number[] };

export type { LayerPlayMode };
