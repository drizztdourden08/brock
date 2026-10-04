/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useRegisteredHubs } from '../../../hub/Hub/behavior/useRegisteredHubs';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import type { PaletteScope } from '../../../search/search.type';

const usePaletteScope = (): PaletteScope | null => {
  const active = useNavigationStore((s) => s.active);
  const hubs = useRegisteredHubs();
  return useMemo(() => {
    const hub = hubs.find((candidate) => candidate.id === active);
    return hub === undefined ? null : { bucket: hub.id, title: hub.title };
  }, [hubs, active]);
};

export { usePaletteScope };
