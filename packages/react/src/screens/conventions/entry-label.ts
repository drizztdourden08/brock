/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { EntryBase } from './screen-tree.type';
import { titleCase } from './title-case';

const entryLabel = (entry: EntryBase): Text => entry.meta?.title ?? titleCase(entry.id);

export { entryLabel };
