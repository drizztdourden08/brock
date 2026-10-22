/* @layer renderer-shell @kind logic */
import { WINDOW_FLAT_GROUP } from './window.constants';
import type { WindowDef, WindowGroup } from './window.type';

const groupsOf = (def: WindowDef): readonly WindowGroup[] => [
  ...(def.items === undefined || def.items.length === 0 ? [] : [{ id: WINDOW_FLAT_GROUP, items: def.items }]),
  ...(def.groups ?? []),
];

export { groupsOf };
