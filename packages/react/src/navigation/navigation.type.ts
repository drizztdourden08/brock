/* @layer renderer-shell @kind types */
type ScreenParams = Record<string, unknown>;

type NavigationHistory = Record<string, ScreenParams[]>;

interface ClosedScreen {
  active: string;
  params: ScreenParams;
  history: ScreenParams[];
}

interface SavedNavigation {
  active: string | null;
  params: ScreenParams;
  history: NavigationHistory;
  remembered: Record<string, ScreenParams>;
  closed?: ClosedScreen | null;
}

interface NavigationSnapshot extends SavedNavigation {
  parent: ScreenParams | null;
  closed: ClosedScreen | null;
}

interface OpenOptions {
  fresh?: boolean;
}

type NavigationStep = Partial<NavigationSnapshot>;

interface NavigationState extends NavigationSnapshot {
  open: (id: string, params?: ScreenParams, options?: OpenOptions) => void;
  close: () => void;
  back: () => boolean;
  up: (parent: ScreenParams) => void;
  reopen: () => boolean;
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

interface StickyParamsRegistry {
  set: (screen: string, keys: readonly string[] | undefined) => void;
  keys: (screen: string | null) => readonly string[];
  pick: (screen: string | null, params: ScreenParams) => ScreenParams;
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
  ClosedScreen, LeaveGuard, LeaveGuardRegistry, NavigationHistory, NavigationSnapshot, NavigationState, NavigationStep, OpenOptions, ResolvedRoute, RouteAlias, RouteAliasRegistry, RouteShortcut, SavedNavigation, ScreenParams,
  StickyParamsRegistry, UseNavigationResult,
};
