/* @layer renderer-shell @kind types */
interface RegistryState<T> {
  groups: readonly (readonly T[])[];
  add: (items: readonly T[]) => () => void;
}

export type { RegistryState };
