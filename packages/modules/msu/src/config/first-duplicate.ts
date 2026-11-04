/* @layer core @kind logic */
const firstDuplicate = <T>(values: readonly T[]): T | undefined => {
  const seen = new Set<T>();
  return values.find((value) => (seen.has(value) ? true : !seen.add(value)));
};

export { firstDuplicate };
