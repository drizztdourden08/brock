/* @layer renderer-shell @kind logic */
import type { EntryBase } from './screen-tree.type';
import { titleCase } from './title-case';

const entryLabel = (entry: EntryBase): string => entry.meta?.title ?? titleCase(entry.id);

export { entryLabel };
