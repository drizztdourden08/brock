/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { SELECTORS } from '../review.constants';
import { RING_OFF_CLASS, TOUCH_SLACK_PX, TOUR_SELECTORS } from './tours-step.constants';

const titleBarKept = (): boolean | null => {
  const bar = find(SELECTORS.titleBar);
  if (!bar) return null;
  if (bar.closest('[inert]') !== null) return false;
  const box = bar.getBoundingClientRect();
  const stack = document.elementsFromPoint(box.left + box.width / 2, box.top + box.height / 2);
  const atBar = stack.findIndex((node) => bar.contains(node));
  const atVeil = stack.findIndex((node) => node.matches(TOUR_SELECTORS.veil));
  return atBar !== -1 && (atVeil === -1 || atBar < atVeil);
};

const bubbleOnScreen = (): boolean => {
  const bubble = find(TOUR_SELECTORS.bubble);
  if (!bubble) return false;
  const box = bubble.getBoundingClientRect();
  return box.left >= 0 && box.top >= 0 && box.right <= window.innerWidth && box.bottom <= window.innerHeight;
};

const apart = (a: DOMRect, b: DOMRect): boolean =>
  a.right <= b.left + TOUCH_SLACK_PX || a.left >= b.right - TOUCH_SLACK_PX || a.bottom <= b.top + TOUCH_SLACK_PX || a.top >= b.bottom - TOUCH_SLACK_PX;

const mascotOffHole = (): boolean => {
  const ring = find(TOUR_SELECTORS.ring);
  const mascot = find(TOUR_SELECTORS.mascot);
  if (!ring || ring.classList.contains(RING_OFF_CLASS) || !mascot) return true;
  return apart(mascot.getBoundingClientRect(), ring.getBoundingClientRect());
};

const tourLayout = { titleBarKept, bubbleOnScreen, mascotOffHole };

export { tourLayout };
