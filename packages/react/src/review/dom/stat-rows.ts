/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';

const statRows = (root: ParentNode): Record<string, string> =>
  Object.fromEntries([...root.querySelectorAll<HTMLElement>(SELECTORS.statRow)].map((row) => [
    row.querySelector(SELECTORS.aboutLabel)?.textContent.trim() ?? '',
    row.querySelector(SELECTORS.aboutValue)?.textContent.trim() ?? '',
  ]));

export { statRows };
