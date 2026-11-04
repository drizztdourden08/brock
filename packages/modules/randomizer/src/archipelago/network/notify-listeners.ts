/* @layer core @kind logic */
const notifyListeners = (listeners: ReadonlySet<() => void>): void => {
  for (const listener of listeners) {
    try { listener(); } catch { continue; }
  }
};

export { notifyListeners };
