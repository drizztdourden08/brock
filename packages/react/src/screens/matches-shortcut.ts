/* @layer renderer-shell @kind logic */
import { parseShortcut } from './parse-shortcut';

const matchesShortcut = (event: KeyboardEvent, shortcut: string): boolean => {
  const want = parseShortcut(shortcut);
  if (event.key.toLowerCase() !== want.key) return false;
  const modHeld = event.ctrlKey || event.metaKey;
  if (want.mod ? !modHeld : (event.ctrlKey !== want.ctrl || event.metaKey !== want.meta)) return false;
  return event.shiftKey === want.shift && event.altKey === want.alt;
};

export { matchesShortcut };
