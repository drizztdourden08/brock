/* @layer renderer-shell @kind logic */
import type { WidgetKitState } from './widget-kit.type';

const memberKitOf = (state: Pick<WidgetKitState, 'kits' | 'members'>, id: string): string | null => {
  const kit = state.members.find((def) => def.id === id)?.kit;
  return kit !== undefined && state.kits.some((each) => each.id === kit) ? kit : null;
};

export { memberKitOf };
