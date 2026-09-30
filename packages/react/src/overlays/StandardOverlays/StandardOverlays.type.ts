/* @layer renderer-shell @kind types */
import type { MenuEntry } from '../../menu/menu.type';
import type { SearchAction } from '../../search/search.type';
import type { WidgetDef } from '../../widgets/widget.type';

interface StandardOverlaysProps {
  menu: readonly MenuEntry[];
  actions?: readonly SearchAction[];
  widgets?: readonly WidgetDef[];
}

export type { StandardOverlaysProps };
