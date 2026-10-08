/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { git, pushBranch } from '../git.mjs';
import { ghLoud, tryGh } from '../gh.mjs';
import { flag } from '../cli/thread-args.mjs';
import { prBranch } from './branch.mjs';
import { checkPublishStyle } from './style.mjs';
import { threadBase } from '../worktree/thread-base.mjs';

const bodyFrom = (options) => {
  if (typeof options['body-file'] === 'string') return readFileSync(options['body-file'], 'utf8').trim();
  if (typeof options.body === 'string') return options.body;
  return '';
};

const existingPr = (branch, cwd) => {
  const out = tryGh(['pr', 'list', '--head', branch, '--state', 'open', '--json', 'number,url', '--limit', '1'], cwd);
  if (!out) return null;
  try {
    const [pr] = JSON.parse(out);
    return pr ?? null;
  } catch {
    return null;
  }
};

const assertHasCommits = (path, base, branch) => {
  const ahead = Number(git(['rev-list', '--count', `origin/${base}..HEAD`], path));
  if (ahead === 0) throw new Error(`"${branch}" has no commits over origin/${base}. There is nothing to open a PR for.`);
  return ahead;
};

const pushIfNeeded = (path, branch, log) => {
  const { upstream, count } = prBranch.unpushedCount(path, branch);
  if (upstream && count === 0) return;
  log(`Pushing "${branch}" before opening the PR.`);
  pushBranch(branch, path);
};

const createPr = ({ path, branch, base, title, body, draft }) => {
  const args = ['pr', 'create', '--head', branch, '--base', base, '--title', title, '--body', body];
  if (draft) args.push('--draft');
  ghLoud(args, path);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const openVerb = {
  usage: '  brock pr open   [name] --title "<t>" [--body-file <path> | --body "<t>"] [--draft] [--base <ref>]',
  asks: true,
  run: async (positional, options, ctx) => {
    const { workspace, log } = ctx;
    const { name, path, branch } = prBranch.target(positional, ctx);
    const base = typeof options.base === 'string' ? threadBase.branchName(options.base) : threadBase.baseOf(branch, path, workspace).base;
    const title = typeof options.title === 'string' ? options.title : null;
    if (!title) throw new Error(`Usage:\n${openVerb.usage}`);
    const body = bodyFrom(options);
    checkPublishStyle(title, 'The PR title', workspace);
    checkPublishStyle(body, 'The PR body', workspace);
    const open = existingPr(branch, path);
    if (open) {
      log(`"${branch}" already has PR #${open.number}: ${open.url}`);
      log('Push to update it, or close it first when a new one is wanted.');
      return;
    }
    prBranch.warnIfDirty(path, log);
    const ahead = assertHasCommits(path, base, branch);
    pushIfNeeded(path, branch, log);
    log(`Opening a PR for "${branch}" into ${base} (${ahead} commit(s)).`);
    createPr({ path, branch, base, title, body, draft: flag(options, 'draft') });
    const created = existingPr(branch, path);
    if (created) log(`${name} -> PR #${created.number}: ${created.url}`);
  },
};

export { openVerb };
