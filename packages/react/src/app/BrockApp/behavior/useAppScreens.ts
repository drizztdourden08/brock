/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { createBuiltInScreens } from '../../../screens/built-in/built-in-screens';
import { SETTINGS_ALIAS } from '../../../screens/conventions/screens.constants';
import { createScreenRegistry } from '../../../screens/create-screen-registry';
import { NO_MENU, NO_SCREENS } from '../BrockApp.constants';
import type { AppScreens, AppScreensInput } from '../BrockApp.type';
import { useRouteAlias } from './useRouteAlias';
import { useScreenTree } from './useScreenTree';

const useAppScreens = (input: AppScreensInput): AppScreens => {
  const { screens = NO_SCREENS, screenTree, builtInTabs, moduleScreens, menu = NO_MENU, homeScreen, productHome, credits, legalText } = input;
  const tree = useScreenTree(screenTree, builtInTabs);
  useRouteAlias(SETTINGS_ALIAS, tree?.settingsAlias ?? null);

  const registry = useMemo(() => {
    const all = createScreenRegistry([...screens, ...(tree?.screens ?? NO_SCREENS), ...moduleScreens]);
    for (const screen of createBuiltInScreens({ legalText, credits, settings: tree === null })) {
      if (!all.has(screen.id)) all.register(screen);
    }
    return all;
  }, [screens, tree, moduleScreens, legalText, credits]);

  const fullMenu = useMemo(() => (tree ? [...tree.menu, ...menu] : [...menu]), [tree, menu]);

  return { registry, tree, tabs: tree?.tabs ?? builtInTabs, menu: fullMenu, homeScreen: homeScreen ?? tree?.home ?? productHome };
};

export { useAppScreens };
