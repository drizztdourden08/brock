/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import type { MsuHostApi } from '../ipc/msu-host-api.type';

const buildMsuHostApi = ({ invoke, subscribe }: BridgeTools): MsuHostApi => ({
  readMsul: (filePath) => invoke('msu:msul:read', filePath),
  measureOptimize: (packName) => invoke('msu:optimize:measure', packName),
  runOptimize: (packName, fileNames) => invoke('msu:optimize:convert', packName, fileNames),
  onOptimizeProgress: (listener) => subscribe('msu:optimize:step', listener),
  probeAudio: (dataPath) => invoke('msu:audio:probe', dataPath),
});

const msuPreload: PreloadNamespace = {
  id: 'msu',
  build: buildMsuHostApi,
};

export default msuPreload;
export { msuPreload, buildMsuHostApi };
export type { MsuHostApi } from '../ipc/msu-host-api.type';
