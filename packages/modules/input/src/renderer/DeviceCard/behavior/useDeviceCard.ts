/* @layer renderer-shell @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { inputApi } from '../../input-api';
import { useCalibrationStore } from '../../useCalibrationStore';
import { useControllerState } from '../../useControllerState';
import type { CalibrationTarget, RumblePreset } from '../DeviceCard.type';
import { readSticks } from './read-sticks';
import { readTriggers } from './read-triggers';

const useDeviceCard = (deviceKey: string) => {
  const { buttons, axes } = useControllerState(deviceKey);
  const stickCalibration = useCalibrationStore((s) => s.sticks[deviceKey] ?? null);
  const triggerStore = useCalibrationStore((s) => s.triggers);
  const [target, setTarget] = useState<CalibrationTarget>(null);
  const [rumbleError, setRumbleError] = useState<string | null>(null);

  const sticks = useMemo(() => readSticks(axes, stickCalibration), [axes, stickCalibration]);
  const triggers = useMemo(() => readTriggers(deviceKey, axes, triggerStore), [deviceKey, axes, triggerStore]);

  const rumble = useCallback(async (preset: RumblePreset) => {
    const result = await inputApi()?.vibratePattern(deviceKey, preset.pattern, preset.gapMs);
    setRumbleError(result && !result.ok ? result.error ?? 'Rumble failed.' : null);
  }, [deviceKey]);

  const closeCalibration = useCallback(() => setTarget(null), []);

  return { buttons, sticks, triggers, stickCalibration, target, setTarget, closeCalibration, rumble, rumbleError };
};

export { useDeviceCard };
