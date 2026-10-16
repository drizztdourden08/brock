/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { bugReport } from '../../../bug-report/bug-report';
import { requestQuit } from '../../../quit/request-quit';
import { shortcutsHelp } from '../../../shortcuts-help/shortcuts-help';
import type { MenuEntry } from '../../../menu/menu.type';
import { profileLock } from '../../../menu/profile-lock';
import { useMenuHooks } from '../../../menu/useMenuHooks';
import { useMenuIssues } from '../../../menu/useMenuIssues';
import { searchableMenu } from '../../../menu/searchable-menu';
import { useMenuHiddenRoutes } from '../../../menu/useMenuHiddenRoutes';
import { visibleMenu } from '../../../menu/visible-menu';
import { withPreload } from '../../../menu/with-preload';
import { routePreloader } from '../../../lazy/route-preloader';
import { useShowContext } from '../../../screens/show/useShowContext';
import { usePlatform } from '../../../platform/usePlatform';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { tours } from '../../../tours/tours';
import { useTourStore } from '../../../tours/useTourStore';
import { useWidgetMenuEntries } from '../../../widgets/useWidgetMenuEntries';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { CREDITS_SCREEN } from '../BrockApp.constants';
import type { ShellMenu } from '../BrockApp.type';
import { resolveShellMenu } from './resolve-shell-menu';
import { stripScreenEntries } from './strip-screen-entries';

const useShellMenu = (givenModuleMenu: readonly MenuEntry[], railed: boolean): ShellMenu => {
  const { menu: givenMenu, homeScreen, product } = useBrock();
  const menu = useMenuHooks(givenMenu);
  const moduleMenu = useMenuHooks(givenModuleMenu);
  const show = useShowContext();
  const { window: win } = usePlatform();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const hasCredits = registry.has(CREDITS_SCREEN);
  const widgets = useWidgetMenuEntries();
  const tourList = useTourStore((s) => s.tours);
  const hasProfile = useProfilesStore((s) => s.active !== null);
  const homeLocked = !hasProfile && registry.get(homeScreen)?.requiresProfile !== false;

  const shell = useMemo(() => {
    const resolved = resolveShellMenu({
      appMenu: menu,
      moduleMenu,
      widgets,
      homeScreen,
      homeLocked,
      hasCredits,
      developerTools,
      show,
      onQuit: () => void requestQuit(() => win.close()),
      onDevConsole: () => win.openDevTools(),
      onReportBug: () => bugReport.open(),
      onShortcuts: shortcutsHelp.open,
      tours: { list: tourList, start: tours.start },
      menuConfig: product.menu,
      locked: hasProfile ? undefined : profileLock(registry),
    });
    const entries = withPreload(resolved.entries, routePreloader(registry));
    const shown = railed ? stripScreenEntries(entries) : entries;
    return { menu: visibleMenu(shown), searchable: searchableMenu(shown), all: entries, issues: resolved.issues, overrides: resolved.overrides };
  }, [menu, moduleMenu, widgets, tourList, homeScreen, homeLocked, hasCredits, developerTools, show, win, railed, product.menu, hasProfile, registry]);
  useMenuIssues(shell.issues);
  useMenuHiddenRoutes(shell.all);
  return shell;
};

export { useShellMenu };
