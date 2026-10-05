/* @layer renderer-shell @kind logic */
import { frameOf } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { DEFAULT_CONTEXT } from '../contexts/contexts.constants';
import type { WidgetDef } from './widget.type';

const outOfContext = (layout: WidgetLayout, definitions: readonly WidgetDef[], isActive: (name: string) => boolean): string[] =>
  definitions
    .filter((def) => frameOf(layout, def.id, def).show === 'context-only' && !isActive(def.context ?? DEFAULT_CONTEXT))
    .map((def) => def.id);

export { outOfContext };
