/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import type { ToolbarSlot } from '@drizztdourden08/tessera/composites';
import type { ToolbarDef } from './toolbar.type';

const toolbarRenderer = (toolbars: readonly ToolbarDef[]) => (id: string, slot: ToolbarSlot): ReactNode =>
  toolbars.find((toolbar) => toolbar.id === id)?.render(slot) ?? null;

export { toolbarRenderer };
