/* @layer renderer-shell @kind logic */
import type { MenuGroup, WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { navResolver as resolve } from '../menu/nav-resolver';
import { toMenuGroups } from '../menu/to-menu-groups';
import type { TitleBarItemSpec, TitleBarMenuSpec } from './title-bar-item.type';

const noop = (): void => {};

const menuGroups = (id: string, spec: TitleBarMenuSpec): MenuGroup[] => {
  if (!spec.groups) return toMenuGroups(spec.items, resolve);
  return spec.groups.flatMap((group, index) => toMenuGroups(group.items, resolve).map((built) => ({ ...built, id: `${id}-${index}`, label: group.label })));
};

const toBarAction = (id: string, spec: TitleBarItemSpec): WindowTitleBarAction => {
  const { label, icon } = spec;
  if (spec.kind === 'menu') return { id, label, icon, bar: 'dropdown', groups: menuGroups(id, spec) };
  const look = { tone: spec.tone, effect: spec.effect };
  if (spec.kind === 'status') {
    return { id, label, icon, bar: 'status', status: spec.status ?? undefined, ...look, pulse: spec.pulse, onSelect: spec.onSelect ?? noop };
  }
  return { id, label, icon, bar: 'button', ...look, shortcut: spec.shortcut, onSelect: spec.onSelect };
};

export { toBarAction };
