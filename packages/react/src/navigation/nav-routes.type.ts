/* @layer renderer-shell @kind types */
type NavRouteKind = 'screen' | 'hub' | 'page' | 'tab' | 'sub';

interface NavRoute {
  route: string;
  title: string;
  kind: NavRouteKind;
  screen: string;
  section: string | null;
  tab: string | null;
}

export type { NavRoute, NavRouteKind };
