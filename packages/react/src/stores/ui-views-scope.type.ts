/* @layer renderer-shell @kind types */
interface ScopeLimits {
  maxKeys: number;
  maxScopes: number;
}

interface ScopeOptions {
  maxKeys?: number;
}

interface ScopeRecord {
  at: number;
  order: string[];
  values: Record<string, unknown>;
}

interface UiViewScope {
  key: string;
  read: <T>(name: string, fallback: T) => Promise<T>;
  readAll: () => Promise<Record<string, unknown>>;
  write: (name: string, value: unknown) => Promise<void>;
  remove: (name: string) => Promise<void>;
  clear: () => Promise<void>;
}

export type { ScopeLimits, ScopeOptions, ScopeRecord, UiViewScope };
