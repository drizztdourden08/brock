/* @layer core @kind types */
import type { MemoryView } from '../../memory/memory-view.type';

type CheckSignal = {
  subscribe(fn: (view: MemoryView | null) => void): () => void;
  notify(view: MemoryView | null): void;
};

export type { CheckSignal };
