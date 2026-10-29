/* @layer tooling-scripts @kind logic */

/**
 * @param {{ name: string, deps: string[] }[]} packages
 * @param {Set<string>} failed names that cannot be served
 * @returns {Set<string>} the failed names and every package above them
 */
const blockedBy = (packages, failed) => {
  const blocked = new Set(failed);
  let changed = true;
  while (changed) {
    changed = false;
    for (const { name, deps } of packages) {
      if (blocked.has(name) || !deps.some((dep) => blocked.has(dep))) continue;
      blocked.add(name);
      changed = true;
    }
  }
  return blocked;
};

export { blockedBy };
