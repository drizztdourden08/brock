/* @layer renderer-shell @kind hook */
import { useCallback, useReducer } from 'react';
import { IDLE_GUARD } from './keyed-guard.constants';
import { keyedGuardReducer } from './keyed-guard-reducer';
import type { KeyedGuard } from './keyed-guard.type';

const useKeyedGuard = (): KeyedGuard => {
  const [state, dispatch] = useReducer(keyedGuardReducer, IDLE_GUARD);

  const guard = useCallback(async <T,>(key: string, work: () => Promise<T>): Promise<T | undefined> => {
    dispatch({ type: 'start', key });
    try {
      const result = await work();
      dispatch({ type: 'done', key });
      return result;
    } catch (err) {
      dispatch({ type: 'fail', key, message: err instanceof Error ? err.message : String(err) });
      return undefined;
    }
  }, []);

  const isBusy = useCallback((key?: string) => (key === undefined ? Object.keys(state.busy).length > 0 : key in state.busy), [state.busy]);
  const errorOf = useCallback((key: string) => state.errors[key] ?? null, [state.errors]);
  const clearError = useCallback((key?: string) => dispatch({ type: 'clear', key }), []);

  return { guard, isBusy, errorOf, clearError, state };
};

export { useKeyedGuard };
