/* @layer electron-main @kind logic */
import type { VibrateResult, VibrateSegment } from '../device.type';
import type { HapticPlayer, RumbleFn } from './haptic-player.type';

const createHapticPlayer = (rumble: RumbleFn): HapticPlayer => {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const cancel = (deviceKey: string): void => {
    const timer = timers.get(deviceKey);
    if (timer === undefined) return;
    clearTimeout(timer);
    timers.delete(deviceKey);
  };

  const playSegment = (deviceKey: string, pattern: readonly VibrateSegment[], index: number, gapMs: number): void => {
    const segment = pattern[index];
    if (!segment) {
      timers.delete(deviceKey);
      return;
    }
    const intensity = Math.max(0, Math.min(1, segment.intensity));
    rumble(deviceKey, intensity, intensity, segment.durationMs);
    const delay = segment.durationMs + (index === pattern.length - 1 ? 0 : gapMs);
    timers.set(deviceKey, setTimeout(() => playSegment(deviceKey, pattern, index + 1, gapMs), delay));
  };

  const play = (deviceKey: string, pattern: readonly VibrateSegment[], gapMs: number): VibrateResult => {
    cancel(deviceKey);
    if (pattern.length === 0) return { ok: true };
    if (!rumble(deviceKey, 0, 0, 0)) return { ok: false, error: `No connected device "${deviceKey}" with rumble.` };
    playSegment(deviceKey, pattern, 0, gapMs);
    return { ok: true };
  };

  const cancelAll = (): void => {
    for (const deviceKey of [...timers.keys()]) cancel(deviceKey);
  };

  return { play, cancel, cancelAll };
};

export { createHapticPlayer };
