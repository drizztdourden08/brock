/* @layer renderer-shell @kind types */
import type { SavedNavigation } from '../navigation/navigation.type';

type ScreenStates = Record<string, Record<string, unknown>>;

interface ScreenStateState {
  byScope: ScreenStates;
  put: (scope: string, key: string, value: unknown) => void;
  hydrate: (states: ScreenStates) => void;
}

interface ScreenViews {
  nav?: SavedNavigation;
  state?: ScreenStates;
}

type ScreenStateSetter<T> = (next: T | ((previous: T) => T)) => void;

export type { ScreenStates, ScreenStateSetter, ScreenStateState, ScreenViews };
