/* @layer renderer-shell @kind logic */
import { confirmAction } from '../stores/confirm-action';
import { leaveGuards } from './leave-guards';
import { DISCARD_CHANGES } from './navigation.constants';

const whenLeft = (leave: () => void): void => {
  if (!leaveGuards.dirty()) {
    leave();
    return;
  }
  void confirmAction(DISCARD_CHANGES).then((discard) => {
    if (discard) leave();
  });
};

export { whenLeft };
