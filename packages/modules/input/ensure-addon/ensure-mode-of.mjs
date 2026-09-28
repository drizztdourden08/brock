/* @layer tooling-scripts @kind logic */

/**
 * @param {readonly string[]} argv the CLI arguments
 * @returns {import('./index.d.mts').EnsureMode}
 */
const ensureModeOf = (argv) => {
  if (argv.includes('--force')) return 'force';
  if (argv.includes('--postinstall')) return 'postinstall';
  return 'prepare';
};

export { ensureModeOf };
