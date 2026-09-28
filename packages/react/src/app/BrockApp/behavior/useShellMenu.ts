/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuEntry } from '../../../menu/menu.type';
import { usePlatform } from '../../../platform/usePlatform';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
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

  return useMemo(() => {
    const built = buildMenu({
      appMenu: menu,
      moduleMenu,
      homeScreen,
      hasCredits,
      developerTools,
      onQuit: () => win.close(),
      onDevConsole: () => win.openDevTools(),
    });
    return railed ? stripScreenEntries(built) : built;
  }, [menu, moduleMenu, homeScreen, hasCredits, developerTools, win, railed]);
};

export { useShellMenu };
