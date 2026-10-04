/* @layer renderer-shell @kind logic */
import type { KeyedGuardState } from './keyed-guard.type';

const lastGuardError = (state: KeyedGuardState): string | null => Object.values(state.errors).at(-1) ?? null;

export { lastGuardError };
