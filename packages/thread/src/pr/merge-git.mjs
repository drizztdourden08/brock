/* @layer tooling-scripts @kind logic */
import { git, LONG_PATHS, tryGit } from '../git.mjs';

/**
 * @param {string} branch
 * @param {string} cwd
 * @returns {string | null} the worktree that has the branch checked out
 */
const checkedOutAt = (branch, cwd) => {
  const listing = tryGit([...LONG_PATHS, 'worktree', 'list', '--porcelain'], cwd) ?? '';
  for (const block of listing.split(/\r?\n\r?\n/)) {
    const lines = block.split(/\r?\n/);
    if (lines.includes(`branch refs/heads/${branch}`)) return lines.find((line) => line.startsWith('worktree '))?.slice(9) ?? null;
  }
  return null;
};

const conflictsIn = (dir) => (tryGit(['diff', '--name-only', '--diff-filter=U'], dir) ?? '').split('\n').filter(Boolean);

/**
 * @param {{ dir: string, head: string, message: string }} request
 * @returns {string} the sha the base points at afterwards
 */
const mergeInto = ({ dir, head, message }) => {
  try {
    git([...LONG_PATHS, 'merge', '--no-edit', '-m', message, head], dir);
  } catch (error) {
    const files = conflictsIn(dir);
    tryGit(['merge', '--abort'], dir);
    const why = files.length ? `Conflicts in ${files.slice(0, 10).join(', ')}.` : String(error.stderr ?? error.message).trim().split('\n')[0];
    throw new Error(`The merge of ${head} did not apply, so it was aborted and the base is unchanged. ${why} Rebase or merge the base into ${head} by hand, run the check again, then retry.`, { cause: error });
  }
  return git(['rev-parse', 'HEAD'], dir);
};

export { checkedOutAt, mergeInto };
