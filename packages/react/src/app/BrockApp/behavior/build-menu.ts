/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../../../menu/menu.type';
import { BUILT_IN_ENTRIES } from '../BrockApp.constants';

const screensNamed = (entries: readonly MenuEntry[]): Set<string> => {
  const ids = new Set<string>();
  const visit = (list: readonly MenuEntry[]): void => {
    for (const entry of list) {
      if (entry === 'separator') continue;
      if (entry.screen) ids.add(entry.screen);
      if (entry.children) visit(entry.children);
    }
  };
  visit(entries);
  return ids;
};

const buildMenu = (appMenu: readonly MenuEntry[], moduleMenu: readonly MenuEntry[], onQuit: () => void): MenuEntry[] => {
  const given = [...appMenu, ...(moduleMenu.length > 0 && appMenu.length > 0 ? ['separator' as const] : []), ...moduleMenu];
  const named = screensNamed(given);
  const builtIn = BUILT_IN_ENTRIES.filter((entry) => !named.has(entry.screen ?? ''));
  const quit: MenuItem = { key: 'quit', label: 'Quit', onClick: onQuit };
  return [
    ...given,
    ...(given.length > 0 && builtIn.length > 0 ? ['separator' as const] : []),
    ...builtIn,
    'separator',
    quit,
  ];
};

export { buildMenu };
