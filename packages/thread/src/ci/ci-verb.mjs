/* @layer tooling-scripts @kind logic */
import { tryGit } from '../git.mjs';
import { flag } from '../cli/thread-args.mjs';
import { runCommand } from '../release/local/run-command.mjs';
import { usageFor } from '../cli/usage-for.mjs';
import { newRunId } from './check-record.mjs';
import { DEFAULT_WAIT_MINUTES, EXIT, TRIGGERS, WORKFLOW_FILE, WORKFLOWS_DIR } from './ci.constants.mjs';
import { planSteps, targetOf } from './ci-plan.mjs';
import { gateScope } from './gate-scope.mjs';
import { localpkgRequest } from './localpkg-request.mjs';
import { integrationBranch } from '../local/integration-branch.mjs';
import { parseTimeouts } from './step-timeouts.mjs';
import { treeOf } from './tree-cache.mjs';
import { resolveLocalPr } from '../pr/local-pr.mjs';
import { projectOf } from './project-of.mjs';
import { runCi } from './run-ci.mjs';

const USAGE = [
  '  brock ci [check] [<job>|<step>] [--commit <sha>] [--pr PR-n] [--job <job>|all] [--trigger push|pr|manual|release]',
  '           [--only <step>[,<step>]] [--workflow <file>] [--project <key>] [--branch <name>] [--wait-minutes <n>]',
  '           [--base <branch>] [--timeout <step>=<min>[,...]] [--no-cache] [--localpkg]',
  '                               run the repo\'s checks locally in a detached temporary worktree at the commit',
  '                               (default the head of --pr, else HEAD) and write ~/.coord/ci/<project>/<runId>.json. The jobs are the ones',
  '                               of the workflow file (default ci.yml). A job or step name runs only that one,',
  '                               like --job or --only. The first line printed is the record path.',
  '                               A step that passed for the same git tree is not run again (--no-cache runs all). Every step has a hard',
  '                               time limit. Tests cover only files changed since the merge base with --base (the last release tag on',
  '                               --trigger release); lint covers the same files, all of them on a release.',
  '                               --localpkg runs a branch that needs unpushed local builds: localpkg points the temporary worktree at',
  '                               its tarballs, install is --no-frozen-lockfile, the lockfile stays the registry one, and the record says so.',
  '                               Exit 0 pass, 1 a step failed or timed out, 2 usage or setup error.',
].join('\n');

const PR_ID = /^PR-\d+$/;

const stringOption = (options, name, fallback = null) => (typeof options[name] === 'string' ? options[name] : fallback);

const branchOf = (sha, spec, options, cwd) => {
  if (typeof options.branch === 'string') return options.branch;
  if (spec === 'HEAD') {
    const name = tryGit(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
    return name && name !== 'HEAD' ? name : null;
  }
  const named = tryGit(['name-rev', '--name-only', '--no-undefined', '--refs=refs/heads/*', sha], cwd);
  return named ? named.replace(/[~^].*$/, '') : null;
};

const listOf = (value) => (typeof value === 'string' ? value.split(',').map((item) => item.trim()).filter(Boolean) : null);

const wordOf = (positional) => {
  const words = positional[0] === 'check' ? positional.slice(1) : positional;
  if (words.length > 1) throw new Error(`Give at most one job or step name, got "${words.join(' ')}".`);
  return words[0] ?? null;
};

const triggerOf = (options, pr) => {
  const fallback = pr ? 'pr' : 'manual';
  const trigger = stringOption(options, 'trigger', fallback);
  if (!TRIGGERS.includes(trigger)) throw new Error(`--trigger is one of ${TRIGGERS.join(', ')}, got "${trigger}".`);
  return trigger;
};

const prOf = (options) => {
  const pr = stringOption(options, 'pr');
  if (pr && !PR_ID.test(pr)) throw new Error(`--pr takes a pull request id like PR-3, got "${pr}".`);
  return pr;
};

const waitOf = (options) => {
  const minutes = Number(options['wait-minutes'] ?? DEFAULT_WAIT_MINUTES);
  if (!Number.isFinite(minutes) || minutes < 0) throw new Error('--wait-minutes takes minutes, like 30.');
  return minutes * 60000;
};

const workflowPath = (options) => {
  const named = stringOption(options, 'workflow');
  if (!named) return WORKFLOW_FILE;
  return named.includes('/') ? named : `${WORKFLOWS_DIR}/${named}`;
};

const workflowOf = (options, sha, cwd) => {
  const path = workflowPath(options);
  const text = tryGit(['show', `${sha}:${path}`], cwd);
  if (text === null && typeof options.workflow === 'string') throw new Error(`There is no workflow file ${path} at ${sha.slice(0, 9)}.`);
  return text;
};

const commitOf = (options, pr, cwd) => {
  const fallback = pr && typeof options.commit !== 'string' ? resolveLocalPr({ id: pr, options: {}, base: null, cwd }).head : 'HEAD';
  const spec = stringOption(options, 'commit', fallback);
  const sha = tryGit(['rev-parse', '--verify', '--quiet', `${spec}^{commit}`], cwd);
  if (!sha) throw new Error(`"${spec}" is not a commit in this repository.`);
  return { spec, sha };
};

const localpkgOf = (options, ctx, cwd) => (flag(options, 'localpkg') ? localpkgRequest({ exec: ctx.exec ?? runCommand, cwd }) : null);

const resolveRequest = (positional, options, ctx) => {
  const word = wordOf(positional);
  const cwd = process.cwd();
  const pr = prOf(options);
  const { spec, sha } = commitOf(options, pr, cwd);
  const trigger = triggerOf(options, pr);
  const project = projectOf(options, ctx.workspace);
  const branchBase = stringOption(options, 'base') ?? integrationBranch({ options, project, base: ctx.workspace.base, cwd });
  const scope = gateScope({ trigger, sha, base: branchBase, git: (args) => tryGit(args, cwd) });
  const localpkg = localpkgOf(options, ctx, cwd);
  const base = { workspace: ctx.workspace, workflowText: workflowOf(options, sha, cwd), trigger, scope, localpkg: Boolean(localpkg) };
  const { job, only } = targetOf(word ? planSteps(base) : [], word, stringOption(options, 'job', 'all'), listOf(options.only));
  const plan = planSteps({ ...base, job, only });
  return {
    project,
    sha,
    tree: treeOf(sha, (args) => tryGit(args, cwd)),
    cache: options['no-cache'] !== true && options.cache !== false,
    timeouts: parseTimeouts(stringOption(options, 'timeout')),
    branch: branchOf(sha, spec, options, cwd),
    pr,
    trigger,
    plan,
    localpkg,
    partial: Boolean(only),
    waitMs: waitOf(options),
  };
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const ciVerb = {
  usage: USAGE,
  run: async (positional, options, ctx) => {
    if (options.help === true) {
      console.log(usageFor(USAGE, ctx.workspace));
      return EXIT.pass;
    }
    let request;
    try {
      request = resolveRequest(positional, options, ctx);
    } catch (error) {
      console.error(`[${ctx.workspace.name}] x ${usageFor(`${error.message}\n\n${USAGE}`, ctx.workspace)}`);
      return EXIT.setup;
    }
    return runCi({ ctx, request, runId: newRunId(), announce: (file) => console.log(file) });
  },
};

export { ciVerb };
