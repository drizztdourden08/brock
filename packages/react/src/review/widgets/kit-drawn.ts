/* @layer renderer-shell @kind logic */
import { find } from '../dom/find';
import { REVIEW_KIT_ID, REVIEW_KIT_MEMBERS, REVIEW_KIT_OVERLAY, kitSelectors } from './kit-review.constants';

const parts = (): (HTMLElement | null)[] => [
  ...REVIEW_KIT_MEMBERS.map((id) => find(kitSelectors.widget(id))),
  find(kitSelectors.overlay(REVIEW_KIT_OVERLAY)),
  find(kitSelectors.bar(REVIEW_KIT_ID)),
];

const kitDrawn = {
  all: (): boolean => parts().every((part) => part !== null),
  none: (): boolean => parts().every((part) => part === null),
  waiting: (): HTMLElement | null => find(kitSelectors.waiting(REVIEW_KIT_ID)),
};

export { kitDrawn };
