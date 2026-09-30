/* @layer renderer-shell @kind logic */
import { UNORDERED } from './screens.constants';
import type { EntryBase } from './screen-tree.type';

const entryOrder = (entry: EntryBase): number => entry.meta?.order ?? UNORDERED;

export { entryOrder };
