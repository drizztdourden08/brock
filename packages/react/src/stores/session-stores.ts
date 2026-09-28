/* @layer renderer-shell @kind logic */
const sessionStores = new Set<{ reset: () => void }>();

export { sessionStores };
