/* @layer renderer-shell @kind constants */
import type { MenuSeparator } from '@drizztdourden08/tessera/composites';
import type { MenuSection } from './menu.type';

const MENU_SECTIONS: readonly MenuSection[] = [
  { id: 'widgets', label: 'Widgets', icon: 'layout-grid' },
  { id: 'help', label: 'Help', icon: 'circle-help' },
  { id: 'advanced', label: 'Advanced', icon: 'sliders-horizontal' },
];

const UNKNOWN_SECTION_ICON = 'folder';

const MENU_GROUP_ID = 'menu';

const MENU_SEPARATOR: MenuSeparator = { separator: true };

export { MENU_GROUP_ID, MENU_SECTIONS, MENU_SEPARATOR, UNKNOWN_SECTION_ICON };
