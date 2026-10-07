/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { ControlSizeSnapshot } from '../review.type';

const tokenHeight = (token: string): number => {
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;height:var(${token})`;
  document.body.append(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();
  return height;
};

const heightsOf = (scope: ParentNode, selector: string): number[] =>
  [...scope.querySelectorAll<HTMLElement>(selector)].map((el) => el.getBoundingClientRect().height).filter((height) => height > 0);

const readControlSizes = (widget: Element): ControlSizeSnapshot => ({
  xs: tokenHeight('--control-h-xs'),
  sm: tokenHeight('--control-h-sm'),
  widgetButtons: heightsOf(widget, SELECTORS.widgetTitleButton),
  barButtons: heightsOf(document, SELECTORS.barActionButton),
});

export { readControlSizes };
