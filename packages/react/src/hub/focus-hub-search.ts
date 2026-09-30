/* @layer renderer-shell @kind logic */
import { OPEN_HUB_SEARCH_MARK } from './hub.constants';

const focusHubSearch = (): boolean => {
  const mark = document.querySelector<HTMLElement>(OPEN_HUB_SEARCH_MARK);
  mark?.click();
  return mark !== null;
};

export { focusHubSearch };
