/* @layer renderer-shell @kind logic */
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { kitViewOf } from './kit-view-of';
import { memberKitOf } from './member-kit-of';
import { useWidgetKitStore } from './useWidgetKitStore';
import type { KitMemberAction } from './widget-kit.type';

const store = () => useWidgetKitStore.getState();

const member = (id: string, action: KitMemberAction): boolean => {
  if (memberKitOf(store(), id) === null) return false;
  store()[action](id);
  return true;
};

const leave = (): boolean => {
  if (store().active === null) return false;
  store().close();
  return true;
};

const openLayoutOf = (id: string): WidgetLayout | null => {
  const state = store();
  const kit = memberKitOf(state, id);
  return kit !== null && state.active === kit ? kitViewOf(kit, state)?.layout ?? null : null;
};

const kitRoute = { member, leave, openLayoutOf, isMember: (id: string): boolean => memberKitOf(store(), id) !== null };

export { kitRoute };
