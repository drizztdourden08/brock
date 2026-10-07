/* @layer renderer-shell @kind logic */
import { OVERFLOW_SLACK, SELECTORS } from '../review.constants';
import type { NarrowFitSnapshot } from '../review.type';

const overflows = (el: HTMLElement): boolean => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + OVERFLOW_SLACK;

const readNarrowFit = (): NarrowFitSnapshot => {
  const titles = [...document.querySelectorAll<HTMLElement>(SELECTORS.layerTitles)];
  const content = document.querySelector<HTMLElement>(SELECTORS.layerContent);
  return {
    width: window.innerWidth,
    cutTitles: titles.filter(overflows).map((el) => el.textContent.trim()),
    sideScroll: content !== null && overflows(content),
  };
};

export { readNarrowFit };
