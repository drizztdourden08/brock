/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { registerCaptureHandlers } from './capture-handlers';
import { registerInputHandlers } from './handlers';
import { getInput } from './input-main';
import { INPUT_DIR } from '../mapping/mapping-db.constants';

const inputMain: MainModule = {
  id: 'input',
  dataDirs: [INPUT_DIR],
  register: (ctx) => {
    const input = getInput(ctx);
    registerInputHandlers(ctx, input);
    registerCaptureHandlers(ctx, input);
  },
  onWindow: (_win, ctx) => {
    getInput(ctx).start().catch((err: unknown) => {
      ctx.log(`input: start failed: ${err instanceof Error ? err.message : String(err)}`, 'error');
    });
  },
  onWillQuit: (ctx) => {
    getInput(ctx).stop();
  },
};

export default inputMain;
export { inputMain, getInput };
export { isMappingLine } from '../mapping/is-mapping-line';
export { applyStickCalibration } from '../calibration/apply-stick-calibration';
export { applyTriggerCalibration } from '../calibration/apply-trigger-calibration';
export type { InputMain, InputOptions, InputRuntime } from './input-main.type';
export type { ControllerSource } from './controller-source.type';
export type { HapticPlayer } from '../haptics/haptic-player.type';
export type { MappingDb } from './mapping-db.type';
export type { CalibrationStore } from '../calibration/calibration-store.type';
export type { Sdl3Input, Sdl3Event, Sdl3EventCallback, Sdl3HidDevice, Sdl3RawCaptureResult } from './sdl3.type';
export type {
  ControllerAddedInfo, DeviceEntry, HidListedDevice, InputStatus, VibrateResult, VibrateSegment,
} from '../device.type';
export type {
  DeviceStickCalibration, StickCalibration, TriggerCalibration, StickCalibrationStore, TriggerCalibrationStore,
} from '../calibration.type';
