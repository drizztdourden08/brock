/* @layer tooling-scripts @kind logic */
import { flag } from '../cli/thread-args.mjs';
import { fail } from '../log.mjs';
import { checkUpgrade } from './check-upgrade.mjs';
import { compareVersions } from './compare-versions.mjs';
import { planUpgrade } from './plan-upgrade.mjs';
import { upgradeInWorktree } from './upgrade-in-worktree.mjs';
import { CHECK_EXIT } from './upgrade.constants.mjs';

const USAGE = [
  '  brock upgrade [version] [--check] [--no-review] [--local <brockRepo>]',
  '                               move the app to a Brock release (default: the newest on the registry) in the',
  '                               worktree brock-<version>: bump brock.version, install, sync, migrations, lint,',
  '                               typecheck, structure, test and the headless review; commit when green.',
  '                               --check compares only: exit 0 up to date, 1 behind, 2 registry unreachable.',
  '                               A linked Brock follows its checkout; --local <brockRepo> links one',
].join('\n');

const upToDate = (plan) => plan.mode === 'registry' && plan.current !== null && compareVersions(plan.current, plan.target) >= 0;

const run = async (positional, options, ctx) => {
  const { plan, offline } = planUpgrade(ctx.rootDir, positional[0], options.local);
  if (!plan) {
    fail(ctx.workspace.name, offline);
    return CHECK_EXIT.offline;
  }
  if (flag(options, 'check')) return checkUpgrade(plan, ctx);
  if (upToDate(plan)) {
    ctx.log(`Brock ${plan.current} is already at or past ${plan.target}. Nothing to upgrade.`);
    return 0;
  }
  return upgradeInWorktree(plan, { review: !flag(options, 'no-review') }, ctx);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const upgradeVerb = { usage: USAGE, run };

export { upgradeVerb };
