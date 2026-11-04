/* @layer core @kind logic */
const holdingCounts = (items: Iterable<string>): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return counts;
};

export { holdingCounts };
