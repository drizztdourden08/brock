/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { MenuEntry, MenuEntryDef, MenuItem } from '../menu/menu.type';
import { resolveMenuEntries } from '../menu/resolve-menu-entries';
import { selectButton } from './select-button';
import type { TitleBarFoldState } from './title-bar-fold.type';
import type { TitleBarButtonSpec, TitleBarItemSpec, TitleBarMenuSpec, TitleBarStatusSpec } from './title-bar-item.type';

const reasonOf = (disabled: boolean, reason: Text | undefined, state: TitleBarFoldState): Pick<MenuItem, 'description'> =>
  (disabled && reason !== undefined ? { description: state.text(reason) } : {});

const buttonEntry = (id: string, spec: TitleBarButtonSpec, state: TitleBarFoldState): MenuItem => {
  const { command } = spec;
  const disabled = spec.disabled === true || (command !== undefined && !state.enabled(command));
  const shortcut = (command === undefined ? undefined : state.chords(command)?.[0]) ?? spec.shortcut;
  return {
    key: id,
    label: state.text(spec.label),
    icon: spec.icon,
    disabled,
    ...(shortcut === undefined ? {} : { shortcut }),
    ...reasonOf(disabled, spec.disabledReason, state),
    onClick: () => { selectButton(spec); },
  };
};

const statusEntry = (id: string, spec: TitleBarStatusSpec, state: TitleBarFoldState): MenuItem => {
  const disabled = spec.disabled === true;
  const name = state.text(spec.label);
  const label = spec.status === null || spec.status === '' ? name : `${name}: ${state.text(spec.status)}`;
  return { key: id, label, icon: spec.icon, disabled, ...reasonOf(disabled, spec.disabledReason, state), onClick: () => { spec.onSelect?.(); } };
};

const menuEntry = (id: string, spec: TitleBarMenuSpec, state: TitleBarFoldState): MenuItem => {
  const lists = spec.groups ? spec.groups.map((group) => group.items) : [spec.items];
  const given = lists.flatMap((list, at): MenuEntryDef[] => (at === 0 ? [...list] : ['separator', ...list]));
  return { key: id, label: state.text(spec.label), icon: spec.icon, children: resolveMenuEntries(given, [], { at: 0 }, state.text) };
};

const titleBarMenuEntry = (id: string, spec: TitleBarItemSpec, state: TitleBarFoldState): MenuEntry | null => {
  if (spec.kind === 'button') return buttonEntry(id, spec, state);
  if (spec.kind === 'status') return statusEntry(id, spec, state);
  if (spec.kind === 'menu') return menuEntry(id, spec, state);
  return null;
};

export { titleBarMenuEntry };
