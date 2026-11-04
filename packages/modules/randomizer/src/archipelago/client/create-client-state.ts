/* @layer core @kind logic */
import type { ClientState } from './client-state.type';

const createClientState = (): ClientState => ({
  link: null,
  connection: null,
  stopped: false,
  failed: false,
  everConnected: false,
  closeReason: '',
  workingUrl: null,
  unsubscribeSwap: null,
});

export { createClientState };
