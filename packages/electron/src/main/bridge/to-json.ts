/* @layer electron-main @kind logic */
const toJson = (value: unknown): string | null => {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
};

export { toJson };
