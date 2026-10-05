/* @layer renderer-shell @kind hook */
import { INACTIVE_CONTEXT } from './contexts.constants';
import type { AppContext } from './contexts.type';
import { useContextsStore } from './useContextsStore';

const useAppContext = <T = unknown>(name: string): AppContext<T> =>
  useContextsStore((s) => s.contexts[name] ?? INACTIVE_CONTEXT) as AppContext<T>;

export { useAppContext };
