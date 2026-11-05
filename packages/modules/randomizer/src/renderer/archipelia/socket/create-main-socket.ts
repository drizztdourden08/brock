/* @layer renderer-shell @kind logic */
import { createBrowserSocket } from '../../../archipelago';
import type { ArchipelagoSocket, CreateSocket } from '../../../archipelago';
import type { LobbySocketHandlers } from './lobby-socket-handlers.type';
import { registerLobbySocket } from './lobby-socket-hub';
import { randomizerApi } from './randomizer-api';

const CONNECTION_FAILED_CODE = 1006;

let counter = 0;

const quietly = (pending: Promise<void>): void => {
  pending.catch(() => undefined);
};

const createMainSocket: CreateSocket = (url) => {
  const host = randomizerApi();
  if (host === null) return createBrowserSocket(url);
  const api = host.lobbySocket;
  counter += 1;
  const id = `lobby-${String(counter)}-${crypto.randomUUID()}`;
  const handlers: LobbySocketHandlers = {};
  const socket: ArchipelagoSocket = {
    send: (data) => { quietly(api.send(id, data)); },
    close: () => { quietly(api.close(id)); },
    onOpen: (f) => { handlers.open = f; },
    onMessage: (f) => { handlers.message = f; },
    onClose: (f) => { handlers.close = f; },
  };
  registerLobbySocket(api, id, handlers);
  api.open(id, url).catch(() => { handlers.close?.(CONNECTION_FAILED_CODE); });
  return socket;
};

export { createMainSocket };
