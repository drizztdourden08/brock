/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../menu/menu.type';
import { selectButton } from './select-button';
import type { TitleBarFoldState } from './title-bar-fold.type';
import type { TitleBarButtonSpec, TitleBarItemSpec, TitleBarMenuSpec, TitleBarStatusSpec } from './title-bar-item.type';

const reasonOf = (disabled: boolean, reason: string | undefined): Pick<MenuItem, 'description'> =>
  (disabled && reason !== undefined ? { description: reason } : {});

const buttonEntry = (id: string, spec: TitleBarButtonSpec, state: TitleBarFoldState): MenuItem => {
  const { command } = spec;
  const disabled = spec.disabled === true || (command !== undefined && !state.enabled(command));
  const shortcut = (command === undefined ? undefined : state.chords(command)?.[0]) ?? spec.shortcut;
  return {
    key: id,
    label: spec.label,
    icon: spec.icon,
    disabled,
    ...(shortcut === undefined ? {} : { shortcut }),
    ...reasonOf(disabled, spec.disabledReason),
    onClick: () => { selectButton(spec); },
  };
};

const statusEntry = (id: string, spec: TitleBarStatusSpec): MenuItem => {
  const disabled = spec.disabled === true;
  const label = spec.status === null || spec.status === '' ? spec.label : `${spec.label}: ${spec.status}`;
  return { key: id, label, icon: spec.icon, disabled, ...reasonOf(disabled, spec.disabledReason), onClick: () => { spec.onSelect?.(); } };
};

const menuEntry = (id: string, spec: TitleBarMenuSpec): MenuItem => {
  const lists = spec.groups ? spec.groups.map((group) => group.items) : [spec.items];
  const children = lists.flatMap((list, at): MenuEntry[] => (at === 0 ? [...list] : ['separator', ...list]));
  return { key: id, label: spec.label, icon: spec.icon, children };
};

const titleBarMenuEntry = (id: string, spec: TitleBarItemSpec, state: TitleBarFoldState): MenuEntry | null => {
  if (spec.kind === 'button') return buttonEntry(id, spec, state);
  if (spec.kind === 'status') return statusEntry(id, spec);
  if (spec.kind === 'menu') return menuEntry(id, spec);
  return null;
};

export { titleBarMenuEntry };
