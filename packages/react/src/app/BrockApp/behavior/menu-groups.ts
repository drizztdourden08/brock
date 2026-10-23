/* @layer renderer-shell @kind logic */
import type { MenuGroups } from '../../../menu/menu-config.type';
import type { MenuEntry, MenuItem } from '../../../menu/menu.type';
import { withRoutes } from '../../../menu/with-routes';
import {
  ABOUT_ENTRY, CREDITS_ENTRY, DEV_CONSOLE_ENTRY, HOME_ENTRY, HOME_LOCKED, PROFILES_SCREEN, QUIT_ENTRY, REPORT_BUG_ENTRY, TOP_ENTRIES,
  WIDGETS_SECTION,
} from '../BrockApp.constants';
import { SHORTCUTS_HELP_ENTRY } from '../../../shortcuts-help/shortcuts-help.constants';
import { tourMenu } from '../../../tours/tour-menu-entry';
import type { MenuBuildInput } from '../BrockApp.type';
import { filterDevEntries } from './filter-dev-entries';
import { foldSectionMenus } from './fold-section-menus';
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

const menuGroups = (input: MenuBuildInput, filtered: boolean): MenuGroups => {
  const { appMenu, moduleMenu, widgets, homeScreen, hasCredits, developerTools, show, onQuit, onDevConsole, onReportBug, onShortcuts } = input;
  const filter = (entries: readonly MenuEntry[]): MenuEntry[] => (filtered ? filterDevEntries(entries, developerTools, show) : [...entries]);
  const tourEntry = input.tours ? tourMenu.entry(input.tours.list, tourMenu.section([...appMenu, ...moduleMenu]), input.tours.start) : null;
  const standard: MenuItem[] = [
    ...widgets.map((entry) => ({ ...entry, section: WIDGETS_SECTION })),
    ...(tourEntry ? [tourEntry] : []),
    { ...SHORTCUTS_HELP_ENTRY, onClick: onShortcuts },
    { ...REPORT_BUG_ENTRY, onClick: onReportBug },
    { ...DEV_CONSOLE_ENTRY, onClick: onDevConsole },
  ];
  const app = filter(withRoutes(foldSectionMenus(appMenu, [...moduleMenu, ...standard])));
  const modules = filter(withRoutes([...moduleMenu, ...standard]));
  const named = screensNamed([...app, ...modules]);
  const unnamed = (item: MenuItem): boolean => !item.screen || (!named.has(item.screen) && item.screen !== homeScreen);
  const topEntries = TOP_ENTRIES.filter((item) => unnamed(item) && !(input.singleProfile && item.screen === PROFILES_SCREEN));
  return {
    main: [{ ...HOME_ENTRY, screen: homeScreen, ...(input.homeLocked ? HOME_LOCKED : {}) }, ...topEntries, ...unsectioned(app)],
    sections: groupSections([...app, ...modules]),
    modules: unsectioned(modules),
    end: [...[...(hasCredits ? [CREDITS_ENTRY] : []), ABOUT_ENTRY].filter(unnamed), { ...QUIT_ENTRY, onClick: onQuit }],
  };
};

export { menuGroups };
