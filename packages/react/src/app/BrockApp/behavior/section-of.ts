/* @layer renderer-shell @kind logic */
import { MENU_SECTIONS, UNKNOWN_SECTION_ICON } from '../../../menu/menu.constants';
import type { MenuSection } from '../../../menu/menu.type';

const sectionOf = (id: string): MenuSection =>
  MENU_SECTIONS.find((section) => section.id === id)
  ?? { id, label: id.charAt(0).toUpperCase() + id.slice(1), icon: UNKNOWN_SECTION_ICON };

export { sectionOf };
