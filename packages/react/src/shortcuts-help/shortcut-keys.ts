/* @layer renderer-shell @kind logic */
import type { ShortcutKey } from '@drizztdourden08/tessera/primitives';
import { KEY_NAMES } from './shortcuts-help.constants';

const keyOf = (part: string): ShortcutKey => {
  const lower = part.toLowerCase();
  const named = KEY_NAMES[lower];
  if (named) return named;
  if (/^f\d{1,2}$/.test(lower)) return lower.toUpperCase() as ShortcutKey;
  return (part.length === 1 ? part.toUpperCase() : part) as ShortcutKey;
};

const shortcutKeys = (shortcut: string): ShortcutKey[] =>
  shortcut.split(/\+(?!$)/).map((part) => part.trim()).filter(Boolean).map(keyOf);

export { shortcutKeys };
