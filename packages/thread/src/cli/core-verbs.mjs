/* @layer tooling-scripts @kind constants */
import { worktreeVerb } from '../worktree/worktree-verb.mjs';
import { launchVerb } from '../launch/launch-verb.mjs';
import { prVerb } from '../pr/pr-verb.mjs';
import { mobileVerb } from '../mobile/mobile-verb.mjs';
import { releaseVerb } from '../release/release-verb.mjs';

const CORE_VERBS = Object.freeze({
  worktree: worktreeVerb,
  launch: launchVerb,
  pr: prVerb,
  mobile: mobileVerb,
  release: releaseVerb,
});

export { CORE_VERBS };
