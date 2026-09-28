/* @layer renderer-shell @kind logic */
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { MenuItem } from '../menu/menu.type';
import type { WidgetDef } from './widget.type';

const buildWidgetMenuEntries = (
  definitions: readonly WidgetDef[],
  layout: WidgetLayout,
  toggle: (id: string) => void,
  isDev: boolean,
): MenuItem[] =>
  definitions
    .filter((def) => def.devOnly !== true || isDev)
    .map((def) => ({
      key: `widget-${def.id}`,
      label: def.label,
      icon: def.icon,
      checked: layout.widgets.some((w) => w.id === def.id && w.visible),
      onClick: () => toggle(def.id),
    }));

export { buildWidgetMenuEntries };
