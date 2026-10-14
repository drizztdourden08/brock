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
export { runAssetWorkerJob } from './assets/run-asset-worker-job';
export type { AssetWorkerJobOptions } from './assets/asset-worker-job.type';
export type { AssetWorkerStepDef } from '../assets/worker/asset-worker.type';
