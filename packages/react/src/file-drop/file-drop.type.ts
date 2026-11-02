/* @layer renderer-shell @kind types */
import type { DroppedPath, PathDrop, RejectedFile } from '../dnd';

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

interface ReadResult {
  reads: FileDropRead[];
  rejected: RejectedFile[];
}

interface Selection {
  paths: DroppedPath[];
  rejected: RejectedFile[];
}

export type { FileDrop, FileDropOptions, FileDropRead, ReadResult, Selection };
