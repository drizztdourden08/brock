/* @layer renderer-shell @kind logic */
import { joinRoute } from '../../navigation/join-route';
import type { RouteShortcut } from '../../navigation/navigation.type';
import { isCardEntry } from './is-card-entry';
import type { ScreenEntry } from './screen-tree.type';

const targetOf = (entry: ScreenEntry): string | null => {
  if (isCardEntry(entry)) return null;
  if (entry.kind === 'hero') return entry.bucket;
  if (entry.kind === 'tab') return joinRoute(entry.bucket, entry.page, entry.id);
  return joinRoute(entry.bucket, entry.id);
};

const pageShortcuts = (entries: readonly ScreenEntry[]): RouteShortcut[] =>
  entries.flatMap((entry) => {
    const shortcut = entry.meta?.shortcut;
    const target = targetOf(entry);
    return shortcut === undefined || target === null ? [] : [{ shortcut, target }];
  });

export { pageShortcuts };
