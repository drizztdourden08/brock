/* @layer renderer-shell @kind logic */
import { applyStickCalibration } from '../calibration/apply-stick-calibration';
import { applyTriggerCalibration } from '../calibration/apply-trigger-calibration';
import type { DeviceStickCalibration, StickCalibrationStore, TriggerCalibrationStore } from '../calibration.type';
import { itemAt } from '../checked-access';
import { SDL_AXIS } from '../sdl/sdl-buttons.constants';

const calibrateStick = (axes: number[], xIndex: number, yIndex: number, saved: DeviceStickCalibration['left']): void => {
  const point = applyStickCalibration(itemAt(axes, xIndex), itemAt(axes, yIndex), saved);
  axes[xIndex] = point.x;
  axes[yIndex] = point.y;
};

const calibrateSticks = (axes: number[], saved: DeviceStickCalibration | undefined): void => {
  if (!saved || axes.length <= SDL_AXIS.RIGHT_Y) return;
  calibrateStick(axes, SDL_AXIS.LEFT_X, SDL_AXIS.LEFT_Y, saved.left);
  calibrateStick(axes, SDL_AXIS.RIGHT_X, SDL_AXIS.RIGHT_Y, saved.right);
};

const calibrateTriggers = (axes: number[], deviceKey: string, triggers: TriggerCalibrationStore): void => {
  for (let i: number = SDL_AXIS.LEFT_TRIGGER; i < axes.length; i++) {
    const saved = triggers[`${deviceKey}:${i}`];
    if (saved) axes[i] = applyTriggerCalibration(itemAt(axes, i), saved);
  }
};

const calibrateAxes = (
  deviceKey: string,
  axes: readonly number[],
  calibration: { sticks: StickCalibrationStore; triggers: TriggerCalibrationStore },
): number[] => {
  const calibrated = [...axes];
  calibrateSticks(calibrated, calibration.sticks[deviceKey]);
  calibrateTriggers(calibrated, deviceKey, calibration.triggers);
  return calibrated;
};

export { calibrateAxes };
