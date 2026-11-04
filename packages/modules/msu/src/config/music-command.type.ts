/* @layer core @kind types */
type MusicCommand =
  | { kind: 'track'; track: number }
  | { kind: 'fade'; target: number; step: number }
  | { kind: 'ignore' };

export type { MusicCommand };
