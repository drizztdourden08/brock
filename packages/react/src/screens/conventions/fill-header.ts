/* @layer renderer-shell @kind logic */
import type { ScreenDef } from '../screen.type';
import type { BaseEntry, CardEntry } from './screen-tree.type';

const fillHeader = (entry: CardEntry | BaseEntry): Pick<ScreenDef, 'header'> =>
  (entry.kind !== 'base' && entry.meta?.fill === true && entry.meta.size !== 'info' ? { header: 'fill' } : {});

export { fillHeader };
