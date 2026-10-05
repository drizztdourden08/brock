/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import type { CommandPaletteGroup } from '@drizztdourden08/tessera/composites';
import type { PaletteItem } from '../PaletteHost.type';

const withConfirmActions = (
  groups: readonly CommandPaletteGroup<PaletteItem>[],
  action: (item: PaletteItem) => ReactNode,
): CommandPaletteGroup<PaletteItem>[] =>
  groups.map((group) => ({ ...group, items: group.items.map((item) => (item.confirm === undefined ? item : { ...item, action: action(item) })) }));

export { withConfirmActions };
