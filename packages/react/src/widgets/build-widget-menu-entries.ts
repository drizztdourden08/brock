/* @layer renderer-shell @kind logic */
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { MenuItem } from '../menu/menu.type';
import { byOrder } from '../screens/conventions/by-order';
import { UNORDERED } from '../screens/conventions/screens.constants';
import { menuPlacementOf } from './menu-placement-of';
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
    .map((def) => ({ def, order: def.order ?? UNORDERED, label: def.label }))
    .sort(byOrder)
    .map(({ def }) => ({
      key: `${WIDGET_KEY_PREFIX}${def.id}`,
      label: def.label,
      icon: def.icon,
      checked: isWidgetOpen(layout, def.id),
      onClick: () => toggle(def.id),
      ...(def.devOnly === true ? { devOnly: true } : {}),
      ...menuPlacementOf(def.menu),
    }));

export { buildWidgetMenuEntries };
