/* @layer renderer-shell @kind hook */
import { useLayoutEffect } from 'react';
import { tourTargets } from '../../resolve-tour-target';
import { TITLE_BAR_SELECTOR, TOURING_CLASS } from '../../tours.constants';
import type { TourStepDef } from '../../tour.type';

const litInTitleBar = (step: TourStepDef | null): boolean =>
  (step ? (tourTargets.resolve(tourTargets.litOf(step))?.closest(TITLE_BAR_SELECTOR) ?? null) !== null : false);

const useTouringClass = (open: boolean, step: TourStepDef | null): void => {
  useLayoutEffect(() => {
    if (!open || litInTitleBar(step)) return undefined;
    const root = document.documentElement;
    root.classList.add(TOURING_CLASS);
    return () => root.classList.remove(TOURING_CLASS);
  }, [open, step]);
};

export { useTouringClass };
