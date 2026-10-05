/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';

const labelOf = (item: HTMLElement): string => {
  const label = item.querySelector(SELECTORS.menuLabel);
  return (label?.querySelector(SELECTORS.menuLabelShown) ?? label)?.textContent.trim() ?? '';
};

export { labelOf };
