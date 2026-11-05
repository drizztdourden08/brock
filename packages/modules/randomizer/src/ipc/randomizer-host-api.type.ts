/* @layer core @kind types */
import type { RandomizerLanApi } from './lan-host-api.type';
import type { LobbySocketEvent } from './lobby-socket-event.type';
import type { SaveArchipelagoFilesRequest, SaveArchipelagoFilesResult } from './save-files.type';

type RandomizerLobbySocketApi = {
  open: (id: string, url: string) => Promise<void>;
  send: (id: string, data: string) => Promise<void>;
  close: (id: string) => Promise<void>;
  onEvent: (listener: (event: LobbySocketEvent) => void) => () => void;
};

type RandomizerHostApi = {
  lobbySocket: RandomizerLobbySocketApi;
  lan: RandomizerLanApi;
  saveArchipelagoFiles: (request: SaveArchipelagoFilesRequest) => Promise<SaveArchipelagoFilesResult>;
};

export type { RandomizerHostApi, RandomizerLobbySocketApi };
