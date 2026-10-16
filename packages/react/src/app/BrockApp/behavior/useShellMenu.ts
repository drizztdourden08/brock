/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { bugReport } from '../../../bug-report/bug-report';
import { requestQuit } from '../../../quit/request-quit';
import { shortcutsHelp } from '../../../shortcuts-help/shortcuts-help';
import type { MenuEntry } from '../../../menu/menu.type';
import { useMenuHooks } from '../../../menu/useMenuHooks';
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
import { buildMenu } from './build-menu';
import { stripScreenEntries } from './strip-screen-entries';

const useShellMenu = (givenModuleMenu: readonly MenuEntry[], railed: boolean): MenuEntry[] => {
  const { menu: givenMenu, homeScreen } = useBrock();
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

  return useMemo(() => {
    const built = buildMenu({
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
      onReportBug: bugReport.open,
      onShortcuts: shortcutsHelp.open,
      tours: { list: tourList, start: tours.start },
    });
    return railed ? stripScreenEntries(built) : built;
  }, [menu, moduleMenu, widgets, tourList, homeScreen, homeLocked, hasCredits, developerTools, show, win, railed]);
};

export { useShellMenu };
