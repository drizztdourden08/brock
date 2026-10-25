/* @layer renderer-shell @kind logic */
import { getAppLog } from '../log/get-app-log';
import { SECOND_HOST_WARNING } from './host-claim.constants';

const state: { claims: string[]; warned: boolean; listeners: Set<() => void> } = { claims: [], warned: false, listeners: new Set() };

const emit = (): void => {
  for (const listener of state.listeners) listener();
};

const claim = (id: string): (() => void) => {
  if (state.claims.length > 0 && !state.warned) {
    state.warned = true;
    getAppLog().log('app', SECOND_HOST_WARNING, 'warn');
  }
  state.claims = [...state.claims, id];
  emit();
  return () => {
    state.claims = state.claims.filter((each) => each !== id);
    emit();
  };
};

const subscribe = (listener: () => void): (() => void) => {
  state.listeners.add(listener);
  return () => {
    state.listeners.delete(listener);
  };
};

const owner = (): string | null => state.claims[0] ?? null;

const reset = (): void => {
  state.claims = [];
  state.warned = false;
};

const hostClaim = { claim, subscribe, owner, reset };

export { hostClaim };
