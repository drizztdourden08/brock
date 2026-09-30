/* @layer renderer-shell @kind types */
type ScreenParams = Record<string, unknown>;

interface NavigationState {
  active: string | null;
  params: ScreenParams;
  open: (id: string, params?: ScreenParams) => void;
  close: () => void;
}

interface UseNavigationResult {
  active: string | null;
  params: ScreenParams;
  open: (id: string, params?: ScreenParams) => void;
  close: () => void;
}

interface ResolvedRoute {
  active: string;
  params: ScreenParams;
}

type RouteAlias = (params: ScreenParams) => ResolvedRoute;

interface RouteAliasRegistry {
  add: (name: string, alias: RouteAlias) => () => void;
  get: (name: string) => RouteAlias | undefined;
}

interface RouteShortcut {
  shortcut: string;
  target: string;
}

export type { NavigationState, ResolvedRoute, RouteAlias, RouteAliasRegistry, RouteShortcut, ScreenParams, UseNavigationResult };
