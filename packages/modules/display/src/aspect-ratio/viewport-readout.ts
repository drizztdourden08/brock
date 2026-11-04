/* @layer core @kind logic */
import type { RatioLimits, RatioReadout } from './aspect-ratio.type';
import { buildReadout } from './build-readout';
import { viewportDims } from './viewport-dims';

const viewportReadout = (limits: RatioLimits, letterbox = false): RatioReadout => {
  const { long, short } = viewportDims(letterbox);
  return buildReadout(long, short, limits);
};

export { viewportReadout };
