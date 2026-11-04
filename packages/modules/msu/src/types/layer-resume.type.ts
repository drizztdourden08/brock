/* @layer core @kind types */
interface LayerResume {
  fileIndex: number;
  offsetSeconds: number;
  nextEventInSeconds: number | null;
}

export type { LayerResume };
