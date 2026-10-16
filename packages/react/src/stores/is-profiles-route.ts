/* @layer renderer-shell @kind logic */
import { resolveRoute } from '../navigation/resolve-route';
import { routeAliases } from '../navigation/route-aliases';
import type { ScreenParams } from '../navigation/navigation.type';
import { PROFILES_SCREEN } from './profiles.constants';

const isProfilesRoute = (active: string | null, params: ScreenParams): boolean => {
  if (active === PROFILES_SCREEN) return true;
  const target = resolveRoute(PROFILES_SCREEN, {}, routeAliases.get);
  return target.active !== PROFILES_SCREEN && active === target.active && params.section === target.params.section;
};

export { isProfilesRoute };
