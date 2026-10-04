/* @layer renderer-shell @kind logic */
import { FRAMEWORK_SHORTCUTS, FULLSCREEN_CHORD, GENERAL_GROUP, SCREENS_GROUP } from './shortcuts-help.constants';
import type { ShortcutGroup, ShortcutRow, ShortcutSources } from './shortcuts-help.type';

const chordKey = (shortcut: string): string => shortcut.toLowerCase().replace(/\s+/g, '');

const uniqueChords = (rows: readonly ShortcutRow[]): ShortcutRow[] => {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = chordKey(row.shortcut);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const collectShortcuts = (sources: ShortcutSources): ShortcutGroup[] => {
  const { screens, routes, labelOf, fullscreen } = sources;
  const general = FRAMEWORK_SHORTCUTS.filter((row) => fullscreen || row.shortcut !== FULLSCREEN_CHORD);
  const own: ShortcutRow[] = [
    ...screens.flatMap((screen) => (screen.shortcut === undefined ? [] : [{ label: screen.title, shortcut: screen.shortcut }])),
    ...routes.map((route) => ({ label: labelOf(route.target), shortcut: route.shortcut })),
  ];
  const groups: ShortcutGroup[] = [{ title: GENERAL_GROUP, rows: [...general] }, { title: SCREENS_GROUP, rows: uniqueChords(own) }];
  return groups.filter((group) => group.rows.length > 0);
};

export { collectShortcuts };
