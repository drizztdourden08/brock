/* @layer renderer-shell @kind types */
type ScreenParams = Record<string, unknown>;

type NavigationHistory = Record<string, ScreenParams[]>;

interface SavedNavigation {
  active: string | null;
  params: ScreenParams;
  history: NavigationHistory;
  remembered: Record<string, ScreenParams>;
}

interface NavigationSnapshot extends SavedNavigation {
  parent: ScreenParams | null;
}

type NavigationStep = Partial<NavigationSnapshot>;

interface NavigationState extends NavigationSnapshot {
  open: (id: string, params?: ScreenParams) => void;
  close: () => void;
  back: () => boolean;
  up: (parent: ScreenParams) => void;
  setParent: (parent: ScreenParams | null) => void;
  restore: (saved: SavedNavigation | null) => void;
}

interface UseNavigationResult {
  active: string | null;
  params: ScreenParams;
  open: (id: string, params?: ScreenParams) => void;
  close: () => void;
  back: () => boolean;
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

type LeaveGuard = () => boolean;

interface LeaveGuardRegistry {
  add: (guard: LeaveGuard) => () => void;
  dirty: () => boolean;
}

export type {
  LeaveGuard, LeaveGuardRegistry, NavigationHistory, NavigationSnapshot, NavigationState, NavigationStep, ResolvedRoute, RouteAlias, RouteAliasRegistry, RouteShortcut, SavedNavigation, ScreenParams,
  UseNavigationResult,
};
