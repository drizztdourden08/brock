/* @layer renderer-shell @kind logic */
import { hideToolbar } from '@drizztdourden08/tessera/composites';
import type { ToolbarLayout } from '@drizztdourden08/tessera/composites';
import type { ToolbarDef } from '../toolbars/toolbar.type';
import type { FocusKeep } from './widget.type';

const toolbarsHidden = (layout: ToolbarLayout, definitions: readonly ToolbarDef[], keep: FocusKeep): ToolbarLayout =>
  definitions.reduce((next, def) => (keep.toolbars.includes(def.id) ? next : hideToolbar(next, def.id)), layout);

export { toolbarsHidden };
