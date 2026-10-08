/* @layer core @kind types */
import type { VibrateResult, VibrateSegment } from '../device.type';

type RumbleFn = (deviceKey: string, low: number, high: number, durationMs: number) => boolean;

interface HapticPlayer {
  play: (deviceKey: string, pattern: readonly VibrateSegment[], gapMs: number) => VibrateResult;
  cancel: (deviceKey: string) => void;
  cancelAll: () => void;
}

export type { RumbleFn, HapticPlayer };
