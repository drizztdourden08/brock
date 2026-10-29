/* @layer tooling-scripts @kind logic */
import { tryGitAt } from '../git.mjs';

const deletedTracked = (main) => {
  const status = tryGitAt(['-c', 'core.quotepath=false', 'status', '--porcelain', '--untracked-files=no'], main) ?? '';
  const entries = status.split('\n').map((line) => /^(\S{1,2})\s+(.*)$/.exec(line.trimStart())).filter(Boolean);
  return new Set(entries.filter(([, code]) => code.includes('D')).map(([, , path]) => path));
};

/**
 * @param {string} main the main checkout
 * @returns {() => string | null} after the run: why it lost files, else null
 */
const watchMainCheckout = (main) => {
  const before = deletedTracked(main);
  return () => {
    const lost = [...deletedTracked(main)].filter((path) => !before.has(path));
    if (lost.length === 0) return null;
    return `DATA LOSS: ${lost.length} tracked file(s) of the main checkout ${main} were deleted during this run (${lost.slice(0, 5).join(', ')}). Restore them with git restore and report it to Brock.`;
  };
};

export { watchMainCheckout };
