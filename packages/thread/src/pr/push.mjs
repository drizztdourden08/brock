/* @layer tooling-scripts @kind logic */
import { pushBranch } from '../git.mjs';
import { deferredNote, isLocalMode } from '../local/remote-mode.mjs';
import { prBranch } from './branch.mjs';

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const pushVerb = {
  usage: '  brock pr push   [name]                        asks: work leaves the machine',
  asks: true,
  run: async (positional, options, ctx) => {
    const { log } = ctx;
    const { name, path, branch } = prBranch.target(positional, options, ctx);
    prBranch.warnIfDirty(path, log);
    if (isLocalMode()) {
      log(`Would push "${branch}" to origin.`);
      log(deferredNote('the push'));
      return;
    }
    const { upstream, count } = prBranch.unpushedCount(path, branch);
    if (upstream && count === 0) {
      log(`"${branch}" is already up to date on ${upstream}. Nothing to push.`);
      return;
    }
    log(upstream ? `Pushing ${count} commit(s) from "${branch}" to ${upstream}.` : `Publishing "${branch}" to origin for the first time.`);
    pushBranch(branch, path);
    const { count: remaining } = prBranch.unpushedCount(path, branch);
    log(`"${name}" pushed. ${remaining === 0 ? 'Nothing left unpushed.' : `${remaining} still unpushed.`}`);
  },
};

export { pushVerb };
