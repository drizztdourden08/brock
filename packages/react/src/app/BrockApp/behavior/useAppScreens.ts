/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { NO_BACKGROUND, NO_MENU, NO_SCREENS } from '../BrockApp.constants';
import type { ResolvedScreenTree } from '../../../screens/conventions/screen-tree.type';
import type { AppScreens, AppScreensInput } from '../BrockApp.type';
import { PROFILES_SCREEN } from '../../../stores/profiles.constants';
import { appScreenRegistry } from './app-screen-registry';
import { profilesAlias } from './profiles-alias';
import { useRouteAlias } from './useRouteAlias';
import { useRouteAliases } from './useRouteAliases';
import { useScreenTree } from './useScreenTree';

const baseOf = (home: string | undefined, tree: ResolvedScreenTree | null): string => home ?? tree?.base ?? NO_BACKGROUND;

const useAppScreens = (input: AppScreensInput): AppScreens => {
  const { home, screens = NO_SCREENS, screenTree, builtInTabs, moduleScreens, moduleBuckets, menu = NO_MENU, homeScreen, productHome, credits, legalText, profilesRoute, singleProfile } = input;
  const tree = useScreenTree(screenTree, builtInTabs, moduleBuckets);
  useRouteAliases(tree);
  const toProfiles = useMemo(() => profilesAlias(profilesRoute), [profilesRoute]);
  useRouteAlias(PROFILES_SCREEN, toProfiles);

  const registry = useMemo(
    () => appScreenRegistry({ screens, tree, moduleScreens, moduleBuckets, legalText, credits, profilesRoute, singleProfile }),
    [screens, tree, moduleScreens, moduleBuckets, legalText, credits, profilesRoute, singleProfile],
  );

  const fullMenu = useMemo(() => (tree ? [...tree.menu, ...menu] : [...menu]), [tree, menu]);

  return { base: baseOf(home, tree), registry, tree, tabs: tree?.tabs ?? builtInTabs, menu: fullMenu, homeScreen: homeScreen ?? tree?.home ?? productHome };
};

export { useAppScreens };
