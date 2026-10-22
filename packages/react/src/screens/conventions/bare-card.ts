/* @layer renderer-shell @kind logic */
import type { ScreenDef } from '../screen.type';
import type { BaseEntry, CardEntry } from './screen-tree.type';

const bareCard = (entry: CardEntry | BaseEntry): Pick<ScreenDef, 'bare' | 'header' | 'size'> =>
  (entry.kind === 'card' && entry.meta?.bare === true ? { bare: true, header: 'own', size: undefined } : {});

export { bareCard };
