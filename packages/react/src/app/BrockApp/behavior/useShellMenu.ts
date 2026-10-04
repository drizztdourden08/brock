/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { bugReport } from '../../../bug-report/bug-report';
import { requestQuit } from '../../../quit/request-quit';
import { shortcutsHelp } from '../../../shortcuts-help/shortcuts-help';
import type { MenuEntry } from '../../../menu/menu.type';
import { usePlatform } from '../../../platform/usePlatform';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useWidgetMenuEntries } from '../../../widgets/useWidgetMenuEntries';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { CREDITS_SCREEN } from '../BrockApp.constants';
import { buildMenu } from './build-menu';
import { stripScreenEntries } from './strip-screen-entries';

const useShellMenu = (moduleMenu: readonly MenuEntry[], railed: boolean): MenuEntry[] => {
  const { menu, homeScreen } = useBrock();
  const { window: win } = usePlatform();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const hasCredits = registry.has(CREDITS_SCREEN);
  const widgets = useWidgetMenuEntries();

  return useMemo(() => {
    const built = buildMenu({
      appMenu: menu,
      moduleMenu,
      widgets,
      homeScreen,
      hasCredits,
      developerTools,
      onQuit: () => void requestQuit(() => win.close()),
      onDevConsole: () => win.openDevTools(),
      onReportBug: bugReport.open,
      onShortcuts: shortcutsHelp.open,
    });
    return railed ? stripScreenEntries(built) : built;
  }, [menu, moduleMenu, widgets, homeScreen, hasCredits, developerTools, win, railed]);
};

export { useShellMenu };
