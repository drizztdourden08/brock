/* @layer core @kind logic */
import type { RatioCheck, RatioLimits } from './aspect-ratio.type';
import { RATIO_EPSILON } from './aspect-ratio.constants';

const validateCustomRatio = (w: number, h: number, limits: RatioLimits): RatioCheck => {
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1) {
    return { valid: false, ratio: 0, error: 'Use whole numbers of 1 or more' };
  }
  const ratio = w / h;
  if (ratio < limits.min - RATIO_EPSILON) {
    return { valid: false, ratio, error: `Too tall (max ${Math.round((1 / limits.min) * 100) / 100}:1 portrait)` };
  }
  if (ratio > limits.max + RATIO_EPSILON) {
    return { valid: false, ratio, error: `Too wide (max ${Math.round(limits.max * 100) / 100}:1)` };
  }
  return { valid: true, ratio };
};

export { validateCustomRatio };
