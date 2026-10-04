/* @layer renderer-shell @kind hook */
import { useCallback, useContext } from 'react';
import type { ScreenStateSetter } from '../stores/screen-state.type';
import { useScreenStateStore } from '../stores/useScreenStateStore';
import { ScreenStateScope } from './screen-state-scope';

const isUpdate = <T>(next: T | ((previous: T) => T)): next is (previous: T) => T => typeof next === 'function';

const useScreenState = <T>(key: string, initial: T): [T, ScreenStateSetter<T>] => {
  const scope = useContext(ScreenStateScope);
  const stored = useScreenStateStore((s) => s.byScope[scope]?.[key]);
  const value = stored === undefined ? initial : (stored as T);
  const set = useCallback<ScreenStateSetter<T>>((next) => {
    const store = useScreenStateStore.getState();
    const current = store.byScope[scope]?.[key];
    store.put(scope, key, isUpdate(next) ? next(current === undefined ? initial : (current as T)) : next);
  }, [scope, key, initial]);
  return [value, set];
};

export { useScreenState };
