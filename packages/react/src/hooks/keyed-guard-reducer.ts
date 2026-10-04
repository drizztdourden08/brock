/* @layer renderer-shell @kind logic */
import { IDLE_GUARD } from './keyed-guard.constants';
import type { KeyedGuardAction, KeyedGuardState } from './keyed-guard.type';

const without = <V>(record: Readonly<Record<string, V>>, key: string): Record<string, V> =>
  Object.fromEntries(Object.entries(record).filter(([entry]) => entry !== key));

const keyedGuardReducer = (state: KeyedGuardState, action: KeyedGuardAction): KeyedGuardState => {
  switch (action.type) {
    case 'start':
      return { busy: { ...state.busy, [action.key]: true }, errors: without(state.errors, action.key) };
    case 'done':
      return { ...state, busy: without(state.busy, action.key) };
    case 'fail':
      return { busy: without(state.busy, action.key), errors: { ...without(state.errors, action.key), [action.key]: action.message } };
    case 'clear':
      return action.key === undefined ? { ...state, errors: IDLE_GUARD.errors } : { ...state, errors: without(state.errors, action.key) };
  }
};

export { keyedGuardReducer };
