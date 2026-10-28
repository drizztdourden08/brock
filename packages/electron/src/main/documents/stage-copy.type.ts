/* @layer electron-main @kind types */
import type { CopiedFile } from './copied-file.type';
import type { TreeEntry } from './tree-entries.type';

interface StagedCopy {
  staging: string;
  entries: TreeEntry[];
  files: Map<string, CopiedFile>;
}

export type { StagedCopy };
