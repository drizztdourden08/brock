/* @layer renderer-shell @kind logic */
import type { ReviewStep } from '../review.type';
import { SENTINEL } from './styles-step.constants';

const rulesOf = (sheet: CSSStyleSheet): CSSRule[] => {
  try {
    return [...sheet.cssRules];
  } catch {
    return [];
  }
};

const stylesStep: ReviewStep = {
  name: 'styles',
  run: (tour) => {
    const copies = [...document.styleSheets]
      .flatMap(rulesOf)
      .filter((rule) => rule instanceof CSSStyleRule && rule.selectorText === SENTINEL).length;
    tour.check(
      'single-design-system',
      copies === 1,
      'the design system stylesheet loaded once',
      `the design system stylesheet loaded ${copies} times; two copies of Tessera resolve in this app`,
    );
    return Promise.resolve();
  },
};

export { stylesStep };
