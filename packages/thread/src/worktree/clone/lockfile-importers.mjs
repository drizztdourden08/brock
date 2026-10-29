/* @layer tooling-scripts @kind logic */

/**
 * @param {string} lockfile the text of a pnpm lockfile
 * @returns {string[]} the project folders it installs, relative to the workspace root ('.' for the root)
 */
const lockfileImporters = (lockfile) => {
  const found = [];
  let inside = false;
  for (const line of lockfile.split(/\r?\n/)) {
    if (/^\S/.test(line)) inside = line.startsWith('importers:');
    else if (inside) {
      const match = /^ {2}(['"]?)([^'"\s][^'"]*)\1:\s*$/.exec(line);
      if (match) found.push(match[2]);
    }
  }
  return found;
};

export { lockfileImporters };
