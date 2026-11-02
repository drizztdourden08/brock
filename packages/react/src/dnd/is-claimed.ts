/* @layer renderer-shell @kind logic */
import { claimedDrops } from './claimed-drops';

const isClaimed = (event: Event): boolean => claimedDrops.has(event);

export { isClaimed };
