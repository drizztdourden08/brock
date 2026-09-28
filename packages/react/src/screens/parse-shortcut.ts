/* @layer renderer-shell @kind logic */
import { KEY_ALIASES } from './shortcuts.constants';
import type { ParsedShortcut } from './shortcuts.type';

const parseShortcut = (shortcut: string): ParsedShortcut => {
  const parts = shortcut.split('+').map((p) => p.trim().toLowerCase()).filter(Boolean);
  const key = parts.pop() ?? '';
  return {
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta') || parts.includes('cmd'),
    mod: parts.includes('mod'),
    key: KEY_ALIASES[key] ?? key,
  };
};

export { parseShortcut };
