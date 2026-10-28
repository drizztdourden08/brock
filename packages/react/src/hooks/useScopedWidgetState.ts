/* @layer renderer-shell @kind hook */
import { useCallback, useEffect } from 'react';
import { useScopedStateStore } from '../stores/useScopedStateStore';
import type { WidgetStateUpdate } from './widget-state.type';

const isUpdater = <T,>(next: WidgetStateUpdate<T>): next is (prev: T) => T => typeof next === 'function';

const useScopedWidgetState = <T,>(scope: string | undefined, name: string, initial: T): readonly [T, (next: WidgetStateUpdate<T>) => void] => {
  const stored = useScopedStateStore((s) => (scope === undefined ? undefined : s.values[scope]?.[name]));

  useEffect(() => {
    if (scope !== undefined) void useScopedStateStore.getState().load(scope);
  }, [scope]);

  const set = useCallback((next: WidgetStateUpdate<T>) => {
    if (scope === undefined) return;
    const state = useScopedStateStore.getState();
    const prev = (state.values[scope]?.[name] ?? initial) as T;
    state.setValue(scope, name, isUpdater(next) ? next(prev) : next);
  }, [scope, name, initial]);

  return [(stored ?? initial) as T, set] as const;
};

export { useScopedWidgetState };
