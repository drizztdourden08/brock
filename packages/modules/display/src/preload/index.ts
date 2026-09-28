/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import type { DisplayApi } from '../display.type';

const buildDisplayApi = ({ invoke, subscribe }: BridgeTools): DisplayApi => ({
  getRefreshRate: () => invoke('display:getRefreshRate'),
  getSyncedRateStatus: () => invoke('display:getSyncedRateStatus'),
  setSyncedRatePreference: (enabled, targetHz) => invoke('display:setSyncedRatePreference', enabled, targetHz),
  applyRefreshRate: (hz) => invoke('display:applyRefreshRate', hz),
  listMonitors: () => invoke('display:listMonitors'),
  getWindowMode: () => invoke('display:getWindowMode'),
  setWindowMode: (mode, monitorId) => invoke('display:setWindowMode', mode, monitorId),
  onChanged: (listener) => subscribe('display:changed', listener),
});

const displayPreload: PreloadNamespace = {
  id: 'display',
  build: buildDisplayApi,
};

export default displayPreload;
export { displayPreload, buildDisplayApi };
export type { DisplayApi } from '../display.type';
