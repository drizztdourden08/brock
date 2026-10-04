/* @layer renderer-shell @kind logic */
import { openSearchTarget } from './open-search-target';
import type { SearchEntry } from './search.type';

const activateEntry = (entry: SearchEntry): void => {
  if (entry.target) openSearchTarget(entry.target, entry.label);
  entry.run?.();
};

export { activateEntry };
