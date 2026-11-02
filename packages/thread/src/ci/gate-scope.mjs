/* @layer tooling-scripts @kind logic */

/**
 * @param {{ trigger: string, sha: string, base: string, git: (args: string[]) => string | null }} input
 * @returns {{ testRef: string, lintMode: 'changed' | 'all', lintBase: string }}
 */
const gateScope = ({ trigger, sha, base, git }) => {
  const release = trigger === 'release';
  const tag = release ? git(['describe', '--tags', '--abbrev=0', sha]) : null;
  const testRef = tag ?? git(['merge-base', sha, base]);
  if (!testRef) throw new Error(`No ${release ? 'release tag and no ' : ''}merge base of ${sha.slice(0, 9)} with ${base}, so the tests cannot be limited to what changed. The gate never runs the whole suite.`);
  return { testRef, lintMode: release ? 'all' : 'changed', lintBase: base };
};

export { gateScope };
