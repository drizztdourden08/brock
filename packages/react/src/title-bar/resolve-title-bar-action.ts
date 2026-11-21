/* @layer renderer-shell @kind logic */
import type { MenuGroup, WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { navResolver } from '../menu/nav-resolver';
import { resolveMenuEntries } from '../menu/resolve-menu-entries';
import { toMenuGroups } from '../menu/to-menu-groups';
import type { Resolve } from './resolve-title-bar-action.type';
import type { TitleBarActionDef, TitleBarVolumeActionDef } from './title-bar-action.type';
import type { TitleBarMenuGroup } from './title-bar-item.type';

const resolveGroup = (group: TitleBarMenuGroup & { id: string }, text: Resolve): MenuGroup => {
  const [built] = toMenuGroups(resolveMenuEntries(group.items, [], { at: 0 }, text), navResolver);
  return group.label === undefined ? { ...built, id: group.id } : { ...built, id: group.id, label: text(group.label) };
};

const resolveVolume = (def: TitleBarVolumeActionDef, text: Resolve): WindowTitleBarAction => ({ ...def, label: text(def.label) });

const resolveTitleBarAction = (def: TitleBarActionDef, text: Resolve): WindowTitleBarAction => {
  if (def.bar === 'volume') return resolveVolume(def, text);
  if (def.bar === 'dropdown') return { ...def, label: text(def.label), groups: def.groups.map((group) => resolveGroup(group, text)) };
  const { status, disabledReason } = def;
  return {
    ...def,
    label: text(def.label),
    status: status === undefined ? undefined : text(status),
    disabledReason: disabledReason === undefined ? undefined : text(disabledReason),
  };
};

export { resolveTitleBarAction };
