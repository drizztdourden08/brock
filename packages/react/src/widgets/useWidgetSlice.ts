/* @layer renderer-shell @kind hook */
import { useWidgetRelayStore } from './useWidgetRelayStore';

function useWidgetSlice<T>(kind: string): T | undefined;
function useWidgetSlice<T>(kind: string, fallback: T): T;
function useWidgetSlice<T>(kind: string, fallback?: T): T | undefined {
  const slice = useWidgetRelayStore((s) => s.slices[kind]) as T | undefined;
  return slice ?? fallback;
}

export { useWidgetSlice };
