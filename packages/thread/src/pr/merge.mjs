/* @layer tooling-scripts @kind logic */
import { git, tryGit } from '../git.mjs';
import { latestRunFor } from '../ci/check-record.mjs';
import { projectOf } from '../ci/project-of.mjs';
import { resolveLocalPr } from './local-pr.mjs';
import { mergeBlocker } from './merge-gate.mjs';
import { checkedOutAt, mergeInto } from './merge-git.mjs';

const USAGE = [
  '  brock pr merge --local PR-n [--head <branch> --base <branch>] [--keep-branch]',
  '                               merge the pull request into its base with git, here, once the latest check run of its',
  '                               head commit has every required step passing (see brock ci). Prints the merge commit.',
].join('\n');

const branchTip = (branch, cwd) => {
  const sha = tryGit(['rev-parse', '--verify', '--quiet', `refs/heads/${branch}^{commit}`], cwd);
  if (!sha) throw new Error(`There is no local branch "${branch}".`);
  return sha;
};

const landingDir = (base, ctx) => {
  const dir = checkedOutAt(base, ctx.rootDir);
  if (!dir) throw new Error(`"${base}" is not checked out in any worktree, so there is nowhere to merge. Check it out in the main checkout first.`);
  if (git(['status', '--porcelain', '--untracked-files=no'], dir)) throw new Error(`Refusing to merge: tracked files in ${dir} have uncommitted changes.`);
  return dir;
};

const dropHead = ({ head, base, dir, ctx }) => {
  if (ctx.workspace.protectedBranches.includes(head) || head === base) return ctx.log(`Branch "${head}" kept: it is a base branch.`);
  if (tryGit(['branch', '-d', head], dir) === null) return ctx.log(`Branch "${head}" kept: git would not delete it (checked out in another worktree?).`);
  return ctx.log(`Branch "${head}" deleted: it is fully merged.`);
};

const mergeIdOf = (positional, options) => (typeof options.local === 'string' ? options.local : (positional[0] ?? null));

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const mergeVerb = {
  usage: USAGE,
  asks: true,
  run: async (positional, options, ctx) => {
    if (!options.local) throw new Error(`pr merge works on this machine only. Add --local, or merge the pull request on GitHub.\n${USAGE}`);
    const { id, head, base } = resolveLocalPr({ id: mergeIdOf(positional, options), options, base: ctx.workspace.base, cwd: ctx.rootDir });
    const sha = branchTip(head, ctx.rootDir);
    branchTip(base, ctx.rootDir);
    const blocker = mergeBlocker(latestRunFor(projectOf(options, ctx.workspace), sha), { sha, alias: ctx.workspace.name, pr: id });
    if (blocker) throw new Error(`Not merged. ${blocker}`);
    if (tryGit(['merge-base', '--is-ancestor', head, base], ctx.rootDir) !== null) throw new Error(`Nothing to merge: "${head}" is already in "${base}".`);
    const dir = landingDir(base, ctx);
    const commit = mergeInto({ dir, head, message: `Merge ${head} into ${base}${id ? ` (${id})` : ''}` });
    ctx.log(`${id ?? head} merged into ${base}.`);
    if (options['keep-branch'] !== true) dropHead({ head, base, dir, ctx });
    console.log(commit);
    return 0;
  },
};

export { mergeVerb };
