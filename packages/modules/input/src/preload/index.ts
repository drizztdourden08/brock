/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import type { InputApi } from '../input-api.type';

const buildInputApi = ({ invoke, subscribe }: BridgeTools): InputApi => ({
  status: () => invoke('input:status'),
  list: () => invoke('input:list'),
  listHid: () => invoke('input:listHid'),
  rescan: () => invoke('input:rescan'),
  rumble: (deviceKey, low, high, durationMs) => invoke('input:rumble', deviceKey, low, high, durationMs),
  vibratePattern: (deviceKey, pattern, gapMs) => invoke('input:vibratePattern', deviceKey, pattern, gapMs),
  onAdded: (listener) => subscribe('input:added', listener),
  onRemoved: (listener) => subscribe('input:removed', listener),
  onState: (listener) => subscribe('input:state', listener),
  onDevices: (listener) => subscribe('input:devices', listener),
  mapping: {
    add: (mapping) => invoke('input:mapping:add', mapping),
    forGuid: (guid) => invoke('input:mapping:forGuid', guid),
  },
  calibration: {
    readSticks: () => invoke('input:calibration:readSticks'),
    writeStick: (deviceKey, value) => invoke('input:calibration:writeStick', deviceKey, value),
    readTriggers: () => invoke('input:calibration:readTriggers'),
    writeTrigger: (deviceKey, axisIndex, value) => invoke('input:calibration:writeTrigger', deviceKey, axisIndex, value),
  },
  capture: {
    startRaw: (vendorId, productId) => invoke('input:capture:startRaw', vendorId, productId),
    stopRaw: () => invoke('input:capture:stopRaw'),
    startJoystick: (joystickId) => invoke('input:capture:startJoystick', joystickId),
    stopJoystick: () => invoke('input:capture:stopJoystick'),
    listJoysticks: () => invoke('input:capture:listJoysticks'),
    releaseHold: () => invoke('input:capture:releaseHold'),
    restoreHold: () => invoke('input:capture:restoreHold'),
    onRaw: (listener) => subscribe('input:raw', listener),
    onJoystick: (listener) => subscribe('input:joystick', listener),
    onHoldChanged: (listener) => subscribe('input:holdChanged', listener),
  },
});

const inputPreload: PreloadNamespace = {
  id: 'input',
  build: buildInputApi,
};

export default inputPreload;
export { inputPreload, buildInputApi };
export type { InputApi, InputCalibrationApi, InputCaptureApi, InputMappingApi } from '../input-api.type';
