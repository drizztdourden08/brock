/* @layer renderer-shell @kind logic */
import type { RouteAlias } from '../../../navigation/navigation.type';

const profilesAlias = (route: string | undefined): RouteAlias | null =>
  (route === undefined ? null : (params) => ({ active: route, params }));

export { profilesAlias };
