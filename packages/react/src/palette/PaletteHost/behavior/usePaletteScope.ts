/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useRegisteredHubs } from '../../../hub/Hub/behavior/useRegisteredHubs';
import { useNavigationStore } from '../../../navigation/useNavigationStore';
import type { PaletteScope } from '../../../search/search.type';
import { usePaletteStore } from '../../usePaletteStore';

const usePaletteScope = (): PaletteScope | null => {
  const active = useNavigationStore((s) => s.active);
  const forced = usePaletteStore((s) => s.scope);
  const hubs = useRegisteredHubs();
  return useMemo(() => {
    const id = forced ?? active;
    const hub = hubs.find((candidate) => candidate.id === id);
    if (hub !== undefined) return { bucket: hub.id, title: hub.title };
    return forced === null ? null : { bucket: forced, title: forced };
  }, [hubs, active, forced]);
};

export { usePaletteScope };
