/* @layer renderer-shell @kind types */
interface FrameLoopOptions {
  fps: number;
  step: () => void;
  afterSteps?: () => void;
}

interface FrameLoop {
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

export type { FrameLoopOptions, FrameLoop, FramePresenter, FrameSize };
