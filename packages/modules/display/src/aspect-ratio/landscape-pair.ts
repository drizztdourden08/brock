/* @layer core @kind logic */
import type { LandscapePair } from './aspect-ratio.type';
import { horizontalSafeInset } from './horizontal-safe-inset';

const landscapePair = (width: number, height: number, letterbox: boolean): LandscapePair => {
  let long = Math.round(width >= height ? width : height);
  const short = Math.round(width >= height ? height : width);
  if (letterbox) long = Math.max(short, Math.round(long - horizontalSafeInset()));
  return { long, short };
};

export { landscapePair };
