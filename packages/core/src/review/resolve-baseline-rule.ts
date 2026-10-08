/* @layer core @kind logic */
import { BASELINE_MASK_SELECTOR } from './baseline.constants';
import type { BaselineConfig, BaselineMask, MaskRect, ResolvedRule } from './baseline.type';

const isRect = (mask: BaselineMask): mask is MaskRect => !('selector' in mask);

const resolveBaselineRule = (config: BaselineConfig, capture: string): ResolvedRule => {
  const rule = config.captures[capture];
  const masks = [...config.masks, ...(rule?.masks ?? [])];
  return {
    tolerance: rule?.tolerance ?? config.tolerance,
    rects: masks.filter(isRect),
    selectors: [BASELINE_MASK_SELECTOR, ...masks.flatMap((mask) => (isRect(mask) ? [] : [mask.selector]))],
  };
};

export { resolveBaselineRule };
