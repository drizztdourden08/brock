/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useBrock } from '../../../app/useBrock';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import { resolveRoute } from '../../../navigation/resolve-route';
import { routeAliases } from '../../../navigation/route-aliases';
import { useMenuHiddenStore } from '../../../menu/useMenuHiddenStore';
import { isScreenAllowed } from '../../../screens/is-screen-allowed';
import { routeHidden } from '../../../screens/show/route-hidden';
import { useShowContext } from '../../../screens/show/useShowContext';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { collectShortcuts } from '../../collect-shortcuts';
import type { ShortcutGroup } from '../../shortcuts-help.type';

const useShortcutGroups = (): ShortcutGroup[] => {
  const { product, shortcuts, screenTree } = useBrock();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const hasProfile = useProfilesStore((s) => s.active !== null);
  const show = useShowContext();
  const menuHidden = useMenuHiddenStore((s) => s.routes);
  const fullscreen = product.window.titleBar.controls.fullscreen;

  return useMemo(() => {
    const screens = registry.list().filter((screen) => isScreenAllowed(screen, developerTools, hasProfile, show) && !routeHidden(screen.id, menuHidden));
    const routes = shortcuts.filter((entry) => !routeHidden(entry.target, menuHidden));
    const labelOf = (target: string): string => {
      const entry = screenTree?.search.find((item) => item.target?.route === target && item.target.anchor === undefined);
      if (entry) return entry.label;
      return registry.get(resolveRoute(target, {}, routeAliases.get).active)?.title ?? target;
    };
    return collectShortcuts({ screens, routes, labelOf, fullscreen });
  }, [registry, developerTools, hasProfile, show, shortcuts, screenTree, fullscreen, menuHidden]);
};

export { useShortcutGroups };
