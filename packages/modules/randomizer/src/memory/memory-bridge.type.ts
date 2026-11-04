/* @layer core @kind types */
import type { MemoryView } from './memory-view.type';

interface MemoryBridge {
  view(): MemoryView | null;
  onStateLoaded?(cb: () => void): () => void;
}

export type { MemoryBridge };
