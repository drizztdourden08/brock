/* @layer electron-main @kind types */
import type { TreeEntry } from './tree-entries.type';

interface StagedCopy {
  staging: string;
  entries: TreeEntry[];
}

export type { StagedCopy };
