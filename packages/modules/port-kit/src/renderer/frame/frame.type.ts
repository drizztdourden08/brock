/* @layer renderer-shell @kind types */
interface FrameLoopOptions {
  fps: number;
  step: () => void;
  afterSteps?: () => void;
  schedule?: FrameSchedule;
}

type FrameSchedule = 'display' | 'timer';

interface FrameLoop {
  setSchedule: (mode: FrameSchedule) => void;
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
}

interface FramePresenter {
  present: (rgba: Uint8Array) => void;
  capture: () => Promise<Blob | null>;
}

interface FrameSize {
  width: number;
  height: number;
}

export type { FrameSchedule, FrameLoopOptions, FrameLoop, FramePresenter, FrameSize };
