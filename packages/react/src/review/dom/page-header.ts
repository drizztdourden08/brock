/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { PageHeaderSnapshot } from '../review.type';

const pageHeader = (scope: ParentNode): PageHeaderSnapshot => {
  const head = scope.querySelector<HTMLElement>(SELECTORS.pageHead);
  const title = head?.querySelector(SELECTORS.pageTitle)?.textContent.trim() ?? '';
  return {
    shown: head !== null,
    icon: (head?.querySelector(SELECTORS.pageIcon)?.childElementCount ?? 0) > 0,
    title: title === '' ? null : title,
  };
};

export { pageHeader };
