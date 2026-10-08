/* @layer tooling-scripts @kind logic */
import { tryGh } from '../gh.mjs';
import { threadBase } from '../worktree/thread-base.mjs';
import { prBranch } from './branch.mjs';

const FIELDS = 'number,title,url,state,isDraft,baseRefName,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup';

const summarizeChecks = (rollup) => {
  if (!Array.isArray(rollup) || rollup.length === 0) return 'no checks reported';
  const tally = {};
  for (const run of rollup) {
    const key = (run.conclusion || run.status || 'PENDING').toLowerCase();
    tally[key] = (tally[key] ?? 0) + 1;
  }
  return Object.entries(tally).map(([key, count]) => `${count} ${key}`).join(', ');
};

const reportBase = (pr, base, log) => {
  log(`  base       ${pr.baseRefName ?? base}`);
  if (pr.baseRefName && pr.baseRefName !== base) log(`  The thread's base is ${base}, but this PR targets ${pr.baseRefName}.`);
};

const reportPr = (pr, base, log) => {
  log(`PR #${pr.number}  ${pr.title}`);
  log(`  ${pr.url}`);
  log(`  state      ${pr.state}${pr.isDraft ? '  (DRAFT: not ready to merge)' : ''}`);
  reportBase(pr, base, log);
  log(`  mergeable  ${pr.mergeable ?? 'UNKNOWN'}  (${pr.mergeStateStatus ?? 'unknown'})`);
  log(`  review     ${pr.reviewDecision || 'none'}`);
  log(`  checks     ${summarizeChecks(pr.statusCheckRollup)}`);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const statusVerb = {
  usage: '  brock pr status [name]                        read-only',
  run: async (positional, options, ctx) => {
    const { workspace, log } = ctx;
    const { name, path, branch } = prBranch.target(positional, ctx);
    const { base } = threadBase.baseOf(branch, path, workspace);
    const out = tryGh(['pr', 'view', branch, '--json', FIELDS], path);
    if (!out) {
      log(`No open PR for "${branch}". Open one into ${base} with: ${workspace.name} pr open ${name} --title "<title>"`);
      return;
    }
    reportPr(JSON.parse(out), base, log);
  },
};

export { statusVerb };
