/* @layer core @kind logic */
const readStorage = (key: string): string | null => {
  try {
    return globalThis.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export { readStorage };
