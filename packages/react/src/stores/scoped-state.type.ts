/* @layer renderer-shell @kind types */
type ScopedValues = Record<string, Record<string, unknown>>;

interface ScopedStateState {
  values: ScopedValues;
  loaded: Record<string, true>;
  load: (scopeKey: string) => Promise<void>;
  setValue: (scopeKey: string, name: string, value: unknown) => void;
}

export type { ScopedStateState, ScopedValues };
