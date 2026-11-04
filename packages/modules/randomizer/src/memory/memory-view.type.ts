/* @layer core @kind types */
type MemoryView = {
  byte: (region: string, offset: number) => number;
  word: (region: string, offset: number) => number;
};

export type { MemoryView };
