/* @layer core @kind logic */
import { FRAMES_PER_SECOND, GAIN_SCALE } from './fade.constants';

const rampSeconds = (from: number, to: number, step: number): number =>
  Math.abs(to - from) / (step / GAIN_SCALE) / FRAMES_PER_SECOND;

export { rampSeconds };
