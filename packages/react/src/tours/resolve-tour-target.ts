/* @layer renderer-shell @kind logic */
import { useWidgetLayoutStore } from '../widgets/useWidgetLayoutStore';
import { POPPED_WIDGET_PART, QUOTED, SHELL_TARGETS } from './tours.constants';
import type { BrockTourTarget, NamedTourTarget, TourSpotSlice, TourStepDef } from './tour.type';

const attribute = (name: string, value: string): string => `[${name}="${value.replace(QUOTED, '\\$&')}"]`;

const isPopped = (id: string): boolean => useWidgetLayoutStore.getState().layout.popped.some((entry) => entry.id === id);

const selectorOf = (target: NamedTourTarget): string => {
  if ('shell' in target) return SHELL_TARGETS[target.shell];
  if ('widget' in target) return attribute('data-widget-id', target.widget);
  if ('setting' in target) return attribute('data-setting-key', target.setting);
  if ('tour' in target) return attribute('data-tour', target.tour);
  return target.selector;
};

const resolveTourTarget = (target: BrockTourTarget | undefined, root: ParentNode = document): HTMLElement | null => {
  if (!target) return null;
  if ('current' in target) return target.current;
  if ('widget' in target && isPopped(target.widget)) return null;
  return root.querySelector<HTMLElement>(selectorOf(target));
};

const clickTargetOf = (step: TourStepDef): BrockTourTarget | undefined => {
  const advance = step.advanceOn;
  if (!advance || !('click' in advance)) return undefined;
  return typeof advance.click === 'string' ? { selector: advance.click } : advance.click;
};

const litTargetOf = (step: TourStepDef): BrockTourTarget | undefined =>
  step.target ?? clickTargetOf(step) ?? (step.widget ? { widget: step.widget } : undefined);

const inWidget = (target: BrockTourTarget): target is NamedTourTarget => 'selector' in target || 'tour' in target || 'widget' in target;

const poppedSpotOf = (step: TourStepDef): TourSpotSlice | null => {
  const lit = litTargetOf(step);
  if (!lit || !inWidget(lit)) return null;
  const widget = 'widget' in lit ? lit.widget : step.widget;
  if (widget === undefined || !isPopped(widget)) return null;
  return { widget, selector: 'widget' in lit ? `${selectorOf(lit)} ${POPPED_WIDGET_PART}` : selectorOf(lit) };
};

const tourTargets = { resolve: resolveTourTarget, clickOf: clickTargetOf, litOf: litTargetOf, poppedSpot: poppedSpotOf };

export { tourTargets };
