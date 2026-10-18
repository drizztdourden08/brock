/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import { find } from './find';
import type { WalkerBox, WalkerReading } from './read-walker.type';

const boxOf = (element: Element | null): WalkerBox | null => {
  if (element === null) return null;
  const { left, right, bottom } = element.getBoundingClientRect();
  return { left, right, bottom };
};

const readWalker = (): WalkerReading => {
  const walker = find(SELECTORS.walker);
  return {
    card: boxOf(find(SELECTORS.card)),
    walker: boxOf(walker),
    actor: boxOf(walker?.querySelector('.mascot-stage__actor') ?? null),
    palette: boxOf(find(SELECTORS.palette)),
    hint: walker?.querySelector('.window-mascot__hint')?.textContent.trim() ?? null,
  };
};

export { readWalker };
