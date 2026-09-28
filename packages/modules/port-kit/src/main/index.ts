/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { registerPortKitHandlers } from './handlers';

const portKitMain: MainModule = {
  id: 'port-kit',
  dataDirs: ['roms', 'assets'],
  register: (ctx) => {
    registerPortKitHandlers(ctx);
  },
};

export default portKitMain;
export { portKitMain };
