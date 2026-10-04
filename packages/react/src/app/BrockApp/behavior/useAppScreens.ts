/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { createBuiltInScreens } from '../../../screens/built-in/built-in-screens';
import { SETTINGS_ALIAS } from '../../../screens/conventions/screens.constants';
import { createScreenRegistry } from '../../../screens/create-screen-registry';
import { NO_BACKGROUND, NO_MENU, NO_SCREENS } from '../BrockApp.constants';
import type { ResolvedScreenTree } from '../../../screens/conventions/screen-tree.type';
import type { AppScreens, AppScreensInput } from '../BrockApp.type';
import { useRouteAlias } from './useRouteAlias';
import { useScreenTree } from './useScreenTree';

const baseOf = (home: string | undefined, tree: ResolvedScreenTree | null): string => home ?? tree?.base ?? NO_BACKGROUND;

const useAppScreens = (input: AppScreensInput): AppScreens => {
  const { home, screens = NO_SCREENS, screenTree, builtInTabs, moduleScreens, menu = NO_MENU, homeScreen, productHome, credits, legalText } = input;
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

  return { base: baseOf(home, tree), registry, tree, tabs: tree?.tabs ?? builtInTabs, menu: fullMenu, homeScreen: homeScreen ?? tree?.home ?? productHome };
};

export { useAppScreens };
