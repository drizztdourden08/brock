/* @layer core @kind logic */
import type { RatioLimits, RatioPair } from './aspect-ratio.type';
import { clampAndReduce } from './clamp-and-reduce';
import { screenDims } from './screen-dims';

const detectScreenRatio = (limits: RatioLimits, letterbox = false): RatioPair => {
  const { long, short } = screenDims(letterbox);
  return clampAndReduce(long, short, limits);
};

export { detectScreenRatio };
