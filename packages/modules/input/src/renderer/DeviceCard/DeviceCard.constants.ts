/* @layer renderer-shell @kind constants */
import { SDL_AXIS } from '../../input.constants';
import type { StickSlot, TriggerSlot } from '../axis-slot.type';
import type { RumblePreset } from './DeviceCard.type';

const STICK_SLOTS: StickSlot[] = [
  { side: 'left', label: 'Left stick', xAxis: SDL_AXIS.LEFTX, yAxis: SDL_AXIS.LEFTY },
  { side: 'right', label: 'Right stick', xAxis: SDL_AXIS.RIGHTX, yAxis: SDL_AXIS.RIGHTY },
];

const TRIGGER_SLOTS: TriggerSlot[] = [
  { axisIndex: SDL_AXIS.LEFT_TRIGGER, label: 'Left trigger' },
  { axisIndex: SDL_AXIS.RIGHT_TRIGGER, label: 'Right trigger' },
];

const RUMBLE_PRESETS: RumblePreset[] = [
  { key: 'short', label: 'Short', pattern: [{ durationMs: 100, intensity: 1 }], gapMs: 0 },
  { key: 'long', label: 'Long', pattern: [{ durationMs: 1000, intensity: 1 }], gapMs: 0 },
  { key: 'soft', label: 'Soft', pattern: [{ durationMs: 400, intensity: 0.3 }], gapMs: 0 },
  {
    key: 'triple',
    label: 'Triple',
    pattern: [{ durationMs: 100, intensity: 1 }, { durationMs: 100, intensity: 1 }, { durationMs: 100, intensity: 1 }],
    gapMs: 60,
  },
];

export { STICK_SLOTS, TRIGGER_SLOTS, RUMBLE_PRESETS };
