/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import type { RandomizerHostApi } from '../ipc/randomizer-host-api.type';

const buildRandomizerHostApi = ({ invoke, subscribe }: BridgeTools): RandomizerHostApi => ({
  lobbySocket: {
    open: (id, url) => invoke('randomizer:lobby-socket:open', id, url),
    send: (id, data) => invoke('randomizer:lobby-socket:send', id, data),
    close: (id) => invoke('randomizer:lobby-socket:close', id),
    onEvent: (listener) => subscribe('randomizer:lobby-socket:event', listener),
  },
  saveArchipelagoFiles: (request) => invoke('randomizer:archipelago:save-files', request),
});

const randomizerPreload: PreloadNamespace = {
  id: 'randomizer',
  build: buildRandomizerHostApi,
};

export default randomizerPreload;
export { randomizerPreload, buildRandomizerHostApi };
export type { RandomizerHostApi, RandomizerLobbySocketApi } from '../ipc/randomizer-host-api.type';
export type { LobbySocketEvent } from '../ipc/lobby-socket-event.type';
export type { SaveArchipelagoFilesRequest, SaveArchipelagoFilesResult } from '../ipc/save-files.type';
