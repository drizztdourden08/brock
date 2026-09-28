/* @layer renderer-shell @kind constants */
import type { MenuSection } from './menu.type';

const MENU_SECTIONS: readonly MenuSection[] = [
  { id: 'widgets', label: 'Widgets', icon: 'layout-grid' },
  { id: 'advanced', label: 'Advanced', icon: 'sliders-horizontal' },
];

const UNKNOWN_SECTION_ICON = 'folder';

export { MENU_SECTIONS, UNKNOWN_SECTION_ICON };
