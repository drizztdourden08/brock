/* @layer core @kind logic */
const remapByIndex = <T>(
  assignments: Readonly<Record<number, T>>,
  renumber: ReadonlyMap<number, number>,
): Record<number, T> => {
  const next: Record<number, T> = {};
  for (const [key, assignment] of Object.entries(assignments)) {
    const moved = renumber.get(Number(key));
    if (moved !== undefined) next[moved] = assignment;
  }
  return next;
};

export { remapByIndex };
