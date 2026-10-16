/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useDeveloperTools } from '../../app/useDeveloperTools';
import { useContextsStore } from '../../contexts/useContextsStore';
import type { MenuItem } from '../../menu/menu.type';
import { buildKitMenuEntries } from './build-kit-menu-entries';
import { kitStatus } from './kit-status';
import { useWidgetKitStore } from './useWidgetKitStore';

const useKitMenuEntries = (): MenuItem[] => {
  const developerTools = useDeveloperTools();
  const contexts = useContextsStore((s) => s.contexts);
  const kits = useWidgetKitStore((s) => s.kits);
  const members = useWidgetKitStore((s) => s.members);
  const active = useWidgetKitStore((s) => s.active);
  const views = useWidgetKitStore((s) => s.views);
  return useMemo(() => {
    const { toggle, toggleMember, toggleOverlay, reset } = useWidgetKitStore.getState();
    return buildKitMenuEntries({ kits, members, active, views, toggle, toggleMember, toggleOverlay, reset }, (kit) => kitStatus(kit, contexts, developerTools));
  }, [kits, members, active, views, contexts, developerTools]);
};

export { useKitMenuEntries };
