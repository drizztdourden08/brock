/* @layer renderer-shell @kind logic */
import type { CardEntry, ScreenEntry } from './screen-tree.type';

const isCardEntry = (entry: ScreenEntry): entry is CardEntry => entry.kind === 'card' || entry.kind === 'layer';

export { isCardEntry };
