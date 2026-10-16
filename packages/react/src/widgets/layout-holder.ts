/* @layer renderer-shell @kind logic */
import { kitRoute } from './kits/kit-route';
import { useWidgetKitStore } from './kits/useWidgetKitStore';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import type { LayoutHolder } from './widget.type';

const layoutHolder = (id: string): LayoutHolder => {
  const kitLayout = kitRoute.openLayoutOf(id);
  if (kitLayout) {
    const kits = useWidgetKitStore.getState();
    return { layout: kitLayout, definitions: kits.members, change: kits.change };
  }
  const normal = useWidgetLayoutStore.getState();
  return { layout: normal.layout, definitions: normal.definitions, change: normal.change };
};

export { layoutHolder };
