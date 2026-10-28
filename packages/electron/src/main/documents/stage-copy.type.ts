/* @layer electron-main @kind types */
import type { TreeEntry } from './tree-entries.type';

interface StagedCopy {
  temp: string;
  entries: TreeEntry[];
}

export type { StagedCopy };
