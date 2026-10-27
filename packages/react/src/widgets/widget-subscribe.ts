/* @layer renderer-shell @kind logic */
import { useContextsStore } from '../contexts/useContextsStore';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { listWidgets } from './widget-list';
import type { WidgetListener } from './widget-snapshot.type';

const subscribeWidgets = (listener: WidgetListener): (() => void) => {
  let last = JSON.stringify(listWidgets());
  const notify = (): void => {
    const next = listWidgets();
    const key = JSON.stringify(next);
    if (key === last) return;
    last = key;
    listener(next);
  };
  const stops = [useWidgetLayoutStore.subscribe(notify), useContextsStore.subscribe(notify)];
  return () => {
    for (const stop of stops) stop();
  };
};

export { subscribeWidgets };
