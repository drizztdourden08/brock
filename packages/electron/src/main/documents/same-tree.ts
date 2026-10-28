/* @layer electron-main @kind logic */
import { LIST_LIMITS } from './list-limits.constants';
import { treeEntries } from './tree-entries';
import type { TreeEntry } from './tree-entries.type';

const keyOf = (entry: TreeEntry): string => `${entry.folder ? 'd' : 'f'}:${entry.rel}`;

const sameTree = async (source: string, staged: TreeEntry[]): Promise<boolean> => {
  const now = await treeEntries(source, LIST_LIMITS.entries);
  const known = new Set(staged.map(keyOf));
  return now.length === staged.length && now.every((entry) => known.has(keyOf(entry)));
};

export { sameTree };
