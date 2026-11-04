/* @layer electron-main @kind constants */
const KEY_MODIFIERS: Readonly<Partial<Record<string, 'shift' | 'control' | 'alt' | 'meta'>>> = {
  shift: 'shift',
  ctrl: 'control',
  control: 'control',
  alt: 'alt',
  option: 'alt',
  meta: 'meta',
  cmd: 'meta',
  command: 'meta',
  win: 'meta',
  super: 'meta',
};

const KEY_NAMES: Readonly<Partial<Record<string, string>>> = {
  enter: 'Enter',
  return: 'Enter',
  escape: 'Escape',
  esc: 'Escape',
  tab: 'Tab',
  space: 'Space',
  backspace: 'Backspace',
  delete: 'Delete',
  del: 'Delete',
  insert: 'Insert',
  home: 'Home',
  end: 'End',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  up: 'Up',
  arrowup: 'Up',
  down: 'Down',
  arrowdown: 'Down',
  left: 'Left',
  arrowleft: 'Left',
  right: 'Right',
  arrowright: 'Right',
};

const KEY_FUNCTION = /^f([1-9]|1\d|2[0-4])$/i;
const KEY_PLUS = '+';
const KEY_TYPING_BLOCKERS: readonly string[] = ['control', 'alt', 'meta'];

export { KEY_MODIFIERS, KEY_NAMES, KEY_FUNCTION, KEY_PLUS, KEY_TYPING_BLOCKERS };
