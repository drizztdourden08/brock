/* @layer core @kind logic */
import type { RatioLimits, RatioReadout } from './aspect-ratio.type';
import { RATIO_EPSILON } from './aspect-ratio.constants';
import { clampAndReduce } from './clamp-and-reduce';

const buildReadout = (long: number, short: number, limits: RatioLimits): RatioReadout => {
  const detected = long / short;
  const used = clampAndReduce(long, short, limits);
  return { detected, used: used.w / used.h, capped: detected > limits.max + RATIO_EPSILON };
};

export { buildReadout };
