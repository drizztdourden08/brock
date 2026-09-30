/* @layer renderer-shell @kind types */
interface KeyedGuardState {
  busy: Readonly<Record<string, true>>;
  errors: Readonly<Record<string, string>>;
}

type KeyedGuardAction =
  | { type: 'start'; key: string }
  | { type: 'done'; key: string }
  | { type: 'fail'; key: string; message: string }
  | { type: 'clear'; key?: string };

interface KeyedGuard {
  guard: <T>(key: string, work: () => Promise<T>) => Promise<T | undefined>;
  isBusy: (key?: string) => boolean;
  errorOf: (key: string) => string | null;
  clearError: (key?: string) => void;
  state: KeyedGuardState;
}

export type { KeyedGuardState, KeyedGuardAction, KeyedGuard };
