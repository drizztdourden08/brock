/* @layer renderer-shell @kind logic */
import { paneOf } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { DockOrigin } from './widget.type';

const origins = new Map<string, DockOrigin>();

const isPopped = (layout: WidgetLayout, id: string): boolean => layout.popped.some((p) => p.id === id);

const dockOrigins = {
  record: (prev: WidgetLayout, next: WidgetLayout): void => {
    for (const popped of next.popped) {
      const pane = isPopped(prev, popped.id) ? null : paneOf(prev.dock, popped.id);
      if (pane) origins.set(popped.id, { pane: pane.key, index: pane.widgets.indexOf(popped.id) });
    }
  },
  of: (id: string): DockOrigin | undefined => origins.get(id),
  forget: (id: string): void => { origins.delete(id); },
};

export { dockOrigins };
