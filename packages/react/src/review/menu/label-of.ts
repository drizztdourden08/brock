/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';

const labelOf = (item: HTMLElement): string => item.querySelector(SELECTORS.menuLabel)?.textContent.trim() ?? '';

export { labelOf };
