/* @layer tooling-scripts @kind logic */
import { remoteMode } from '../local/remote-mode.mjs';
import { ReleaseStop, stop } from '../release/local/release-stop.mjs';
import { attempt, lastLine } from './replay-exec.mjs';
import { replayRelease, verifyTarballs } from './replay-release.mjs';

const REMOTE = 'origin';

/**
 * @param {Record<string, string | boolean>} options
 * @returns {void} throws a stop unless remote mode is on and --go is given
 */
const requireGo = (options) => {
  if (remoteMode() !== 'remote') throw stop("replay waits for the owner's go: coord remote remote");
  if (options.go !== true) throw stop('replay run does nothing without --go. Read the plan first: replay plan');
};

const pushBase = (item, { exec, cwd }) => {
  exec('git', ['push', REMOTE, `${item.integration}:refs/heads/${item.remoteBase}`], { cwd });
  return { url: null };
};

const openPr = (item, { exec, cwd }) => {
  const listing = ['pr', 'list', '--head', item.head, '--state', 'all', '--json', 'url', '--jq', '.[].url'];
  const found = lastLine(attempt(exec, 'gh', listing, cwd));
  if (found) return { url: found };
  exec('git', ['push', REMOTE, `${item.ref}:refs/heads/${item.head}`], { cwd });
  const out = exec('gh', ['pr', 'create', '--head', item.head, '--base', item.remoteBase, '--title', item.prTitle, '--body', item.prBody], { cwd });
  return { url: lastLine(out) };
};

const STEPS = { 'push-base': pushBase, pr: openPr, release: replayRelease };

const recordHint = (item, state, url) => {
  const replay = { state, at: new Date().toISOString(), url };
  return `  coord pr has no verb to set replay yet. Record on ${item.id}: replay ${JSON.stringify(replay)}`;
};

const stepResult = (item, context) => {
  try {
    return STEPS[item.kind](item, context);
  } catch (error) {
    if (item.kind === 'pr') context.log(recordHint(item, 'failed', null));
    if (error instanceof ReleaseStop) throw error;
    throw stop(`${item.title} failed: ${String(error.stderr || error.message).trim().split('\n')[0]}`, 1);
  }
};

const runItem = (item, context) => {
  const { log } = context;
  if (item.upToDate) {
    log(`${item.order}. ${item.title}: skipped. ${item.upToDate}`);
    return;
  }
  log(`${item.order}. ${item.title}`);
  const { url } = stepResult(item, context);
  log(`  done${url ? `: ${url}` : ''}`);
  if (item.kind === 'pr') log(recordHint(item, 'done', url));
};

/**
 * @param {{ plan: object[], options: Record<string, string | boolean>, exec: Function, cwd: string, log: (line: string) => void }} input
 * @returns {void} runs the plan in order and stops at the first failure
 */
const runPlan = ({ plan, options, exec, cwd, log }) => {
  requireGo(options);
  const blocked = plan.find((item) => item.blocked);
  if (blocked) throw stop(`${blocked.title}: ${blocked.blocked}`, 1);
  for (const item of plan.filter((entry) => entry.kind === 'release')) verifyTarballs(item);
  for (const item of plan) runItem(item, { exec, cwd, log });
  log('Replay finished.');
};

export { requireGo, runPlan };
