/* @layer renderer-shell @kind logic */
import type { ResolvedMenu } from '../../../menu/menu-config.type';
import { growParents } from '../../../menu/grow-parents';
import { lockProfileEntries } from '../../../menu/lock-profile-entries';
import { plantForest } from '../../../menu/plant-forest';
import { resolveMenu } from '../../../menu/resolve-menu';
import { WIDGETS_DEVELOPER_KEY } from '../../../widgets/widget.constants';
import { widgetMenuGrows } from '../../../widgets/widget-menu-grows';
import type { MenuBuildInput } from '../BrockApp.type';
import { keysOf } from './keys-of';
import { menuGroups } from './menu-groups';

const resolveShellMenu = (input: MenuBuildInput): ResolvedMenu => {
  const all = menuGroups(input, false);
  const grown = growParents(plantForest(all), input.menuConfig, widgetMenuGrows);
  const known = new Set([...keysOf(all), ...grown, WIDGETS_DEVELOPER_KEY]);
  const resolved = resolveMenu({ groups: menuGroups(input, true), config: input.menuConfig, known, grows: widgetMenuGrows });
  return input.locked ? { ...resolved, entries: lockProfileEntries(resolved.entries, input.locked) } : resolved;
};

export { resolveShellMenu };
