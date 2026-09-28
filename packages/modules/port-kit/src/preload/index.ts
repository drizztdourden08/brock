/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import type { PortKitApi } from '../port-kit.type';

const buildPortKitApi = ({ invoke }: BridgeTools): PortKitApi => ({
  readCore: (file) => invoke('port-kit:readCore', file),
});

const portKitPreload: PreloadNamespace = {
  id: 'portKit',
  build: buildPortKitApi,
};

export default portKitPreload;
export { portKitPreload, buildPortKitApi };
export type { PortKitApi } from '../port-kit.type';
