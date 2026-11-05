/* @layer electron-main @kind logic */
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { registerAudioProbeHandler } from './audio-probe/register-audio-probe-handler';
import { MSU_MODULE_ID } from './msu-main.constants';
import { registerMsulHandler } from './msul/register-msul-handler';
import { registerOptimizeHandlers } from './optimize/register-optimize-handlers';

const msuMain: MainModule = {
  id: MSU_MODULE_ID,
  register: (ctx) => {
    registerMsulHandler(ctx);
    registerOptimizeHandlers(ctx);
    registerAudioProbeHandler(ctx);
  },
};

export { msuMain };
