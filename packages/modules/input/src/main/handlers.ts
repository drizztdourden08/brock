/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { InputMain } from './input-main.type';

const registerInputHandlers = ({ handle }: Pick<MainContext, 'handle'>, input: InputMain): void => {
  const { runtime, calibration } = input;
  handle('input:status', () => runtime().status());
  handle('input:list', () => runtime().source.snapshot());
  handle('input:listHid', () => runtime().source.listed());
  handle('input:rescan', () => { runtime().source.rescan(); });
  handle('input:rumble', (_event, ...args) => runtime().source.rumble(...args));
  handle('input:vibratePattern', (_event, deviceKey, pattern, gapMs) => runtime().haptics.play(deviceKey, pattern, gapMs));
  handle('input:mapping:add', (_event, mapping) => runtime().mappings.add(mapping));
  handle('input:mapping:forGuid', (_event, guid) => runtime().mappings.forGuid(guid));
  handle('input:calibration:readSticks', () => calibration.readSticks());
  handle('input:calibration:writeStick', (_event, deviceKey, value) => calibration.writeStick(deviceKey, value));
  handle('input:calibration:readTriggers', () => calibration.readTriggers());
  handle('input:calibration:writeTrigger', (_event, deviceKey, axisIndex, value) => calibration.writeTrigger(deviceKey, axisIndex, value));
};

export { registerInputHandlers };
