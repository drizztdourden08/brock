/* @layer renderer-shell @kind logic */
import { getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import { kitRoute } from './kits/kit-route';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import type { WidgetDef } from './widget.type';

const knownWidget = (id: string): WidgetDef => {
  const { definitions } = useWidgetLayoutStore.getState();
  const found = getWidgetDefinition(definitions, id);
  if (found) return found;
  if (kitRoute.isMember(id)) throw new Error(`Widget "${id}" belongs to a widget kit; this call only reaches the normal layout.`);
  throw new Error(`Unknown widget "${id}". Known widgets: ${definitions.map((def) => def.id).join(', ') || 'none'}.`);
};

export { knownWidget };
