/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { HUB_DEFS } from '../../hub.constants';
import type { HubDef } from '../../hub.type';

const useRegisteredHubs = (): HubDef[] => {
  const registry = useScreenRegistry();
  return useMemo(() => registry.list().flatMap((screen) => {
    const def = HUB_DEFS.get(screen);
    return def ? [def] : [];
  }), [registry]);
};

export { useRegisteredHubs };
