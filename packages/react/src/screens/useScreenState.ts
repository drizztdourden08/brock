/* @layer renderer-shell @kind hook */
import { useCallback, useContext, useEffect } from 'react';
import type { ScreenStateSetter } from '../stores/screen-state.type';
import { useScreenStateStore } from '../stores/useScreenStateStore';
import type { TourResetPart } from '../tours/tour.type';
import { screenReset } from './screen-reset';
import { ScreenStateScope } from './screen-state-scope';

const isUpdate = <T>(next: T | ((previous: T) => T)): next is (previous: T) => T => typeof next === 'function';

const useScreenState = <T>(key: string, initial: T, part?: TourResetPart): [T, ScreenStateSetter<T>] => {
  const scope = useContext(ScreenStateScope);
  const stored = useScreenStateStore((s) => s.byScope[scope]?.[key]);
  const value = stored === undefined ? initial : (stored as T);
  useEffect(() => {
    if (part !== undefined) screenReset.classify(scope, key, part);
  }, [scope, key, part]);
  const set = useCallback<ScreenStateSetter<T>>((next) => {
    const store = useScreenStateStore.getState();
    const current = store.byScope[scope]?.[key];
    store.put(scope, key, isUpdate(next) ? next(current === undefined ? initial : (current as T)) : next);
  }, [scope, key, initial]);
  return [value, set];
};

export { useScreenState };
