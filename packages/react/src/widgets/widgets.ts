/* @layer renderer-shell @kind logic */
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { forcedWidgets } from './forced-widgets';
import { kitRoute } from './kits/kit-route';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { widgetBodyHolds } from './widget-body-holds';
import { applyPreset } from './widget-apply-preset';
import { dockEdit } from './widget-dock-edit';
import { floatEdit } from './widget-float-edit';
import { focusEdit } from './widget-focus-edit';
import { knownWidget } from './widget-known';
import { listWidgets } from './widget-list';
import { presetNames } from './widget-preset-names';
import { registerPresets } from './widget-register-presets';
import { resizeEdit } from './widget-resize-edit';
import type { SizedLayout } from './widget-resize-edit.type';
import { setWidgetTitle } from './widget-set-title';
import { subscribeWidgets } from './widget-subscribe';
import type { WidgetDockOptions, WidgetFloatRect, WidgetSized } from './widget-snapshot.type';
import { widgetVisible } from './widget-visible';

const opening = (change: (id: string) => void) => (id: string): void => {
  change(id);
  widgetBodyHolds.widgets([id]);
};

const editing = (id: string, edit: (layout: WidgetLayout) => WidgetLayout): void => {
  kitRoute.leave();
  useWidgetLayoutStore.getState().change(edit);
  widgetBodyHolds.widgets([id]);
};

const sized = (id: string, edit: (layout: WidgetLayout) => SizedLayout): WidgetSized => {
  let reason: string | null = null;
  editing(id, (layout) => {
    const done = edit(layout);
    reason = done.reason;
    return done.layout;
  });
  return { size: listWidgets().find((each) => each.id === id)?.size ?? null, reason };
};

const widgets = {
  open: opening((id) => useWidgetLayoutStore.getState().open(id)),
  close: (id: string): void => useWidgetLayoutStore.getState().close(id),
  toggle: opening((id) => useWidgetLayoutStore.getState().toggle(id)),
  popOut: (id: string): void => useWidgetLayoutStore.getState().popOut(id),
  reset: (): void => useWidgetLayoutStore.getState().reset(),
  force: (ids: readonly string[]): void => forcedWidgets.force(ids),
  isVisible: widgetVisible,
  list: listWidgets,
  dock: (id: string, options: WidgetDockOptions): WidgetSized => {
    const def = knownWidget(id);
    const { definitions } = useWidgetLayoutStore.getState();
    return sized(id, (layout) => dockEdit(layout, def, options, definitions));
  },
  float: (id: string, rect: WidgetFloatRect): void => {
    knownWidget(id);
    editing(id, (layout) => floatEdit(layout, id, rect));
  },
  resize: (id: string, to: number | WidgetFloatRect): WidgetSized => {
    knownWidget(id);
    return sized(id, (layout) => resizeEdit(layout, id, to));
  },
  focus: (id: string): void => {
    knownWidget(id);
    if (!isWidgetOpen(useWidgetLayoutStore.getState().layout, id)) useWidgetLayoutStore.getState().open(id);
    editing(id, (layout) => focusEdit(layout, id));
  },
  setTitle: setWidgetTitle,
  presets: presetNames,
  applyPreset,
  registerPresets,
  subscribe: subscribeWidgets,
};

export { widgets };
