/* @layer core @kind logic */
import { GAIN_SCALE, MIN_RAMP_SECONDS } from './fade.constants';
import { rampSeconds } from './ramp-seconds';

const applyFade = (gain: GainNode, now: number, target: number, step: number): number => {
  const level = target / GAIN_SCALE;
  const seconds = rampSeconds(gain.gain.value, level, step);
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(level, now + Math.max(MIN_RAMP_SECONDS, seconds));
  return level;
};

export { applyFade };
