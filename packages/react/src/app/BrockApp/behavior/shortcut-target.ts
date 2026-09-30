/* @layer renderer-shell @kind logic */
import type { RouteShortcut } from '../../../navigation/navigation.type';
import { resolveRoute } from '../../../navigation/resolve-route';
import { routeAliases } from '../../../navigation/route-aliases';
import { matchesShortcut } from '../../../screens/matches-shortcut';
import type { ScreenRegistry } from '../../../screens/screen-registry.type';
import type { ScreenDef } from '../../../screens/screen.type';

const shortcutTarget = (
  e: KeyboardEvent,
  registry: ScreenRegistry,
  shortcuts: readonly RouteShortcut[],
  allowed: (screen: ScreenDef | undefined) => boolean,
): string | undefined => {
  const screen = registry.list().find((def) => def.shortcut !== undefined && matchesShortcut(e, def.shortcut) && allowed(def));
  if (screen) return screen.id;
  const opens = (entry: RouteShortcut): boolean => allowed(registry.get(resolveRoute(entry.target, {}, routeAliases.get).active));
  return shortcuts.find((entry) => matchesShortcut(e, entry.shortcut) && opens(entry))?.target;
};

export { shortcutTarget };
