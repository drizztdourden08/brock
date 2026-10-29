/* @layer tooling-scripts @kind logic */
import { usageFor } from '../cli/usage-for.mjs';
import { projectOf } from '../ci/project-of.mjs';
import { ReleaseStop } from '../release/local/release-stop.mjs';
import { runCommand } from '../release/local/run-command.mjs';
import { buildPlan, planLines } from './replay-plan.mjs';
import { requireGo, runPlan } from './replay-run.mjs';

const USAGE = [
  '  brock replay plan [--project <key>] [--integration <branch>] [--remote-base <branch>] [--json]',
  '                               print, in order, every action replay would take; it runs nothing. 1. for each merged local PR',
  '                               not replayed, oldest first, push its head and open a GitHub PR that says "merged locally as PR-n at <sha>";',
  '                               2. push the integration branch (default local/main) to origin/<remote base> after a fast-forward check,',
  '                               so GitHub marks those PRs merged on its own;',
  '                               3. for each pending release in ~/.coord/releases, oldest first: verify every tarball against its',
  '                               sha512, npm publish the same tarball to the registry .npmrc names for its scope, gh release create',
  '  brock replay run --go [same options]',
  '                               run the plan in that order and stop at the first failure. It refuses unless remote mode is on',
  '                               (coord remote remote) and refuses without --go. Done items are skipped on a rerun; a version',
  '                               already on the registry with the same integrity is marked done, a different one is a hard stop',
].join('\n');

const stringOption = (options, name, fallback) => (typeof options[name] === 'string' ? options[name] : fallback);

const requestOf = (options, ctx, exec) => ({
  cwd: ctx.rootDir,
  project: projectOf(options, ctx.workspace),
  integration: stringOption(options, 'integration', 'local/main'),
  remoteBase: stringOption(options, 'remote-base', ctx.workspace.base),
  exec,
});

const show = (plan, options, log) => {
  if (options.json === true) log(JSON.stringify(plan, null, 2));
  else planLines(plan).forEach(log);
};

const dispatch = (sub, { options, ctx, exec, log }) => {
  if (sub === 'plan') return show(buildPlan(requestOf(options, ctx, exec)), options, log);
  requireGo(options);
  const request = requestOf(options, ctx, exec);
  return runPlan({ plan: buildPlan(request), options, exec, cwd: request.cwd, log });
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const replayVerb = {
  usage: USAGE,
  asks: true,
  run: (positional, options, ctx) => {
    const sub = positional[0];
    const log = ctx.log ?? console.log;
    if (options.help === true || !['plan', 'run'].includes(sub)) {
      console.log(usageFor(USAGE, ctx.workspace));
      return options.help === true ? 0 : 2;
    }
    try {
      dispatch(sub, { options, ctx, exec: ctx.exec ?? runCommand, log });
      return 0;
    } catch (error) {
      if (!(error instanceof ReleaseStop)) throw error;
      console.error(`[${ctx.workspace.name}] x ${error.message}`);
      return error.code;
    }
  },
};

export { replayVerb };
