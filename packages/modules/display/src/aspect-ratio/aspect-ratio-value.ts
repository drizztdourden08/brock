/* @layer core @kind logic */
import type { CustomRatioInput } from './aspect-ratio.type';
import { detectScreenRatio } from './detect-screen-ratio';
import { detectViewportRatio } from './detect-viewport-ratio';
import { effectiveCustomRatio } from './effective-custom-ratio';
import { parseRatioString } from './parse-ratio-string';

const aspectRatioValue = (ratio: string, input: CustomRatioInput): number => {
  const { customW, customH, limits, letterbox = false } = input;
  if (ratio === 'auto') {
    const { w, h } = detectViewportRatio(limits, letterbox);
    return w / h;
  }
  if (ratio === 'screen') {
    const { w, h } = detectScreenRatio(limits);
    return w / h;
  }
  if (ratio === 'custom') {
    const { w, h } = effectiveCustomRatio(customW, customH, limits, letterbox);
    return w / h;
  }
  return parseRatioString(ratio);
};

export { aspectRatioValue };
