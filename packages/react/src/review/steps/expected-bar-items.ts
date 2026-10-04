/* @layer renderer-shell @kind logic */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { BAR_ITEM_PREFIX } from '../review.constants';

const onBar = (action: WindowTitleBarAction): boolean => {
  if (action.bar === 'dropdown') return action.groups.some((group) => group.items.length > 0);
  const bar = action.bar ?? 'button';
  return bar === 'button' || (bar === 'status' && Boolean(action.status));
};

const expectedBarItems = (actions: readonly WindowTitleBarAction[]): string[] =>
  actions.filter(onBar).map((action) => `${BAR_ITEM_PREFIX}${action.id}`);

export { expectedBarItems };
