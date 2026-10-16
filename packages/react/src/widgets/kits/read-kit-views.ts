/* @layer renderer-shell @kind logic */
import { migrateLayout } from '@drizztdourden08/tessera/composites';
import { isRecord } from '../../collections/is-record';
import { dropWindowGroups } from '../drop-window-groups';
import type { KitView } from './widget-kit.type';

const readKitView = (stored: unknown): KitView | null => {
  if (!isRecord(stored) || !isRecord(stored.layout)) return null;
  const hidden = Array.isArray(stored.hidden) ? stored.hidden.filter((id): id is string => typeof id === 'string') : [];
  return { layout: dropWindowGroups(migrateLayout(stored.layout)), hidden };
};

const readKitViews = (stored: unknown): Record<string, KitView> => {
  if (!isRecord(stored)) return {};
  return Object.fromEntries(Object.entries(stored).flatMap(([id, entry]) => {
    const view = readKitView(entry);
    return view ? [[id, view]] : [];
  }));
};

export { readKitViews };
