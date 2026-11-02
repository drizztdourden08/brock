/* @layer tooling-scripts @kind logic */
const countOf = (byFile) => Object.values(byFile).reduce((total, issues) => total + Object.keys(issues).length, 0);

/**
 * @param {Record<string, Record<string, unknown>>} byFile the issues of one type by file
 * @param {(file: string) => (symbol: string, issue: unknown) => boolean} keepFor the symbol filter of a file
 * @returns {[string, Record<string, unknown>][]} the files that keep at least one issue
 */
const keptByFile = (byFile, keepFor) =>
  Object.entries(byFile)
    .map(([file, issues]) => {
      const keep = keepFor(file);
      return [file, Object.fromEntries(Object.entries(issues).filter(([symbol, issue]) => keep(symbol, issue)))];
    })
    .filter(([, issues]) => Object.keys(issues).length > 0);

/**
 * @param {{ issues: Record<string, Record<string, object>>, counters?: Record<string, number> }} data the knip results
 * @param {string} type the issue type to replace
 * @param {Record<string, object>} kept the issues of that type to keep
 * @returns {object} the results with that type and its counter updated
 */
const withKeptIssues = (data, type, kept) => {
  const dropped = countOf(data.issues[type] ?? {}) - countOf(kept);
  return { ...data, issues: { ...data.issues, [type]: kept }, counters: { ...data.counters, [type]: (data.counters?.[type] ?? 0) - dropped } };
};

export { keptByFile, withKeptIssues };
