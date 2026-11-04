/* @layer electron-main @kind barrel */
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { randomizerMainHooks } from './randomizer-main-hooks';

const randomizerMain: MainModule = {
  id: 'randomizer',
  register: () => undefined,
  profileHooks: randomizerMainHooks,
};

export default randomizerMain;
export { randomizerMain };
