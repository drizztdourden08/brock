/* @layer renderer-shell @kind hook */
import { useWidgetId } from '../widgets/useWidgetId';
import type { WidgetStateOptions, WidgetStateUpdate } from './widget-state.type';
import { usePlainWidgetState } from './usePlainWidgetState';
import { useScopedWidgetState } from './useScopedWidgetState';

const useWidgetState = <T,>(key: string, initial: T, options: WidgetStateOptions = {}): readonly [T, (next: WidgetStateUpdate<T>) => void] => {
  const widgetId = useWidgetId();
  const plain = usePlainWidgetState(widgetId, key, initial);
  const scoped = useScopedWidgetState(options.scope, widgetId === null ? key : `${widgetId}/${key}`, initial);
  return options.scope === undefined ? plain : scoped;
};

export { useWidgetState };
