/* @layer core @kind logic */
import type { RatioLimits, RatioPair } from './aspect-ratio.type';
import { clampAndReduce } from './clamp-and-reduce';
import { screenDims } from './screen-dims';

const detectScreenRatio = (limits: RatioLimits, letterbox = false, keepOrientation = false): RatioPair => {
  const { long, short, portrait } = screenDims(letterbox);
  return keepOrientation && portrait ? clampAndReduce(short, long, limits) : clampAndReduce(long, short, limits);
};

export { detectScreenRatio };
