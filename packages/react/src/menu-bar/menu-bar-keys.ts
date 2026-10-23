/* @layer renderer-shell @kind logic */
import type { KeyboardEvent, RefObject } from 'react';
import { MENU_BAR_BUTTON } from './menu-bar.constants';
import { OPEN_KEYS, SIDE_KEYS } from './menu-bar-keys.constants';
import { stepMenu } from './step-menu';
import type { MenuBarKeysInput } from './menu-bar-keys.type';

const buttonsOf = (row: RefObject<HTMLElement | null>): HTMLElement[] =>
  [...(row.current?.querySelectorAll<HTMLElement>(MENU_BAR_BUTTON) ?? [])];

const sideStep = (event: KeyboardEvent<HTMLElement>, { row, open, setOpen }: MenuBarKeysInput, focused: number): boolean => {
  const delta = SIDE_KEYS[event.key];
  if (delta === undefined || (open === null && focused === -1)) return false;
  const buttons = buttonsOf(row);
  const next = stepMenu(open ?? focused, delta, buttons.length);
  if (open === null) buttons[next]?.focus();
  else setOpen(next);
  return true;
};

const menuBarKeys = (input: MenuBarKeysInput) => (event: KeyboardEvent<HTMLElement>): void => {
  const focused = buttonsOf(input.row).findIndex((button) => button === event.target);
  if (sideStep(event, input, focused)) event.preventDefault();
  else if (OPEN_KEYS.includes(event.key) && input.open === null && focused !== -1) {
    event.preventDefault();
    input.setOpen(focused);
  }
};

export { menuBarKeys };
