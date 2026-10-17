/* @layer renderer-shell @kind logic */
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { kitRoute } from './kits/kit-route';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';

const widgetVisible = (id: string): boolean => {
  if (!kitRoute.isMember(id)) return isWidgetOpen(useWidgetLayoutStore.getState().layout, id);
  const layout = kitRoute.openLayoutOf(id);
  return layout !== null && isWidgetOpen(layout, id);
};

export { widgetVisible };
