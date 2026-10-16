/* @layer renderer-shell @kind logic */
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import type { MenuEntry } from '../../menu/menu.type';
import { isEndEntry } from '../../shell/TitleBar/behavior/is-end-entry';
import { BUILT_IN_ENTRIES, NO_KEYS, SECTION_KEY_PREFIX } from '../review.constants';
import type { MenuExpectation, TitleBarExpectation } from '../review.type';
import { isMenuItem } from './is-menu-item';

const menuExpectation = (menu: readonly MenuEntry[], homeScreen: string, titleBar: TitleBarExpectation = {}, overridden: ReadonlySet<string> = NO_KEYS): MenuExpectation => {
  const { actions = [], controls, viewLabel = TESSERA_STRINGS.windows.view } = titleBar;
  const top = menu.filter(isMenuItem);
  const shownAt = (entry: (typeof BUILT_IN_ENTRIES)[number]) => top.find((item) => item.key === entry.key)
    ?? top.find((item) => entry.screen !== undefined && item.screen === entry.screen);
  const required = BUILT_IN_ENTRIES
    .filter((entry) => entry.screen === undefined || entry.screen !== homeScreen)
    .filter((entry) => shownAt(entry) !== undefined || !overridden.has(entry.key))
    .map((entry) => shownAt(entry)?.label ?? entry.label);
  const sections = top.filter((item) => item.key.startsWith(SECTION_KEY_PREFIX)).map((item) => item.label);
  const view = controls?.pin === true || controls?.fullscreen === true ? viewLabel : null;
  const tail = top.filter(isEndEntry).map((item) => item.label);
  return { required, sections, actions: actions.map((action) => action.label), view, tail };
};

export { menuExpectation };
