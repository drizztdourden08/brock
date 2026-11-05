/* @layer renderer-shell @kind logic */
import type { LobbySocketEvent } from '../../../ipc/lobby-socket-event.type';
import type { RandomizerLobbySocketApi } from '../../../ipc/randomizer-host-api.type';
import type { LobbySocketHandlers } from './lobby-socket-handlers.type';

const sockets = new Map<string, LobbySocketHandlers>();
let subscribed = false;

const dispatch = (event: LobbySocketEvent): void => {
  const handlers = sockets.get(event.id);
  if (handlers === undefined) return;
  if (event.kind === 'open') handlers.open?.();
  else if (event.kind === 'message') handlers.message?.(event.text);
  else if (event.kind === 'close') {
    sockets.delete(event.id);
    handlers.close?.(event.code);
  }
};

const registerLobbySocket = (api: RandomizerLobbySocketApi, id: string, handlers: LobbySocketHandlers): void => {
  if (!subscribed) {
    subscribed = true;
    api.onEvent(dispatch);
  }
  sockets.set(id, handlers);
};

export { registerLobbySocket };
