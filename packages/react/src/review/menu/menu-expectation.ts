/* @layer renderer-shell @kind logic */
import type { MenuEntry } from '../../menu/menu.type';
import { MENU_SECTIONS } from '../../menu/menu.constants';
import { ADVANCED_SECTION, BUILT_IN_ENTRIES } from '../review.constants';
import type { MenuExpectation } from '../review.type';
import { isMenuItem } from './is-menu-item';

const menuExpectation = (menu: readonly MenuEntry[], homeScreen: string): MenuExpectation => {
  const top = menu.filter(isMenuItem);
  const required = BUILT_IN_ENTRIES
    .filter((entry) => entry.screen === undefined || entry.screen !== homeScreen)
    .map((entry) => (top.find((item) => item.key === entry.key)
      ?? top.find((item) => entry.screen !== undefined && item.screen === entry.screen))?.label ?? entry.label);
  const advanced = MENU_SECTIONS.find((section) => section.id === ADVANCED_SECTION)?.label ?? ADVANCED_SECTION;
  return { required, sections: [advanced] };
};

export { menuExpectation };
