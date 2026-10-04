/* @layer renderer-shell @kind logic */
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import type { MenuEntry } from '../../menu/menu.type';
import { BUILT_IN_ENTRIES, SECTION_KEY_PREFIX } from '../review.constants';
import type { MenuExpectation, TitleBarExpectation } from '../review.type';
import { isMenuItem } from './is-menu-item';

const menuExpectation = (menu: readonly MenuEntry[], homeScreen: string, titleBar: TitleBarExpectation = {}): MenuExpectation => {
  const { actions = [], controls, windowGroups = false } = titleBar;
  const top = menu.filter(isMenuItem);
  const required = BUILT_IN_ENTRIES
    .filter((entry) => entry.screen === undefined || entry.screen !== homeScreen)
    .map((entry) => (top.find((item) => item.key === entry.key)
      ?? top.find((item) => entry.screen !== undefined && item.screen === entry.screen))?.label ?? entry.label);
  const sections = top.filter((item) => item.key.startsWith(SECTION_KEY_PREFIX)).map((item) => item.label);
  const view = windowGroups || controls?.pin === true || controls?.fullscreen === true ? TESSERA_STRINGS.windows.view : null;
  return { required, sections, actions: actions.map((action) => action.label), view };
};

export { menuExpectation };
