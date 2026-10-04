/* @layer renderer-shell @kind types */
import type { MenuEntry } from '../../menu/menu.type';
import type { SearchAction } from '../../search/search.type';

interface StandardOverlaysProps {
  menu?: readonly MenuEntry[];
  actions?: readonly SearchAction[];
}

export type { StandardOverlaysProps };
