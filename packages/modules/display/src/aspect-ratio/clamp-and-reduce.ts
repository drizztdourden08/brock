/* @layer core @kind logic */
import type { RatioLimits, RatioPair } from './aspect-ratio.type';

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const clampAndReduce = (longPx: number, shortPx: number, limits: RatioLimits): RatioPair => {
  let long = longPx;
  let short = shortPx;
  const ratio = long / short;
  if (ratio > limits.max) {
    long = Math.round(limits.max * short);
  } else if (ratio < limits.min) {
    short = Math.round(long / limits.min);
  }
  const g = gcd(long, short) || 1;
  return { w: long / g, h: short / g };
};

export { clampAndReduce };
