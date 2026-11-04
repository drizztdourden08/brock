/* @layer renderer-shell @kind logic */
const sameMembers = (a: ReadonlySet<string>, b: ReadonlySet<string>): boolean => {
  if (a.size !== b.size) return false;
  for (const key of a) if (!b.has(key)) return false;
  return true;
};

export { sameMembers };
