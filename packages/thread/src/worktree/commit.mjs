/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { git, gitLoud } from '../git.mjs';
import { checkPublishStyle } from '../pr/style.mjs';
import { resolveWorktreeName } from './current.mjs';
import { worktreePathFor } from './paths.mjs';

const MAX_LISTED = 15;
const NO_VERIFY = /^-{1,2}n(o-verify)?$/;

const assertHooksRun = (positional, options) => {
  const asked = Object.keys(options).some((key) => NO_VERIFY.test(`--${key}`)) || positional.some((arg) => NO_VERIFY.test(arg));
  if (asked) throw new Error('--no-verify is refused: this verb runs unattended only because the hooks still fire.');
};

const messageFrom = (options, usage) => {
  if (typeof options['message-file'] === 'string') return readFileSync(options['message-file'], 'utf8').trim();
  if (typeof options.message === 'string') return options.message;
  throw new Error(`Usage:\n${usage}`);
};

const reportStaged = (path, log) => {
  const staged = git(['diff', '--cached', '--name-only'], path).split('\n').filter(Boolean);
  if (staged.length === 0) throw new Error('Nothing to commit: the worktree is clean.');
  const shown = staged.slice(0, MAX_LISTED);
  log(`Committing ${staged.length} file(s):`);
  for (const file of shown) log(`    ${file}`);
  if (staged.length > shown.length) log(`    ...and ${staged.length - shown.length} more`);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const commitVerb = {
  usage: '  brock worktree commit [name] --message "<text>" | --message-file <path>',
  run: async (positional, options, ctx) => {
    assertHooksRun(positional, options);
    const name = resolveWorktreeName(positional);
    const message = messageFrom(options, commitVerb.usage);
    checkPublishStyle(message, 'The commit message', ctx.workspace);
    const path = worktreePathFor(name, ctx.workspace);
    git(['add', '-A'], path);
    reportStaged(path, ctx.log);
    gitLoud(['commit', '-m', message], path);
  },
};

export { commitVerb };
