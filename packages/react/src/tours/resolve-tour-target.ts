/* @layer renderer-shell @kind logic */
import { useWidgetLayoutStore } from '../widgets/useWidgetLayoutStore';
import { QUOTED, SHELL_TARGETS } from './tours.constants';
import type { BrockTourTarget, TourStepDef } from './tour.type';

const attribute = (name: string, value: string): string => `[${name}="${value.replace(QUOTED, '\\$&')}"]`;

const isPopped = (id: string): boolean => useWidgetLayoutStore.getState().layout.popped.some((entry) => entry.id === id);

const selectorOf = (target: Exclude<BrockTourTarget, { current: unknown }>): string | null => {
  if ('shell' in target) return SHELL_TARGETS[target.shell];
  if ('widget' in target) return isPopped(target.widget) ? null : attribute('data-widget-id', target.widget);
  if ('tour' in target) return attribute('data-tour', target.tour);
  return target.selector;
};

const resolveTourTarget = (target: BrockTourTarget | undefined, root: ParentNode = document): HTMLElement | null => {
  if (!target) return null;
  if ('current' in target) return target.current;
  const selector = selectorOf(target);
  return selector ? root.querySelector<HTMLElement>(selector) : null;
};

const clickTargetOf = (step: TourStepDef): BrockTourTarget | undefined => {
  const advance = step.advanceOn;
  if (!advance || !('click' in advance)) return undefined;
  return typeof advance.click === 'string' ? { selector: advance.click } : advance.click;
};

const separateClickOf = (step: TourStepDef): HTMLElement | null =>
  (step.target === undefined ? null : resolveTourTarget(clickTargetOf(step)));

const litTargetOf = (step: TourStepDef): BrockTourTarget | undefined =>
  step.target ?? clickTargetOf(step) ?? (step.widget ? { widget: step.widget } : undefined);

const tourTargets = { resolve: resolveTourTarget, clickOf: clickTargetOf, litOf: litTargetOf, separateClick: separateClickOf };

export { tourTargets };
