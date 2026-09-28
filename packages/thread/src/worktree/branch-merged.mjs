/* @layer tooling-scripts @kind logic */
import { tryGit } from '../git.mjs';
import { tryGh } from '../gh.mjs';

const mergedPrNumber = (branch, cwd) => {
  const out = tryGh(['pr', 'list', '--head', branch, '--state', 'merged', '--json', 'number', '--limit', '1'], cwd);
  if (!out) return null;
  try {
    const [pr] = JSON.parse(out);
    return pr?.number ?? null;
  } catch {
    return null;
  }
};

const isAncestorOf = (branch, ref, cwd) => tryGit(['merge-base', '--is-ancestor', branch, ref], cwd) !== null;

/**
 * @param {string} branch
 * @param {string} cwd
 * @param {string} base the workspace base branch
 * @returns {{ landed: boolean, via: string | null }}
 */
const branchLanded = (branch, cwd, base) => {
  tryGit(['fetch', 'origin', base, '--quiet'], cwd);
  const pr = mergedPrNumber(branch, cwd);
  if (pr) return { landed: true, via: `merged in PR #${pr}` };
  if (isAncestorOf(branch, `origin/${base}`, cwd)) return { landed: true, via: `merged into origin/${base}` };
  if (isAncestorOf(branch, base, cwd)) return { landed: true, via: `merged into ${base}` };
  return { landed: false, via: null };
};

export { branchLanded };
