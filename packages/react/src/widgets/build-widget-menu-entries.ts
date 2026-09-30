/* @layer renderer-shell @kind logic */
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { MenuItem } from '../menu/menu.type';
import { WIDGET_KEY_PREFIX } from './widget.constants';
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
      key: `${WIDGET_KEY_PREFIX}${def.id}`,
      label: def.label,
      icon: def.icon,
      checked: isWidgetOpen(layout, def.id),
      onClick: () => toggle(def.id),
    }));

export { buildWidgetMenuEntries };
