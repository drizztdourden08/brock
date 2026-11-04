/* @layer core @kind logic */
import type { RatioLimits, RatioPair } from './aspect-ratio.type';
import { detectScreenRatio } from './detect-screen-ratio';

const effectiveCustomRatio = (w: number, h: number, limits: RatioLimits, letterbox = false): RatioPair =>
  w > 0 && h > 0 ? { w, h } : detectScreenRatio(limits, letterbox);

export { effectiveCustomRatio };
