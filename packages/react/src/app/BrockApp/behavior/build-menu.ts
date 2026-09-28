/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../../../menu/menu.type';
import { tidySeparators } from '../../../menu/tidy-separators';
import {
  ABOUT_ENTRY, CREDITS_ENTRY, DEV_CONSOLE_ENTRY, HOME_ENTRY, QUIT_ENTRY, REPORT_BUG_ENTRY, TOP_ENTRIES,
  WIDGETS_SECTION,
} from '../BrockApp.constants';
import type { MenuBuildInput } from '../BrockApp.type';
import { filterDevEntries } from './filter-dev-entries';
import { groupSections } from './group-sections';

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

const unsectioned = (entries: readonly MenuEntry[]): MenuEntry[] =>
  entries.filter((entry) => entry === 'separator' || entry.section === undefined);

const buildMenu = (input: MenuBuildInput): MenuEntry[] => {
  const { appMenu, moduleMenu, widgets, homeScreen, hasCredits, developerTools, onQuit, onDevConsole, onReportBug } = input;
  const standard: MenuItem[] = [
    ...widgets.map((entry) => ({ ...entry, section: WIDGETS_SECTION })),
    { ...REPORT_BUG_ENTRY, onClick: onReportBug },
    { ...DEV_CONSOLE_ENTRY, onClick: onDevConsole },
  ];
  const app = filterDevEntries(appMenu, developerTools);
  const modules = filterDevEntries([...moduleMenu, ...standard], developerTools);
  const named = screensNamed([...app, ...modules]);
  const unnamed = (item: MenuItem): boolean => !item.screen || (!named.has(item.screen) && item.screen !== homeScreen);
  const top = TOP_ENTRIES.filter(unnamed);
  const tail = [...(hasCredits ? [CREDITS_ENTRY] : []), ABOUT_ENTRY].filter(unnamed);
  return tidySeparators([
    { ...HOME_ENTRY, screen: homeScreen },
    ...top,
    ...unsectioned(app),
    'separator',
    ...groupSections([...app, ...modules]),
    'separator',
    ...unsectioned(modules),
    ...tail,
    { ...QUIT_ENTRY, onClick: onQuit },
  ]);
};

export { buildMenu };
