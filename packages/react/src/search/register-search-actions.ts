/* @layer renderer-shell @kind logic */
import type { SearchAction } from './search.type';
import { useSearchActionStore } from './useSearchActionStore';

const registerSearchActions = (actions: readonly SearchAction[]): (() => void) =>
  useSearchActionStore.getState().add(actions);

export { registerSearchActions };
