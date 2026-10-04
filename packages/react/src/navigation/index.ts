/* @layer renderer-shell @kind barrel */
export { useNavigationStore } from './useNavigationStore';
export { nav } from './nav';
export { joinRoute } from './join-route';
export { resolveRoute } from './resolve-route';
export { routeAliases } from './route-aliases';
export { leaveGuards } from './leave-guards';
export type {
  LeaveGuard, LeaveGuardRegistry, NavigationHistory, NavigationState, ResolvedRoute, RouteAlias, RouteAliasRegistry, RouteShortcut, SavedNavigation, ScreenParams, UseNavigationResult,
} from './navigation.type';
export { useNavigation } from './useNavigation';
export { useCanGoBack } from './useCanGoBack';
export { useUnsavedChanges } from './useUnsavedChanges';
export { BackTitle } from './BackTitle';
export type { BackTitleProps } from './BackTitle';
