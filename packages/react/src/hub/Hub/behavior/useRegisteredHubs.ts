/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { isShown } from '../../../screens/show/is-shown';
import { useShowContext } from '../../../screens/show/useShowContext';
import { HUB_DEFS } from '../../hub.constants';
import type { HubDef } from '../../hub.type';

const useRegisteredHubs = (): HubDef[] => {
  const registry = useScreenRegistry();
  const show = useShowContext();
  return useMemo(() => registry.list().flatMap((screen) => {
    const def = HUB_DEFS.get(screen);
    return def && isShown(def.show, show) ? [def] : [];
  }), [registry, show]);
};

export { useRegisteredHubs };
