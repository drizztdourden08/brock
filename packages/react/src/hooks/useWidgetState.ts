/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useWidgetPrefStore } from '../stores/useWidgetPrefStore';
import { useWidgetId } from '../widgets/useWidgetId';
import type { WidgetStateUpdate } from './widget-state.type';
import { useWidgetPref } from './useWidgetPref';

const isUpdater = <T,>(next: WidgetStateUpdate<T>): next is (prev: T) => T => typeof next === 'function';

const useWidgetState = <T,>(key: string, initial: T): readonly [T, (next: WidgetStateUpdate<T>) => void] => {
  const widgetId = useWidgetId();
  const [value, setValue] = useWidgetPref<T>(widgetId, key, initial);

  const set = useCallback((next: WidgetStateUpdate<T>) => {
    if (!isUpdater(next)) {
      setValue(next);
      return;
    }
    const stored = widgetId ? useWidgetPrefStore.getState().byWidget[widgetId]?.[key] : undefined;
    setValue(next(widgetId ? ((stored ?? initial) as T) : value));
  }, [widgetId, key, initial, value, setValue]);

  return [value, set] as const;
};

export { useWidgetState };
