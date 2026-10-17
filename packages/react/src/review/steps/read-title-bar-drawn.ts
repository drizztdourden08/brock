/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { SELECTORS } from '../review.constants';
import { EDGE_INSET } from './read-title-bar-drawn.constants';

const bar = (): HTMLElement | null => find(SELECTORS.titleBar);

const hidden = (): boolean => {
  const el = bar();
  return el !== null && el.getBoundingClientRect().bottom <= 0.5;
};

const uncovered = (el: HTMLElement): boolean => {
  const rect = el.getBoundingClientRect();
  const y = rect.top + rect.height / 2;
  const xs = [rect.left + EDGE_INSET, rect.left + rect.width / 2, rect.right - EDGE_INSET];
  return xs.every((x) => {
    const hit = document.elementFromPoint(x, y);
    return hit !== null && el.contains(hit);
  });
};

const drawn = (): boolean => {
  const el = bar();
  if (el === null) return false;
  const rect = el.getBoundingClientRect();
  return Math.abs(rect.top) <= 0.5 && rect.height > 0 && getComputedStyle(el).opacity === '1' && uncovered(el);
};

const inFlow = (): boolean => {
  const el = bar();
  return el !== null && getComputedStyle(el).position !== 'absolute' && drawn();
};

const focusedInside = (): boolean => {
  const el = bar();
  return el?.contains(document.activeElement) === true;
};

const titleBarDrawn = { bar, hidden, drawn, inFlow, focusedInside };

export { titleBarDrawn };
