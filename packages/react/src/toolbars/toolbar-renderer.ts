/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { ToolbarSlot } from '@drizztdourden08/tessera/composites';
import type { ToolbarDef } from './toolbar.type';
import { ToolbarZone } from './ToolbarZone';

const toolbarRenderer = (toolbars: readonly ToolbarDef[]) => (id: string, slot: ToolbarSlot): ReactNode => {
  const drawn = toolbars.find((toolbar) => toolbar.id === id)?.render(slot) ?? null;
  return drawn === null ? null : createElement(ToolbarZone, { id, children: drawn });
};

export { toolbarRenderer };
