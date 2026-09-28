/* @layer tooling-scripts @kind logic */
const summarize = (entries) => {
  const counts = {};
  for (const entry of entries) counts[entry.status] = (counts[entry.status] ?? 0) + 1;
  return Object.entries(counts).sort();
};

/**
 * @param {object[]} entries
 * @param {(message: string) => void} log
 * @returns {void}
 */
const reportEntries = (entries, log) => {
  if (entries.length === 0) {
    log('vault: in sync');
    return;
  }
  for (const [status, count] of summarize(entries)) log(`vault:   ${status}: ${count}`);
  const conflicts = entries.filter((entry) => entry.status === 'conflict');
  for (const entry of conflicts.slice(0, 10)) log(`vault:   CONFLICT ${entry.path}`);
  if (conflicts.length > 10) log(`vault:   ... and ${conflicts.length - 10} more`);
  if (conflicts.length > 0) {
    log('vault: Conflicts are left untouched. Resolve with force-push, or fix the file on one side so the two agree.');
  }
};

export { reportEntries };
