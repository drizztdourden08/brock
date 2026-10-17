/* @layer renderer-shell @kind logic */
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { kitViewOf } from '../widgets/kits/kit-view-of';
import { useWidgetKitStore } from '../widgets/kits/useWidgetKitStore';
import { useForcedWidgetStore } from '../widgets/useForcedWidgetStore';
import { useWidgetLayoutStore } from '../widgets/useWidgetLayoutStore';
import type { WidgetDef } from '../widgets/widget.type';

const forced = (id: string): boolean => useForcedWidgetStore.getState().ids.includes(id);

const closeOpen = (definitions: readonly WidgetDef[], layout: WidgetLayout | null): void => {
  const open = definitions.filter((def) => def.devOnly === true && !forced(def.id) && layout !== null && isWidgetOpen(layout, def.id));
  for (const def of open) useWidgetLayoutStore.getState().close(def.id);
};

const closeDeveloperKit = (): void => {
  const kits = useWidgetKitStore.getState();
  const kit = kits.kits.find((each) => each.id === kits.active);
  if (!kit) return;
  const members = kits.members.filter((def) => def.kit === kit.id);
  if (kit.devOnly === true && !members.some((def) => forced(def.id))) kits.close();
  else closeOpen(members, kitViewOf(kit.id, kits)?.layout ?? null);
};

const closeDeveloperWidgets = (): void => {
  closeDeveloperKit();
  const { definitions, layout } = useWidgetLayoutStore.getState();
  closeOpen(definitions, layout);
};

export { closeDeveloperWidgets };
