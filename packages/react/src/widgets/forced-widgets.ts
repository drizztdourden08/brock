/* @layer renderer-shell @kind logic */
import { getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import { kitRoute } from './kits/kit-route';
import { useForcedWidgetStore } from './useForcedWidgetStore';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { widgetBodyHolds } from './widget-body-holds';

const known = (id: string): boolean => getWidgetDefinition(useWidgetLayoutStore.getState().definitions, id) !== undefined || kitRoute.isMember(id);

const apply = (): void => {
  const { pending } = useForcedWidgetStore.getState();
  const ready = pending.filter(known);
  if (ready.length === 0) return;
  useForcedWidgetStore.setState({ pending: pending.filter((id) => !ready.includes(id)) });
  for (const id of ready) useWidgetLayoutStore.getState().open(id);
  widgetBodyHolds.widgets(ready);
};

const force = (ids: readonly string[]): void => {
  const unique = [...new Set(ids)];
  useForcedWidgetStore.setState({ ids: unique, pending: unique });
  apply();
  widgetBodyHolds.widgets(unique);
};

const rearm = (): void => {
  useForcedWidgetStore.setState((state) => ({ pending: state.ids }));
  apply();
  widgetBodyHolds.widgets(useForcedWidgetStore.getState().ids);
};

const forcedWidgets = { force, apply, rearm, ids: (): readonly string[] => useForcedWidgetStore.getState().ids };

export { forcedWidgets };
