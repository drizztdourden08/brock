/* @layer core @kind logic */
import { BUILT_IN_MASKS, BUILT_IN_RULES } from './baseline.constants';
import type { BaselineConfig, BaselineMask, BaselineRule, MaskRect, ResolvedRule } from './baseline.type';

const isRect = (mask: BaselineMask): mask is MaskRect => !('selector' in mask);

const resolveBaselineRule = (config: BaselineConfig, capture: string): ResolvedRule => {
  const rule: BaselineRule = { ...BUILT_IN_RULES[capture], ...config.captures[capture] };
  const masks = [...config.masks, ...(rule.masks ?? [])];
  return {
    tolerance: rule.tolerance ?? config.tolerance,
    threshold: rule.threshold ?? config.threshold,
    rects: masks.filter(isRect),
    selectors: [...BUILT_IN_MASKS, ...masks.flatMap((mask) => (isRect(mask) ? [] : [mask.selector]))],
  };
};

export { resolveBaselineRule };
