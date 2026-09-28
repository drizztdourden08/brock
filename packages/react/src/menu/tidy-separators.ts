/* @layer renderer-shell @kind logic */
import type { MenuEntry } from './menu.type';

const tidySeparators = (entries: readonly MenuEntry[]): MenuEntry[] => {
  const out: MenuEntry[] = [];
  for (const entry of entries) {
    if (entry === 'separator' && (out.length === 0 || out[out.length - 1] === 'separator')) continue;
    out.push(entry);
  }
  while (out.length > 0 && out[out.length - 1] === 'separator') out.pop();
  return out;
};

export { tidySeparators };
