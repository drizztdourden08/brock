/* @layer core @kind logic */
const writeStorage = (key: string, value: string): boolean => {
  try {
    globalThis.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export { writeStorage };
