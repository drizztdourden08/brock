/* @layer core @kind types */
interface Registry<T extends { id: string }> {
  register: (item: T) => void;
  registerAll: (items: Iterable<T>) => void;
  get: (id: string) => T | undefined;
  has: (id: string) => boolean;
  list: () => T[];
  ids: () => string[];
  subscribe: (listener: (items: T[]) => void) => () => void;
}

export type { Registry };
