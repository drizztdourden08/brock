/* @layer renderer-shell @kind types */
import type { PathDrop } from '../dnd';

interface FileDropRead {
  path: string;
  data: ArrayBuffer | string;
}

interface FileDrop extends PathDrop {
  reads: readonly FileDropRead[];
}

interface FileDropOptions {
  extensions?: readonly string[];
  read?: 'bytes' | 'text' | false;
  max?: number;
  onDrop: (drop: FileDrop) => void;
}

export type { FileDrop, FileDropOptions, FileDropRead };
