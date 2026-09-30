/* @layer renderer-shell @kind logic */
import { nav } from '../navigation/nav';
import { scrollToAnchor } from './scroll-to-anchor';
import type { SearchTarget } from './search.type';

const openSearchTarget = (target: SearchTarget): void => {
  nav.open(target.route, target.params);
  if (target.anchor !== undefined) scrollToAnchor(target.anchor);
};

export { openSearchTarget };
