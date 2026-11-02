/* @layer renderer-shell @kind types */
import type { DocumentDropKind, DocumentEntry } from '@drizztdourden08/brock-core';

interface RejectedFile {
  name: string;
  reason: string;
}

interface DroppedPath {
  path: string;
  name: string;
  kind: DocumentDropKind;
}

interface PathDrop {
  origin: 'os' | 'app';
  paths: readonly DroppedPath[];
  rejected: readonly RejectedFile[];
  entries: readonly DocumentEntry[];
  truncated: boolean;
}

interface PathDropExpand {
  recursive?: boolean;
  extensions?: readonly string[];
}

interface PathDropOptions {
  extensions?: readonly string[];
  expand?: PathDropExpand;
}

interface FileListDragOptions {
  paths: () => readonly DroppedPath[];
  disabled?: boolean | (() => boolean);
}

interface WindowFileDropOptions {
  paths?: PathDropOptions;
  canDrop?: (drop: PathDrop) => boolean;
}

export type { DroppedPath, FileListDragOptions, PathDrop, PathDropExpand, PathDropOptions, RejectedFile, WindowFileDropOptions };
