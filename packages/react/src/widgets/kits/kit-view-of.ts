/* @layer renderer-shell @kind logic */
import { defaultKitView } from './default-kit-view';
import type { KitView, KitViewSource } from './widget-kit.type';

const kitViewOf = (id: string, state: KitViewSource): KitView | null => {
  const kit = state.kits.find((each) => each.id === id);
  if (!kit) return null;
  return state.views[id] ?? defaultKitView(kit, state.members);
};

export { kitViewOf };
