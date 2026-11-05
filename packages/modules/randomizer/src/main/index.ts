/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { registerLobbySocketHandlers } from './lobby-socket/register-lobby-socket-handlers';
import { randomizerMainHooks } from './randomizer-main-hooks';
import { registerSaveFilesHandler } from './save-files/register-save-files-handler';

const randomizerMain: MainModule = {
  id: 'randomizer',
  register: (ctx) => {
    registerLobbySocketHandlers(ctx);
    registerSaveFilesHandler(ctx);
  },
  profileHooks: randomizerMainHooks,
};

export default randomizerMain;
export { randomizerMain };
