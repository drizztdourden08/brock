/* @layer renderer-shell @kind logic */
import { claimedDrops } from './claimed-drops';

const claimDrop = (event: Event): void => {
  claimedDrops.add(event);
};

export { claimDrop };
