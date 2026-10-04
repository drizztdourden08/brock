/* @layer renderer-shell @kind logic */
import type { PoppedWidget, WidgetLayout } from '@drizztdourden08/tessera/composites';

const grouped = (popped: PoppedWidget | undefined): boolean => popped !== undefined && 'group' in popped;

const withoutGroup = (popped: PoppedWidget): PoppedWidget => {
  if (!grouped(popped)) return popped;
  const { group: _group, ...rest } = popped as PoppedWidget & { group?: unknown };
  return rest;
};

const dropWindowGroups = (layout: WidgetLayout): WidgetLayout => {
  const memory = layout.poppedMemory;
  const remembered = Object.values(memory ?? {});
  if (!layout.popped.some(grouped) && !remembered.some(grouped)) return layout;
  return {
    ...layout,
    popped: layout.popped.map(withoutGroup),
    ...(memory ? { poppedMemory: Object.fromEntries(Object.entries(memory).map(([id, entry]) => [id, entry && withoutGroup(entry)])) } : {}),
  };
};

export { dropWindowGroups };
