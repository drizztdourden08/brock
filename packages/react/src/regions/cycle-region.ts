/* @layer renderer-shell @kind logic */
import { focusTarget } from './focus-target';
import { regionTargets } from './region-targets';

const currentIndex = (regions: readonly HTMLElement[]): number => {
  const active = document.activeElement;
  let here = -1;
  regions.forEach((region, index) => {
    if (active !== null && region.contains(active)) here = index;
  });
  return here;
};

const cycleRegion = (step: 1 | -1): void => {
  const regions = regionTargets();
  if (regions.length === 0) return;
  const here = currentIndex(regions);
  const start = here === -1 && step === 1 ? -1 : Math.max(here, 0);
  const next = regions[(start + step + regions.length) % regions.length];
  if (next) focusTarget(next).focus();
};

export { cycleRegion };
