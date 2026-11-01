/* @layer tooling-scripts @kind logic */
import { flag } from '../cli/thread-args.mjs';

const NEEDS_HEAD = '--here runs in this checkout, so it needs HEAD to be the commit under test.';
const NEEDS_CLEAN = '--here needs a clean tracked tree: commit or stash your changes first.';
const NO_LOCALPKG = '--here cannot combine with --localpkg, because there is no temporary worktree to prepare.';
const NO_CHECKOUT = '--here needs a git checkout to run in.';

/**
 * @param {{ options: Record<string, string | boolean>, sha: string, git: (args: string[]) => string | null }} input
 * @returns {string | null} the checkout the steps run in, null without --here
 */
const hereRequest = ({ options, sha, git }) => {
  if (!flag(options, 'here')) return null;
  if (flag(options, 'localpkg')) throw new Error(NO_LOCALPKG);
  const top = git(['rev-parse', '--show-toplevel']);
  if (!top) throw new Error(NO_CHECKOUT);
  if (git(['rev-parse', 'HEAD']) !== sha) throw new Error(NEEDS_HEAD);
  if (git(['status', '--porcelain', '--untracked-files=no'])) throw new Error(NEEDS_CLEAN);
  return top;
};

export { hereRequest };
