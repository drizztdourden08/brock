/* @layer core @kind types */
interface FrameClock {
  onFrame(cb: () => void): () => void;
}

export type { FrameClock };
