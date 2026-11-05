/* @layer core @kind logic */
import { EMPTY_SNAPSHOT } from './delivery-feed.constants';

const feedState = {
  listeners: new Set<() => void>(),
  held: { key: '', snapshot: EMPTY_SNAPSHOT },
};

export { feedState };
