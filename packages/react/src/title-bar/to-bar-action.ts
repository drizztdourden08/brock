/* @layer renderer-shell @kind logic */
import { MENU_GROUP_ID } from '../menu/menu.constants';
import type { TitleBarActionDef } from './title-bar-action.type';
import type { TitleBarItemSpec, TitleBarMenuGroup, TitleBarMenuSpec } from './title-bar-item.type';
import { volumeBarAction } from './volume-bar-action';
import { actionCommands } from './action-commands';
import { selectButton } from './select-button';

const noop = (): void => {};

const menuGroups = (id: string, spec: TitleBarMenuSpec): (TitleBarMenuGroup & { id: string })[] => {
  if (!spec.groups) return [{ id: MENU_GROUP_ID, items: spec.items }];
  return spec.groups.map((group, index) => ({ ...group, id: `${id}-${index}` }));
};

const toBarAction = (id: string, spec: TitleBarItemSpec): TitleBarActionDef => {
  if (spec.kind === 'volume') return volumeBarAction(id, spec);
  const { label, icon } = spec;
  const look = { tone: spec.tone, effect: spec.effect };
  if (spec.kind === 'menu') return { id, label, icon, bar: 'dropdown', ...look, groups: menuGroups(id, spec) };
  if (spec.kind === 'status') {
    return {
      id, label, icon, bar: 'status', status: spec.status ?? undefined, ...look, pulse: spec.pulse, disabled: spec.disabled, disabledReason: spec.disabledReason, onSelect: spec.onSelect ?? noop,
    };
  }
  if (spec.command !== undefined) actionCommands.link(id, spec.command);
  return {
    id, label, icon, bar: 'button', ...look, shortcut: spec.shortcut, disabled: spec.disabled, disabledReason: spec.disabledReason, onSelect: spec.onSelect ?? (() => selectButton(spec)),
  };
};

export { toBarAction };
