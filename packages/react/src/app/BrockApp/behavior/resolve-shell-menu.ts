/* @layer renderer-shell @kind logic */
import type { ResolvedMenu } from '../../../menu/menu-config.type';
import { lockProfileEntries } from '../../../menu/lock-profile-entries';
import { resolveMenu } from '../../../menu/resolve-menu';
import type { MenuBuildInput } from '../BrockApp.type';
import { keysOf } from './keys-of';
import { menuGroups } from './menu-groups';

const resolveShellMenu = (input: MenuBuildInput): ResolvedMenu => {
  const resolved = resolveMenu({ groups: menuGroups(input, true), config: input.menuConfig, known: keysOf(menuGroups(input, false)) });
  return input.locked ? { ...resolved, entries: lockProfileEntries(resolved.entries, input.locked) } : resolved;
};

export { resolveShellMenu };
