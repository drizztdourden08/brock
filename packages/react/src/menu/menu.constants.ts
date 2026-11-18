/* @layer renderer-shell @kind constants */
import type { MenuSeparator } from '@drizztdourden08/tessera/composites';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { MenuSection } from './menu.type';

const MENU_SECTIONS: readonly MenuSection[] = [
  { id: 'widgets', label: msg('brock-shell:menu.section.widgets'), icon: 'layout-grid' },
  { id: 'help', label: msg('brock-shell:menu.section.help'), icon: 'circle-help' },
  { id: 'advanced', label: msg('brock-shell:menu.section.advanced'), icon: 'sliders-horizontal' },
];

const UNKNOWN_SECTION_ICON = 'folder';

const MENU_GROUP_ID = 'menu';

const PROFILE_FIRST = msg('brock-shell:menu.profileFirst');

const MENU_SEPARATOR: MenuSeparator = { separator: true };

export { MENU_GROUP_ID, MENU_SECTIONS, MENU_SEPARATOR, PROFILE_FIRST, UNKNOWN_SECTION_ICON };
