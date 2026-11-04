/* @layer renderer-shell @kind logic */
const sameList = (a: readonly string[], b: readonly string[]): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export { sameList };
