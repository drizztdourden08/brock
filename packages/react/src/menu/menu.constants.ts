/* @layer renderer-shell @kind constants */
import type { MenuSeparator } from '@drizztdourden08/tessera/composites';
import type { MenuSection } from './menu.type';

const MENU_SECTIONS: readonly MenuSection[] = [
  { id: 'widgets', label: 'Widgets', icon: 'layout-grid' },
  { id: 'advanced', label: 'Advanced', icon: 'sliders-horizontal' },
];

const UNKNOWN_SECTION_ICON = 'folder';

const MENU_GROUP_ID = 'menu';

const MENU_SEPARATOR: MenuSeparator = { separator: true };

const CONFIRM_ARMED_MS = 5000;

export { CONFIRM_ARMED_MS, MENU_GROUP_ID, MENU_SECTIONS, MENU_SEPARATOR, UNKNOWN_SECTION_ICON };
