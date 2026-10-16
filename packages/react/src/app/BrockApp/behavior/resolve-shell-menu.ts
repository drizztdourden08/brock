/* @layer renderer-shell @kind logic */
import type { ResolvedMenu } from '../../../menu/menu-config.type';
import { WINDOW_FULLSCREEN_KEY, WINDOW_PIN_KEY } from '../../../menu/menu-config.constants';
import { lockProfileEntries } from '../../../menu/lock-profile-entries';
import { resolveMenu } from '../../../menu/resolve-menu';
import type { MenuBuildInput } from '../BrockApp.type';
import { keysOf } from './keys-of';
import { menuGroups } from './menu-groups';

const resolveShellMenu = (input: MenuBuildInput): ResolvedMenu => {
  const known = keysOf(menuGroups(input, false)).add(WINDOW_PIN_KEY).add(WINDOW_FULLSCREEN_KEY);
  const resolved = resolveMenu({ groups: menuGroups(input, true), config: input.menuConfig, known });
  return input.locked ? { ...resolved, entries: lockProfileEntries(resolved.entries, input.locked) } : resolved;
};

export { resolveShellMenu };
