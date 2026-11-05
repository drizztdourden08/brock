/* @layer electron-main @kind logic */
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { registerLanHandlers } from './lan/register-lan-handlers';
import { registerLobbySocketHandlers } from './lobby-socket/register-lobby-socket-handlers';
import type { RandomizerMainOptions } from './main-options.type';
import { randomizerMainHooks } from './randomizer-main-hooks';
import { registerSaveFilesHandler } from './save-files/register-save-files-handler';

const createRandomizerMain = (options: RandomizerMainOptions = {}): MainModule => ({
  id: 'randomizer',
  register: (ctx) => {
    registerLobbySocketHandlers(ctx);
    registerSaveFilesHandler(ctx);
    registerLanHandlers(ctx, options.mdns);
  },
  profileHooks: randomizerMainHooks,
});

export { createRandomizerMain };
