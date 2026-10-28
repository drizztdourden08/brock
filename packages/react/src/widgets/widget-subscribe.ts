/* @layer renderer-shell @kind logic */
import { subscribeSnapshots } from './subscribe-snapshots';
import { useContextsStore } from '../contexts/useContextsStore';
import { useShowFlagsStore } from '../screens/show/useShowFlagsStore';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { useWidgetTitleStore } from './useWidgetTitleStore';
import { listWidgets } from './widget-list';
import type { WidgetListener } from './widget-snapshot.type';

const subscribeWidgets = (listener: WidgetListener): (() => void) =>
  subscribeSnapshots(listWidgets, [
    (on) => useWidgetLayoutStore.subscribe(on),
    (on) => useContextsStore.subscribe(on),
    (on) => useWidgetTitleStore.subscribe(on),
    (on) => useShowFlagsStore.subscribe(on),
  ], listener);

export { subscribeWidgets };
