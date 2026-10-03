/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { getWidgetDefinition, setFrame, setPopped } from '@drizztdourden08/tessera/composites';
import type { PoppedWidget, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { hostApi } from '../../../host/host-api';
import { useWidgetPrefStore } from '../../../stores/useWidgetPrefStore';
import { dockBack } from '../../dock-back';
import { externalDrags } from '../../external-drags';
import { poppedWindows } from '../../popped-windows';
import { useWidgetLayoutStore } from '../../useWidgetLayoutStore';
import { widgetMainRect } from '../../widget-main-rect';

const store = () => useWidgetLayoutStore.getState();

const isPopped = (id: string): boolean => store().layout.popped.some((p) => p.id === id);

const whenPopped = (id: string, fn: (layout: WidgetLayout) => WidgetLayout): void => {
  if (isPopped(id)) store().change(fn);
};

const mainOrWindow = () => widgetMainRect.current ?? { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };

const listen = (): (() => void) => {
  const api = hostApi();
  if (!api) return () => undefined;
  const offs = [
    api.onWidgetClosed((id, where, seq) => {
      if (!poppedWindows.settle(id, seq)) return;
      whenPopped(id, (layout) => dockBack(layout, id, where, { definitions: store().definitions, main: mainOrWindow() }));
    }),
    api.onWidgetBounds((id, bounds) => whenPopped(id, (layout) => setPopped(layout, id, { bounds }))),
    api.onWidgetPopped((id, patch) => whenPopped(id, (layout) => setPopped(layout, id, patch))),
    api.onWidgetFrame((id, patch) => store().change((layout) => setFrame(layout, id, patch, getWidgetDefinition(store().definitions, id)))),
    api.onWidgetDragOver(externalDrags.over),
    api.onWidgetDropIn(externalDrags.release),
    api.onWidgetPrefs((id, prefs) => useWidgetPrefStore.getState().replaceWidget(id, prefs)),
  ];
  return () => {
    for (const off of offs) off();
  };
};

const usePopOutWindows = (shown: readonly PoppedWidget[], extraOf: (id: string) => Partial<WidgetWindowOpen>): void => {
  useEffect(listen, []);
  useEffect(() => poppedWindows.sync(shown, extraOf), [shown, extraOf]);
};

export { usePopOutWindows };
