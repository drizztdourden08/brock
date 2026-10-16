/* @layer renderer-app @kind types */
interface InspectPoint {
  x: number;
  y: number;
}

interface InspectSize {
  width: number;
  height: number;
}

interface InspectState {
  grid: number;
  centre: boolean;
  pointer: InspectPoint | null;
  view: InspectSize | null;
  setGrid: (grid: number) => void;
  setCentre: (centre: boolean) => void;
  track: (pointer: InspectPoint | null, view: InspectSize) => void;
  reset: () => void;
}

export type { InspectState };
