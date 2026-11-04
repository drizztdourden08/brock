/* @layer core @kind logic */
import type { MsuResumeState } from '../types';

const isResumeState = (value: unknown): value is MsuResumeState => {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as MsuResumeState;
  return typeof s.trackNum === 'number' && Boolean(s.layers) && typeof s.layers === 'object';
};

export { isResumeState };
