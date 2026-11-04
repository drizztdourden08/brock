/* @layer core @kind logic */
import type { RatioLimits, RatioReadout } from './aspect-ratio.type';
import { buildReadout } from './build-readout';
import { screenDims } from './screen-dims';

const screenReadout = (limits: RatioLimits, letterbox = false): RatioReadout => {
  const { long, short } = screenDims(letterbox);
  return buildReadout(long, short, limits);
};

export { screenReadout };
