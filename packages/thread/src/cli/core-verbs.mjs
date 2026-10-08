/* @layer tooling-scripts @kind constants */
import { worktreeVerb } from '../worktree/worktree-verb.mjs';
import { launchVerb } from '../launch/launch-verb.mjs';
import { prVerb } from '../pr/pr-verb.mjs';
import { mobileVerb } from '../mobile/mobile-verb.mjs';
import { linuxVerb } from '../linux/linux-verb.mjs';
import { releaseVerb } from '../release/release-verb.mjs';
import { upgradeVerb } from '../upgrade/upgrade-verb.mjs';

const CORE_VERBS = Object.freeze({
  worktree: worktreeVerb,
  launch: launchVerb,
  pr: prVerb,
  mobile: mobileVerb,
  linux: linuxVerb,
  release: releaseVerb,
  upgrade: upgradeVerb,
});

export { CORE_VERBS };
