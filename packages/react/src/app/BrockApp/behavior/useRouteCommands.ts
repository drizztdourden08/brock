/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { COMMAND_RANKS } from '../../../commands/commands.constants';
import { useCommandSource } from '../../../commands/useCommandSource';
import { isScreenAllowed } from '../../../screens/is-screen-allowed';
import type { ScreenDef } from '../../../screens/screen.type';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useBrock } from '../../useBrock';
import { useDeveloperTools } from '../../useDeveloperTools';
import { routeCommands } from './route-commands';
import { routeLabel } from './route-label';

const useRouteCommands = (): void => {
  const { shortcuts, screenTree } = useBrock();
  const registry = useScreenRegistry();
  const developerTools = useDeveloperTools();
  const defs = useMemo(() => {
    const allowed = (screen: ScreenDef | undefined): boolean =>
      screen !== undefined && isScreenAllowed(screen, developerTools, useProfilesStore.getState().active !== null);
    return routeCommands({ registry, shortcuts, allowed, labelOf: routeLabel(screenTree, registry) });
  }, [registry, shortcuts, screenTree, developerTools]);
  useCommandSource(COMMAND_RANKS.routes, defs);
};

export { useRouteCommands };
