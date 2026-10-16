/* @layer renderer-shell @kind hook */
import { useEffect, useMemo } from 'react';
import { uniqueById } from '../../../collections/unique-by-id';
import { groupedMembers } from '../../kits/grouped-members';
import { useKitRegistryStore } from '../../kits/useKitRegistryStore';
import { useWidgetKitStore } from '../../kits/useWidgetKitStore';
import type { WidgetKitDef } from '../../kits/widget-kit.type';
import { useWidgetLayoutStore } from '../../useWidgetLayoutStore';
import type { WidgetDef } from '../../widget.type';

const useKitSplit = (definitions: readonly WidgetDef[], given: readonly WidgetKitDef[]): WidgetDef[] => {
  const registered = useKitRegistryStore((s) => s.registered);
  const kits = useMemo(() => uniqueById([...given, ...registered]), [given, registered]);
  const normal = useMemo(() => definitions.filter((def) => def.kit === undefined), [definitions]);
  const members = useMemo(() => groupedMembers(definitions, kits), [definitions, kits]);

  useEffect(() => useWidgetLayoutStore.getState().setDefinitions(normal), [normal]);
  useEffect(() => useWidgetKitStore.getState().setKits(kits, members), [kits, members]);
  return normal;
};

export { useKitSplit };
