/* @layer renderer-shell @kind logic */
import type { TitleBarItemEntry } from './title-bar-item.type';

const titleBarFromFiles = (entries: readonly TitleBarItemEntry[]): readonly TitleBarItemEntry[] =>
  [...entries].sort((a, b) => a.id.localeCompare(b.id));

export { titleBarFromFiles };
