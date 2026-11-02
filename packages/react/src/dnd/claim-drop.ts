/* @layer renderer-shell @kind logic */
const claimed = new WeakSet<Event>();

const claimDrop = (event: Event): void => {
  claimed.add(event);
};

const isClaimed = (event: Event): boolean => claimed.has(event);

export { claimDrop, isClaimed };
