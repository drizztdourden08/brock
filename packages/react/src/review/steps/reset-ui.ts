/* @layer renderer-shell @kind logic */
import { click } from '../dom/click';
import { find } from '../dom/find';
import { settle } from '../dom/settle';
import { RESET_CLOSERS } from '../review.constants';

const resetUi = async (): Promise<void> => {
  for (const { open, control } of RESET_CLOSERS) {
    const button = find(open) ? find(control) : null;
    if (button) click(button);
  }
  await settle();
};

export { resetUi };
